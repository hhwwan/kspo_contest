import pandas as pd
import os
# 기본적인 정제 코드 / 필요 없는 컬럼 제거, 백분율

# 사용할 파일 (이용, 이용희망, 필요 / 세 파일 전부 각각 가능)
file_path = "이용하는+체육시설(1순위)_성별연령별.csv" # 파일이름은 일단 원본 파일이름으로 했음 

# 이용희망체육시설
#"이용희망체육시설_성별연령별": "이용희망+체육시설_성별연령별.csv",

# 필요체육시설
#"필요체육시설_성별연령별": "필요한+체육시설_성별연령별.csv",

output_file = "이용체육시설_성별연령별정제.csv"

# 제외 키워드 (필요 없는 컬럼 제거)
facility_exclude = ["기타", "사례수", "없다"]

# CSV 읽기
if not os.path.exists(file_path):
    print(f"{file_path} 파일 없음, 종료")
else:
    try:
        df = pd.read_csv(file_path, encoding="utf-8").dropna(how='all')
    except UnicodeDecodeError:
        df = pd.read_csv(file_path, encoding="cp949").dropna(how='all')
    except Exception as e:
        print(f"{file_path} 읽기 실패: {e}")
        df = pd.DataFrame()

    if not df.empty:
        # 컬럼 제외
        keep_cols = [c for c in df.columns if not any(ex.lower() in str(c).lower() for ex in facility_exclude)]

        # 성별연령별은 첫 두 컬럼 고정
        base_cols = list(df.columns[:2])
        refined_cols = base_cols + [c for c in keep_cols if c not in base_cols]
        refined = df[refined_cols].copy()

        # 컬럼명 문자열화
        refined.columns = [str(c) for c in refined.columns]

        # 모두 0인 컬럼 삭제 ( 일단 주석 )
        """
        value_cols = [c for c in refined.columns if c not in base_cols]
        if value_cols:
            cols_to_drop = [col for col in value_cols if (refined[col] == 0).all()]
            if cols_to_drop:
                print(f"삭제되는 컬럼 (모두 0): {cols_to_drop}")
            refined = refined.drop(columns=cols_to_drop) 
        """

        # 백분율 변환
        value_cols = [c for c in refined.columns if c not in base_cols]
        if value_cols:
            row_sums = refined[value_cols].sum(axis=1).replace(0, 1)
            refined[value_cols] = (refined[value_cols].div(row_sums, axis=0) * 100).round(2)


        # CSV 저장
        refined.to_csv(output_file, index=False, encoding="utf-8-sig")
        print("정제 완료 →", output_file)
