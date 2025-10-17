import io
import boto3
import botocore
import botocore.exceptions
import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns
import matplotlib
import platform
from matplotlib import font_manager
from fastapi import APIRouter, Response
from fastapi.responses import JSONResponse

# 화면 없이 파일로 바로 그림 생성
matplotlib.use('Agg')

router = APIRouter()

# Mac, Window 폰트 설정
def set_platform_font():
    system = platform.system()
    if system == 'Darwin': # MacOS
        font_name = 'AppleGothic'
    elif system == 'Windows': # Windows
        font_name = 'Malgun Gothic'
    else:  # Linux
        font_path = '/usr/share/fonts/truetype/nanum/NanumGothic.ttf'
        font_name = font_manager.FontProperties(fname=font_path).get_name()

    matplotlib.rcParams['font.family'] = font_name
    matplotlib.rcParams['axes.unicode_minus'] = False

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
def compute_sdi(use_df: pd.DataFrame, need_df: pd.DataFrame, exclude_cols = ['성별', '연령', '사례수', '없다']):
    # 컬럼 추출 (성별, 연령, 사례수, 없다 제외)
    cols = [c for c in use_df.columns if c not in exclude_cols]

    # 숫자형 변환
    for c in cols:
        use_df[c]  = pd.to_numeric(use_df[c],  errors='coerce')
        need_df[c] = pd.to_numeric(need_df[c], errors='coerce')
    
    # SDI 계산
    sdi_df = need_df[cols] - use_df[cols]

    # 성별, 연령을 인덱스로 지정
    sdi_df['성별연령'] = need_df['성별'].astype(str) + "_" + need_df['연령'].astype(str)
    sdi_df = sdi_df.set_index('성별연령')

    return sdi_df, cols

# 공통 S3 경로
BUCKET = 'kspo'
USE_KEY = 'processed_data/use_facilities/use_gender_age.csv'
NEED_KEY = 'processed_data/need_facilities/need_gender_age.csv'

# 성별연령 목록 API
@router.get("/gender_ages")
def get_gender_ages():
    # csv 파일 읽기
    use_df = read_csv_s3(BUCKET, USE_KEY)
    need_df = read_csv_s3(BUCKET, NEED_KEY)

    # SDI 계산
    sdi_df, _ = compute_sdi(use_df, need_df)

    # 성별연령 목록 리스트
    gender_ages = list(sdi_df.index)
    return JSONResponse(content=gender_ages)


# 각 성별연령별 SDI 시각화
@router.get("/gender_age/{gender_age_name}")
def get_gender_age_sdi(gender_age_name: str):

    # csv 파일 읽기
    use_df = read_csv_s3(BUCKET, USE_KEY)
    need_df = read_csv_s3(BUCKET, NEED_KEY)

    # SDI 계산
    sdi_df, cols = compute_sdi(use_df, need_df)

    if gender_age_name not in sdi_df.index:
        return Response(content=f"성별연령 '{gender_age_name}' 데이터가 없습니다.".encode(), media_type="text/plain")

    # 각 성별연령 그래프 생성
    set_platform_font()
    row = sdi_df.loc[gender_age_name]
    top_gender_age = row[cols].nlargest(10)

    plt.figure(dpi=300)
    sns.barplot(x=top_gender_age.index, y=top_gender_age.values)
    plt.xticks(rotation=45, ha='right')
    plt.title(f'{gender_age_name} 공급부족 상위 10개 체육시설')
    plt.ylabel('공급부족지수')
    plt.xlabel('체육시설')
    plt.tight_layout()

    buf = io.BytesIO()
    plt.savefig(buf, format='png', dpi=300, bbox_inches='tight')
    plt.close()
    buf.seek(0)

    return Response(content=buf.getvalue(), media_type="image/png")