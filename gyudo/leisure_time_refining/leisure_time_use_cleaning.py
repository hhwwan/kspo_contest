import pandas as pd
import os

# 기본적인 정제 코드 / 체육관련컬럼만 남기기, 중복컬럼 제거, 비율 100%로 맞추기

# -----------------------------
# 파일 경로 (필요한 파일만 사용)
# -----------------------------
file_path = "여가 활용방안/여가+활용방안_성별연령별.csv" # 파일이름은 일단 원본 파일이름으로 했음 

# -----------------------------
# 체육활동 키워드 ( 체육 관련 컬럼만 남기는 코드 / 추가 안된게 있었어서 하나씩 보면서 다 추가했음)
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
# 결과 파일 저장
# -----------------------------
output_file = "여가활용방안_성별연령별정제.csv"

# -----------------------------
# 중복 컬럼 이름 정리 함수 (사실 중복은 "등산"만 있음)
# -----------------------------
def get_base_name(col_name):
    if "." in col_name:
        return col_name.split(".")[0]
    if "(" in col_name and ")" in col_name:
        return col_name.split("(")[0]
    return col_name

# -----------------------------
# CSV 읽기
# -----------------------------
if not os.path.exists(file_path):
    print(f"{file_path} 파일 없음")
else:
    try:
        df = pd.read_csv(file_path, encoding="utf-8")
    except UnicodeDecodeError:
        df = pd.read_csv(file_path, encoding="cp949")

    # -----------------------------
    # 체육활동 데이터 정제
    # -----------------------------
    activity_cols = [c for c in df.columns if any(k.lower() in str(c).lower() for k in activity_keywords)]

    # 기준 열: 첫 번째 컬럼 + 성별/연령 포함 ( 그냥 앞 두 컬럼 성별,연령 놔두는 코드 )
    base_cols = [df.columns[0]]
    for col in ["성별", "연령"]:
        if col in df.columns and col not in base_cols:
            base_cols.append(col)

    refined_cols = list(dict.fromkeys(base_cols + activity_cols))
    refined = df[refined_cols]

    # -----------------------------
    # 중복 컬럼 원래 이름 기준으로 합치기
    # -----------------------------
    activity_only = refined[activity_cols].copy()
    new_activity = pd.DataFrame(index=activity_only.index)

    for col in activity_only.columns:
        base = get_base_name(col)
        if base in new_activity.columns:
            new_activity[base] += activity_only[col]
        else:
            new_activity[base] = activity_only[col]

    activity_only = new_activity

    # -----------------------------
    # 모든 값이 0인 컬럼 삭제( 일단 주석 처리 해놨음 )
    # -----------------------------
    #cols_to_drop = [col for col in activity_only.columns if (activity_only[col] == 0).all()]
    #if cols_to_drop:
        #print(f"삭제되는 컬럼 (모두 0): {cols_to_drop}")
    #activity_only = activity_only.drop(columns=cols_to_drop)

    # -----------------------------
    # 체육활동 비율 계산 ( 체육활동이 아닌 컬럼은 없앴으니 나머지 컬럼들도 비율 100% 만들기)
    # -----------------------------
    row_sums = activity_only.sum(axis=1).replace(0, 1)
    activity_only = (activity_only.div(row_sums, axis=0) * 100).round(2)

    # 기준 컬럼 + 비율 합치기
    refined_final = pd.concat([refined[base_cols], activity_only], axis=1)

    # -----------------------------
    # CSV 저장
    # -----------------------------
    refined_final.to_csv(output_file, index=False, encoding="utf-8-sig")
    print("정제 완료 CSV 파일 생성:", output_file)