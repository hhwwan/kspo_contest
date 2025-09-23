import pandas as pd

# 각 파일 불러오기
file_info = [
    # 도시규모별 파일
    {
        'files': [
            '수요_공급/이용하는+체육시설(1순위)_도시규모별.csv',
            '수요_공급/이용희망+체육시설_도시규모별.csv',
            '수요_공급/필요한+체육시설_도시규모별.csv'
        ],
        'save_paths': [
            '수요_공급/use_city_size.csv',
            '수요_공급/wish_city_size.csv',
            '수요_공급/need_city_size.csv'
        ],
        'key_cols': ['도시규모']
    },
    # 성별연령별 파일
    {
        'files': [
            '수요_공급/이용하는+체육시설(1순위)_성별연령별.csv',
            '수요_공급/이용희망+체육시설_성별연령별.csv',
            '수요_공급/필요한+체육시설_성별연령별.csv'
        ],
        'save_paths': [
            '수요_공급/use_gender_age.csv',
            '수요_공급/wish_gender_age.csv',
            '수요_공급/need_gender_age.csv'
        ],
        'key_cols': ['성별', '연령']
    },
    # 지역별 파일
    {
        'files': [
            '수요_공급/이용하는+체육시설(1순위)_지역별.csv',
            '수요_공급/이용희망+체육시설_지역별.csv',
            '수요_공급/필요한+체육시설_지역별.csv'
        ],
        'save_paths': [
            '수요_공급/use_region.csv',
            '수요_공급/wish_region.csv',
            '수요_공급/need_region.csv'
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

# 컬럼 합잡합
all_cols = set()

for group in file_info:
    # 각 파일 읽어오기
    for file_path in group['files']:
        df = pd.read_csv(file_path)

        # 비슷한 컬럼 통일
        df.rename(columns=rename_map, inplace=True) # DataFrame 자체를 바로 수정

        # 컬럼 합집합 = 모든 컬럼 - 각 파일 주요 컬럼
        feature_cols = set(df.columns) - set(group['key_cols']) - {'사례수'}
        all_cols |= feature_cols

# 공통 처리 함수
def process_file(file_path, key_cols, save_path):
    df = pd.read_csv(file_path)
    df.rename(columns=rename_map, inplace=True)

    # 새로운 컬럼들은 0.0으로 채우기
    for col in all_cols:
        if col not in df.columns:
            df[col] = 0.0
    
    # 컬럼 순서 정렬
    col_order = key_cols + sorted(all_cols) + ['사례수']
    df = df[col_order]

    # 저장
    df.to_csv(save_path, index=False)
    print(f'Save: {save_path}')

# main / 모든 파일 처리
for group in file_info:
    for file_path, save_path in zip(group['files'], group['save_paths']):
        process_file(file_path, group['key_cols'], save_path)