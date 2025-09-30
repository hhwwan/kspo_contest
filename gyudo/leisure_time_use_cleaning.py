import pandas as pd
import boto3
from io import StringIO

# -----------------------------
# S3 버킷/객체 정보
# -----------------------------
bucket_name = "kspo"
file_key = "raw_data/leisure_activity/activity_gender_age.csv"
output_key = "processed_data/leisure_activity/leisure_activity_gender_age.csv"  # 결과 저장 경로

# -----------------------------
# 체육활동 키워드
# -----------------------------
activity_keywords = [
    "산책","걷기","등산","자전거","수영","헬스",
    "축구","농구","배드민턴","테니스","골프","스포츠",
    "에어로빅","족구","댄스스포츠","볼링","체조","게이트볼",
    "태권도","육상","마라톤","산악자전거","승마","수중스포츠","스키",
    "스노우보드","유도","무도","라켓볼","웨이크보드","스케이팅",
    "패러글라이딩","수상스키","피겨스케이팅","미식축구","요가","줄넘기_훌라후프",
    "당구","탁구","야구","스쿼시","춤_무용","격투기","암벽등반","검도","배구",
    "인라인스케이트","스킨스쿠버","권투","그라운드골프","서바이벌"
]

# -----------------------------
# 중복 컬럼 이름 정리 함수
# -----------------------------
def get_base_name(col_name):
    if "." in col_name:
        return col_name.split(".")[0]
    if "(" in col_name and ")" in col_name:
        return col_name.split("(")[0]
    return col_name

# -----------------------------
# S3에서 CSV 읽기 (여러 인코딩 시도)
# -----------------------------
s3 = boto3.client("s3")
obj = s3.get_object(Bucket=bucket_name, Key=file_key)
content = obj["Body"].read()

# 시도할 인코딩 목록
encodings_to_try = ["utf-8", "cp949", "euc-kr"]

df = None
for enc in encodings_to_try:
    try:
        df = pd.read_csv(StringIO(content.decode(enc)), encoding=enc)
        print(f"✅ 인코딩 성공: {enc}")
        break
    except Exception as e:
        print(f"⚠️ 인코딩 실패 ({enc}): {e}")

if df is None:
    raise ValueError("❌ CSV 파일을 utf-8, cp949, euc-kr 인코딩으로 읽을 수 없습니다.")

# -----------------------------
# 정제 로직
# -----------------------------
# 체육활동 컬럼만 선택
activity_cols = [c for c in df.columns if any(k.lower() in str(c).lower() for k in activity_keywords)]

# 기준 컬럼: 첫 컬럼 + 성별/연령
base_cols = [df.columns[0]]
for col in ["성별","연령"]:
    if col in df.columns and col not in base_cols:
        base_cols.append(col)

refined_cols = list(dict.fromkeys(base_cols + activity_cols))
refined = df[refined_cols]

# 중복 컬럼 합치기
activity_only = refined[activity_cols].copy()
new_activity = pd.DataFrame(index=activity_only.index)

for col in activity_only.columns:
    base = get_base_name(col)
    if base in new_activity.columns:
        new_activity[base] += activity_only[col]
    else:
        new_activity[base] = activity_only[col]

activity_only = new_activity

# 비율 계산
row_sums = activity_only.sum(axis=1).replace(0, 1)
activity_only = (activity_only.div(row_sums, axis=0) * 100).round(2)

# 기준 컬럼 + 비율 합치기
refined_final = pd.concat([refined[base_cols], activity_only], axis=1)

# -----------------------------
# CSV 저장 (S3 업로드)
# -----------------------------
csv_buffer = StringIO()
refined_final.to_csv(csv_buffer, index=False, encoding="utf-8-sig")

s3.put_object(
    Bucket=bucket_name,
    Key=output_key,
    Body=csv_buffer.getvalue()
)

print(f"S3에 CSV 업로드 완료: s3://{bucket_name}/{output_key}")
