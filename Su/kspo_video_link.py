import boto3
import pandas as pd
from io import StringIO

# S3 설정
bucket_name = "kspo"
input_key = "raw_data/kspo_physical_100/kspo_video_link.csv"   # 원본 파일
output_key = "processed_data/kspo_physical_100/kspo_video_link.csv"  # 결과 저장 경로

s3 = boto3.client("s3")

# S3에서 파일 가져오기
obj = s3.get_object(Bucket=bucket_name, Key=input_key)
content = obj["Body"].read()

# 여러 인코딩 시도
encodings_to_try = ["utf-8", "cp949", "euc-kr", "latin1"]
df = None
for enc in encodings_to_try:
    try:
        df = pd.read_csv(StringIO(content.decode(enc)), encoding=enc).dropna(how="all")
        print(f"✅ 인코딩 성공: {enc}")
        break
    except Exception as e:
        print(f"⚠️ 인코딩 실패 ({enc}): {e}")

if df is None:
    raise ValueError(f"❌ CSV 파일을 {encodings_to_try} 인코딩으로 읽을 수 없습니다: {input_key}")

# 키워드 사전 정의
indoor_keywords = [
    "집콕", "홈트", "요가", "댄스", "아령", "밴드", "의자", "근력", "유연성"
]

outdoor_keywords = [
    "달리기", "뛰기", "줄넘기", "계단", "박스", "야외", "점프",
    "등산", "마라톤", "빙판길", "콘", "훌라후프", "라켓", "제자리 멀리뛰기", "공", "드리블", "패스"
]

# 실내/실외 판별 함수
def classify_location(row):
    title = str(row.get("제목", ""))
    mid = str(row.get("중분류", ""))
    sub = str(row.get("소분류", ""))

    if any(keyword in title for keyword in outdoor_keywords) or \
       any(keyword in sub for keyword in outdoor_keywords) or \
       any(keyword in mid for keyword in outdoor_keywords):
        return "실외운동"

    if any(keyword in title for keyword in indoor_keywords) or \
       any(keyword in sub for keyword in indoor_keywords) or \
       any(keyword in mid for keyword in indoor_keywords):
        return "실내운동"

    return "실내운동"

# 새로운 컬럼 추가
df["운동장소구분"] = df.apply(classify_location, axis=1)

# DataFrame → CSV 문자열 변환 후 S3 업로드
csv_buffer = StringIO()
df.to_csv(csv_buffer, index=False, encoding="utf-8-sig")

s3.put_object(
    Bucket=bucket_name,
    Key=output_key,
    Body=csv_buffer.getvalue(),
    ContentType="text/csv; charset=utf-8"
)

print(f"🎉 S3에 저장 완료: s3://{bucket_name}/{output_key}")
