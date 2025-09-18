# 도시규모별 파일 통합

import pandas as pd

# csv 파일 읽기 -> 로컬마다 파일 위치 다르니 파일 위치 변경 필요
# 추후 S3에서 읽어오는 코드로 수정해야함
weekday = pd.read_csv('평일_여가시간/하루+여가시간(평일)_도시규모별.csv')
holiday = pd.read_csv('휴일_여가시간/하루+여가시간(휴일)_도시규모별.csv')

# 컬럼명 통일 -> 파일마다 첫 행 확인 필요
weekday.rename(columns={'규모': '도시규모'}, inplace=True) # DataFrame 자체를 바로 수정
holiday.rename(columns={'도시': '도시규모'}, inplace=True)

# 구분 컬럼 추가
weekday['구분'] = '평일'
holiday['구분'] = '휴일'

# 컬럼 순서 맞추기
cols = ['도시규모', '구분'] + [c for c in weekday.columns if c not in ['도시규모', '구분']]
weekday = weekday[cols]
holiday = holiday[cols]

# 파일 병합
merged = pd.concat([weekday, holiday], ignore_index=True) # 기존 인덱스 무시하고 새로 부여

# 병합한 파일 저장
# 저장 또한 추후 S3에 저장하는 코드로 변경해야함
merged.to_csv('여가시간_평일_휴일_합본/city_scale.csv', index=False, encoding='utf-8-sig') # DataFrame의 인덱스를 컬럼으로 저장하지 않음

print('city_scale.csv 저장완료')