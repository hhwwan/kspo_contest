import pandas as pd
import boto3
from io import StringIO

# -----------------------------
# S3 버킷/객체 정보
# -----------------------------
bucket_name = "kspo"
file_key = "raw_data/use_facilities/use_gender_age.csv"
output_key = "processed_data/use_facilities/use_gender_age.csv"  # 결과 저장 경로

# -----------------------------
# 제외 키워드
# -----------------------------
facility_exclude = ["기타", "사례수", "없다"]

# -----------------------------
# S3에서 CSV 읽기 (여러 인코딩 시도)
# -----------------------------
s3 = boto3.client("s3")
obj = s3.get_object(Bucket=bucket_name, Key=file_key)
content = obj["Body"].read()

encodings_to_try = ["utf-8", "cp949", "euc-kr"]
df = None
for enc in encodings_to_try:
    try:
        df = pd.read_csv(StringIO(content.decode(enc)), encoding=enc).dropna(how="all")
        print(f"✅ 인코딩 성공: {enc}")
        break
    except Exception as e:
        print(f"⚠️ 인코딩 실패 ({enc}): {e}")

if df is None:
    raise ValueError(f"❌ CSV 파일을 {encodings_to_try} 인코딩으로 읽을 수 없습니다: {file_key}")

# -----------------------------
# 컬럼 제외
# -----------------------------
keep_cols = [c for c in df.columns if not any(ex.lower() in str(c).lower() for ex in facility_exclude)]

# 성별/연령 컬럼 고정
base_cols = list(df.columns[:2])
refined_cols = base_cols + [c for c in keep_cols if c not in base_cols]
refined = df[refined_cols].copy()

# 컬럼명 문자열화
refined.columns = [str(c) for c in refined.columns]

# -----------------------------
# 백분율 변환
# -----------------------------
value_cols = [c for c in refined.columns if c not in base_cols]
if value_cols:
    row_sums = refined[value_cols].sum(axis=1).replace(0, 1)
    refined[value_cols] = (refined[value_cols].div(row_sums, axis=0) * 100).round(2)

# -----------------------------
# CSV 저장 (S3 업로드)
# -----------------------------
csv_buffer = StringIO()
refined.to_csv(csv_buffer, index=False, encoding="utf-8-sig")

s3.put_object(
    Bucket=bucket_name,
    Key=output_key,
    Body=csv_buffer.getvalue()
)

print(f"✅ 정제 완료 → S3 업로드: s3://{bucket_name}/{output_key}")
