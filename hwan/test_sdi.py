import os
import io
import platform
import boto3
import botocore
import botocore.exceptions
import matplotlib.pyplot as plt
import seaborn as sns
import pandas as pd
import matplotlib

# Mac, Window 폰트 설정
def set_platform_font():
    system = platform.system()
    if system == 'Darwin': # MacOS
        font_name = 'AppleGothic'
    elif system == 'Windows': # Windows
        font_name = 'Malgun Gothic'

    matplotlib.rcParams['font.family'] = font_name
    matplotlib.rcParams['axes.unicode_minus'] = False  # 음수 부호 깨짐 방지

# S3에서 csv파일 읽어오기
def read_csv_s3(bucket: str, key: str) -> pd.DataFrame:
    s3 = boto3.client('s3')

    try: # 오류를 대비한 예외처리
        resp = s3.get_object(Bucket=bucket, Key=key)
    except botocore.exceptions.ClientError as e:
        raise RuntimeError (f"S3에서 객체를 가져오지 못했습니다. Bucket='{bucket}', Key='{key}'\n원인: {e}")
    
    raw = resp['Body'].read()

    # 인코딩 오류 발생시 utf-8 -> cp949 -> euc-kr 순으로 재시도
    enc_try_list = ['utf-8', 'cp949', 'euc-kr']   
    for enc in enc_try_list:
        if not enc:
            continue
        try:
            df = pd.read_csv(io.BytesIO(raw), encoding=enc)
            print(f"읽기 성공: {key} (encoding={enc})")
            return df
        except UnicodeDecodeError: # 다음 인코딩 시도
            continue
        except Exception as e: # 인코딩 문제가 아닌 예외는 바로 던짐
            print(f"pd.read_csv 시 예외 발생 (encoding={enc}): {e}")
            raise

# SDI 계산
def compute_sdi(use_df: pd.DataFrame, need_df: pd.DataFrame, exclude_cols = ['지역', '사례수', '없다']):
    # 컬럼 추출 (지역, 사례수 제외)
    cols = [c for c in use_df.columns if c not in exclude_cols]

    # 숫자형 변환
    for c in cols:
        use_df[c]  = pd.to_numeric(use_df[c],  errors='coerce')
        need_df[c] = pd.to_numeric(need_df[c], errors='coerce')
    
    # SDI 계산
    sdi_df = need_df[cols] - use_df[cols]

    # 지역명을 인덱스로 지정
    sdi_df['지역'] = need_df['지역']
    sdi_df = sdi_df.set_index('지역')

    return sdi_df, cols

# 전국 평균 SDI 시각화
def plot_national_sdi(sdi_df, cols, top_n = 10, save_path = 'sdi_national_mean.png'):
    # 전체 평균 후 상위 n개
    top_sdi = sdi_df.mean().sort_values(ascending=False).head(top_n)

    # 시각화
    set_platform_font()
    plt.figure(figsize=(12,6))
    sns.barplot(x=top_sdi.index, y=top_sdi.values)
    plt.xticks(rotation=45, ha='right')
    plt.title(f'전국 평균 SDI (상위 {top_n}) 체육시설')
    plt.ylabel('SDI (필요비율 - 이용비율)')
    plt.xlabel('체육시설')
    plt.tight_layout()

    # 파일로 저장
    plt.savefig(save_path, dpi=300, bbox_inches='tight')
    plt.close()
    print(f'[저장 완료] 전국 평균 SDI: {save_path}')

# 각 지역별 SDI 시각화
def plot_region_sdi(sdi_df, cols, top_n = 10, out_dir = 'region_sdi'):
    set_platform_font()
    os.makedirs(out_dir, exist_ok=True)

    for idx, row in sdi_df.iterrows():
        region = idx
        top_region = row[cols].nlargest(top_n)

        plt.figure(figsize=(12,6))
        sns.barplot(x=top_region.index, y=top_region.values)
        plt.xticks(rotation=45, ha='right')
        plt.title(f'{region} SDI 상위 {top_n} 체육시설')
        plt.ylabel('SDI (필요비율 - 이용비율)')
        plt.xlabel('체육시설')
        plt.tight_layout()
    
        save_path = os.path.join(out_dir, f'sdi_{region}.png')
        plt.savefig(save_path, dpi=300, bbox_inches='tight')
        plt.close()
        print(f"[저장 완료] 지역별 SDI: {save_path}")


# Main 코드
if __name__== '__main__':
    # S3 정보
    BUCKET = 'kspo'
    USE_KEY = 'processed_data/use_facilities/use_region.csv'
    NEED_KEY = 'processed_data/need_facilities/need_region.csv'

    # csv 파일 읽기
    use_df = read_csv_s3(BUCKET, USE_KEY)
    need_df = read_csv_s3(BUCKET, NEED_KEY)

    # SDI 계산
    sdi_df, cols = compute_sdi(use_df, need_df)

    # 전국 평균 SDI 시각화
    plot_national_sdi(sdi_df, cols, top_n = 10)

    # 지역별 SDI 시각화
    plot_region_sdi(sdi_df, cols, top_n = 10, out_dir = 'region_sdi')