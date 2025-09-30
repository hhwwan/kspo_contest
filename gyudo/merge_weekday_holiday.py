import pandas as pd
import boto3
from io import StringIO

# -----------------------------
# S3 정보
# -----------------------------
bucket_name = "kspo"
weekday_key = "raw_data/weekday_leisure_time/weekday_gender_age.csv"
holiday_key = "raw_data/holiday_leisure_time/holiday_gender_age.csv"
output_key = "processed_data/leisure_time/leisure_time_gender_age.csv"  # 결과 저장 경로

# -----------------------------
# boto3 클라이언트
# -----------------------------
s3 = boto3.client("s3")

def read_s3_csv(bucket, key):
    """S3에서 CSV 읽어 DataFrame으로 반환 (utf-8, cp949, euc-kr 순차 시도)"""
    obj = s3.get_object(Bucket=bucket, Key=key)
    content = obj["Body"].read()

    encodings_to_try = ["utf-8", "cp949", "euc-kr"]
    for enc in encodings_to_try:
        try:
            df = pd.read_csv(StringIO(content.decode(enc)), encoding=enc)
            print(f"✅ 인코딩 성공: {enc} ({key})")
            return df
        except Exception as e:
            print(f"⚠️ 인코딩 실패 ({enc}, {key}): {e}")
    raise ValueError(f"❌ CSV 파일을 {encodings_to_try} 인코딩으로 읽을 수 없습니다: {key}")

# -----------------------------
# CSV 읽기
# -----------------------------
weekday = read_s3_csv(bucket_name, weekday_key)
holiday = read_s3_csv(bucket_name, holiday_key)

# 구분 컬럼 추가
weekday["구분"] = "평일"
holiday["구분"] = "휴일"

# 컬럼 순서 맞추기
cols = ["성별", "연령", "구분"] + [c for c in weekday.columns if c not in ["성별", "연령", "구분"]]
weekday = weekday[cols]
holiday = holiday[cols]

# 파일 병합
merged = pd.concat([weekday, holiday], ignore_index=True)

# -----------------------------
# CSV 저장 (S3 업로드)
# -----------------------------
csv_buffer = StringIO()
merged.to_csv(csv_buffer, index=False, encoding="utf-8-sig")

s3.put_object(
    Bucket=bucket_name,
    Key=output_key,
    Body=csv_buffer.getvalue()
)

print(f"✅ S3에 CSV 업로드 완료: s3://{bucket_name}/{output_key}")
