import matplotlib.pyplot as plt
import seaborn as sns
import pandas as pd
import matplotlib

# Mac 기본 한글 폰트 설정 -> 윈도우에서 실행하면 필요없을지도?
matplotlib.rcParams['font.family'] = 'AppleGothic'
matplotlib.rcParams['axes.unicode_minus'] = False  # 음수 부호 깨짐 방지

use_df  = pd.read_csv('수요_공급/use_region.csv')
need_df = pd.read_csv('수요_공급/need_region.csv')

# 도시규모별 SDI 계산: SDI = 필요비율 - 이용비율
# 숫자 컬럼만 추출 (지역, 사례수 제외)
cols = [c for c in use_df.columns if c not in ['지역', '사례수']]

# SDI 계산
sdi_df = need_df[cols] - use_df[cols]
sdi_df['지역'] = need_df['지역']

# 도시규모별 TOP 10 시설 선택
top_n = 10

# 도시 각각이 아닌 도시 전체 평균 -> 각각 하려면 코드 수정 필요할듯 일단 프로토타입이니까~
top_sdi = sdi_df[cols].mean().sort_values(ascending=False).head(top_n)

# 시각화
plt.figure(figsize=(12,6))
sns.barplot(x=top_sdi.index, y=top_sdi.values, palette='viridis')
plt.xticks(rotation=45, ha='right')
plt.title('지역별 SDI 상위 10 체육시설')
plt.ylabel('SDI (필요비율 - 이용비율)')
plt.xlabel('체육시설')
plt.tight_layout()
plt.show()