import pandas as pd
import boto3
from io import StringIO

# S3 설정
bucket_name = 'kspo'
s3 = boto3.client('s3')

# 각 파일 불러오기
file_info = [
    # 도시규모별 파일
    {
        'files': [
            'raw_data/use_facilities/use_city_size.csv',
            'raw_data/wish_facilities/wish_city_size.csv',
            'raw_data/need_facilities/need_city_size.csv'
        ],
        'save_paths': [
            'processed_data/use_facilities/use_city_size.csv',
            'processed_data/wish_facilities/wish_city_size.csv',
            'processed_data/need_facilities/need_city_size.csv'
        ],
        'key_cols': ['도시규모']
    },
    # 성별연령별 파일
    {
        'files': [
            'raw_data/use_facilities/use_gender_age.csv',
            'raw_data/wish_facilities/wish_gender_age.csv',
            'raw_data/need_facilities/need_gender_age.csv'
        ],
        'save_paths': [
            'processed_data/use_facilities/use_gender_age.csv',
            'processed_data/wish_facilities/wish_gender_age.csv',
            'processed_data/need_facilities/need_gender_age.csv'
        ],
        'key_cols': ['성별', '연령']
    },
    # 지역별 파일
    {
        'files': [
            'raw_data/use_facilities/use_region.csv',
            'raw_data/wish_facilities/wish_region.csv',
            'raw_data/need_facilities/need_region.csv'
        ],
        'save_paths': [
            'processed_data/use_facilities/use_region.csv',
            'processed_data/wish_facilities/wish_region.csv',
            'processed_data/need_facilities/need_region.csv'
        ],
        'key_cols': ['지역']
    }
]

# 비슷한 컬럼 미리 통일
rename_map = {
    '교회 등 종교시설의 체육시설': '종교시설의 체육시설',
    '(YMCA)의 운동시설': 'YMCA의 운동시설',
    '(YWCA)의 운동시설': 'YWCA의 운동시설'
}

# S3에서 csv 읽기 & 쓰기
def read_csv_s3(key: str, encoding: str = 'cp949') -> pd.DataFrame:
    obj = s3.get_object(Bucket=bucket_name, Key=key)
    raw = obj['Body'].read()

    # 지정한 인코딩으로 디코딩 후, StringIO로 파일처럼 처리
    text = raw.decode(encoding, errors='replace')
    return pd.read_csv(StringIO(text)) # 파일처럼 동작하는 객체

def write_csv_s3(df: pd.DataFrame, key: str):
    buffer = StringIO()
    df.to_csv(buffer, index=False)
    s3.put_object(Bucket=bucket_name, Key=key, Body=buffer.getvalue())
    print(f"Save: s3://{bucket_name}/{key}")

# 컬럼 합잡합
all_cols = set()

for group in file_info:
    # 각 파일 읽어오기
    for file_path in group['files']:
        df = read_csv_s3(file_path)

        # 비슷한 컬럼 통일
        df.rename(columns=rename_map, inplace=True) # DataFrame 자체를 바로 수정

        # 컬럼 합집합 = 모든 컬럼 - 각 파일 주요 컬럼
        feature_cols = set(df.columns) - set(group['key_cols']) - {'사례수'}
        all_cols |= feature_cols

# 공통 처리 함수
def process_file(file_path: str, key_cols: list, save_path: str):
    df = read_csv_s3(file_path)
    df.rename(columns=rename_map, inplace=True)

    # 새로운 컬럼들은 0.0으로 채우기
    for col in all_cols:
        if col not in df.columns:
            df[col] = 0.0
    
    # 컬럼 순서 정렬
    col_order = key_cols + sorted(all_cols) + ['사례수']
    df = df[col_order]

    write_csv_s3(df, save_path)

# main / 모든 파일 처리
if __name__ == "__main__":
    for group in file_info:
        for file_path, save_path in zip(group['files'], group['save_paths']):
            process_file(file_path, group['key_cols'], save_path)