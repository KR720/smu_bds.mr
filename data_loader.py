import csv
from pathlib import Path


def convert_to_int(value, default=0):
    """
    CSV 문자열을 정수로 변환한다.
    빈칸이나 잘못된 값이면 default를 반환한다.
    """
    try:
        cleaned_value = str(value).replace(",", "").strip()

        if cleaned_value == "":
            return default

        return int(float(cleaned_value))

    except (ValueError, TypeError):
        return default


def convert_to_float(value, default=0.0):
    """
    CSV 문자열을 실수로 변환한다.
    """
    try:
        cleaned_value = str(value).replace(",", "").strip()

        if cleaned_value == "":
            return default

        return float(cleaned_value)

    except (ValueError, TypeError):
        return default


def split_keywords(value):
    """
    저렴함|양많음 형태의 문자열을 리스트로 변환한다.
    """
    if not value:
        return []

    return [
        keyword.strip()
        for keyword in str(value).split("|")
        if keyword.strip()
    ]


def load_flook_data():
    """
    FLOOK.csv를 읽어서 계산 가능한 형태의
    딕셔너리 리스트로 반환한다.
    """

    current_directory = Path(__file__).resolve().parent
    csv_path = current_directory / "FLOOK.csv"

    data = []

    try:
        with csv_path.open(
            mode="r",
            encoding="utf-8-sig",
            newline=""
        ) as file:

            reader = csv.DictReader(file)

            if reader.fieldnames is None:
                print("오류: CSV 파일에 열 이름이 없습니다.")
                return []

            print("CSV 열 이름:")
            print([
                field.strip()
                for field in reader.fieldnames
                if field
            ])
            print()

            for row_number, row in enumerate(reader, start=2):

                # 열 이름과 데이터 앞뒤 공백 제거
                cleaned_row = {}

                for key, value in row.items():
                    if key is None:
                        continue

                    clean_key = key.strip()

                    if isinstance(value, str):
                        clean_value = value.strip()
                    else:
                        clean_value = value

                    cleaned_row[clean_key] = clean_value

                # 완전히 빈 행은 무시
                if not any(cleaned_row.values()):
                    continue

                store = {
                    "store_id": convert_to_int(
                        cleaned_row.get("store_id")
                    ),

                    "store_name": cleaned_row.get(
                        "store_name",
                        ""
                    ),

                    "category": cleaned_row.get(
                        "category",
                        ""
                    ),

                    "menu_name": cleaned_row.get(
                        "menu_name",
                        ""
                    ),

                    "menu_price": convert_to_int(
                        cleaned_row.get("menu_price")
                    ),

                    "rating": convert_to_float(
                        cleaned_row.get("rating")
                    ),

                    "review_count": convert_to_int(
                        cleaned_row.get("review_count")
                    ),

                    "delivery_fee": convert_to_int(
                        cleaned_row.get("delivery_fee")
                    ),

                    "coupon_discount": convert_to_int(
                        cleaned_row.get("coupon_discount")
                    ),

                    "min_order_price": convert_to_int(
                        cleaned_row.get("min_order_price")
                    ),

                    "takeout_discount": convert_to_int(
                        cleaned_row.get("takeout_discount")
                    ),

                    "estimated_delivery_time": convert_to_int(
                        cleaned_row.get(
                            "estimated_delivery_time"
                        )
                    ),

                    "positive_keywords": split_keywords(
                        cleaned_row.get("positive_keywords")
                    ),

                    # CSV의 negtive 오타를 Python에서는
                    # negative_keywords로 정상화한다.
                    "negative_keywords": split_keywords(
                        cleaned_row.get("negtive_keywords")
                    )
                }

                data.append(store)

    except FileNotFoundError:
        print("오류: FLOOK.csv 파일을 찾을 수 없습니다.")
        print(f"확인한 경로: {csv_path}")
        return []

    except UnicodeDecodeError:
        print("오류: CSV 문자 인코딩을 읽지 못했습니다.")
        print("UTF-8 형식으로 다시 저장해주세요.")
        return []

    except csv.Error as error:
        print("오류: CSV를 읽는 중 문제가 발생했습니다.")
        print(error)
        return []#안녕

    return data