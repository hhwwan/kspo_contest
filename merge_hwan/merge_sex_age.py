import pandas as pd

# csv 파일 읽기
weekday = pd.read_csv('평일_여가시간/하루+여가시간(평일)_성별연령별.csv')
holiday = pd.read_csv('휴일_여가시간/하루+여가시간(휴일)_성별연령별.csv')

# 구분 컬럼 추가
weekday['구분'] = '평일'
holiday['구분'] = '휴일'

# 컬럼 순서 맞추기
cols = ['성별', '연령', '구분'] + [c for c in weekday.columns if c not in ['성별', '연령', '구분']]
weekday = weekday[cols]
holiday = holiday[cols]

# 파일 병합
merged = pd.concat([weekday, holiday], ignore_index=True) # 기존 인덱스 무시하고 새로 부여

# 병합한 파일 저장
merged.to_csv('여가시간_평일_휴일_합본/sex_age.csv', index=False, encoding='utf-8-sig') # DataFrame의 인덱스를 컬럼으로 저장하지 않음

print('sex_age.csv 저장완료')