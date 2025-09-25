import boto3
import pandas as pd
from io import StringIO

# S3 설정
bucket_name = "kspo"
file_key = "raw_data/kspo_physical_100/kspo_video_link.csv"  # S3에 있는 실제 파일명

s3 = boto3.client("s3")

# CSV 불러오기 (한글 인코딩 대응)
obj = s3.get_object(Bucket=bucket_name, Key=file_key)

try:
    df = pd.read_csv(StringIO(obj['Body'].read().decode("cp949")))
except UnicodeDecodeError:
    try:
        df = pd.read_csv(StringIO(obj['Body'].read().decode("euc-kr")))
    except UnicodeDecodeError:
        df = pd.read_csv(StringIO(obj['Body'].read().decode("latin1")))

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
    title = str(row["제목"])
    mid = str(row["중분류"])
    sub = str(row["소분류"])

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

# CSV 저장 (엑셀에서 한글 안 깨지도록 utf-8-sig 사용)
df.to_csv("processed_kspo_video_link.csv", index=False, encoding="utf-8-sig")

print("processed_kspo_video_link.csv 저장")
