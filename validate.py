# validate.py

from data_loader import load_flook_data
from app import recommend_stores


def print_result_table(recommendations):
    """
    추천 결과를 간단한 표 형태로 출력한다.
    """

    if not recommendations:
        print("추천 결과가 없습니다.")
        return

    print("-" * 90)
    print(
        f"{'순위':<6}"
        f"{'매장명':<15}"
        f"{'메뉴':<18}"
        f"{'최종가격':<12}"
        f"{'평점':<8}"
        f"{'배달시간':<10}"
        f"{'추천점수':<10}"
    )
    print("-" * 90)

    for rank, store in enumerate(recommendations, start=1):
        print(
            f"{rank:<6}"
            f"{store['store_name']:<15}"
            f"{store['menu_name']:<18}"
            f"{store['final_price']:<12,}"
            f"{store['rating']:<8}"
            f"{store['estimated_delivery_time']:<10}"
            f"{store['score']:<10}"
        )

    print("-" * 90)


def check_result(condition, message):
    """
    조건이 맞으면 PASS, 틀리면 FAIL을 출력한다.
    """
    if condition:
        print(f"[PASS] {message}")
        return True

    print(f"[FAIL] {message}")
    return False


def run_test_case(
    stores,
    test_name,
    budget,
    category,
    priority
):
    """
    하나의 추천 테스트를 실행한다.
    """

    print()
    print("=" * 90)
    print(f"테스트: {test_name}")
    print("=" * 90)
    print(f"예산: {budget:,}원")
    print(f"카테고리: {category}")
    print(f"우선순위: {priority}")
    print()

    recommendations = recommend_stores(
        stores,
        budget,
        category,
        priority
    )

    print_result_table(recommendations)

    return recommendations


def main():
    stores = load_flook_data()

    if not stores:
        print("검증할 데이터를 불러오지 못했습니다.")
        return

    print(f"총 {len(stores)}개 매장의 검증을 시작합니다.")

    passed_tests = 0
    total_tests = 0

    # --------------------------------------------------
    # 테스트 1
    # 예산 20,000원, 전체 카테고리, 균형 추천
    # 황금치킨이 평점과 배달시간에서 유리할 가능성이 높다.
    # --------------------------------------------------

    result_1 = run_test_case(
        stores=stores,
        test_name="전체 카테고리 균형 추천",
        budget=20000,
        category="전체",
        priority="균형"
    )

    total_tests += 1

    if check_result(
        len(result_1) == 3,
        "예산 20,000원에서 3개 매장이 모두 추천된다."
    ):
        passed_tests += 1

    total_tests += 1

    if check_result(
        result_1
        and result_1[0]["store_name"] == "황금치킨",
        "균형 추천의 1위가 황금치킨이다."
    ):
        passed_tests += 1

    # --------------------------------------------------
    # 테스트 2
    # 가성비 우선 추천
    # 청춘분식은 최종 결제금액이 가장 저렴하다.
    # --------------------------------------------------

    result_2 = run_test_case(
        stores=stores,
        test_name="가성비 우선 추천",
        budget=20000,
        category="전체",
        priority="가성비"
    )

    total_tests += 1

    if check_result(
        result_2
        and result_2[0]["store_name"] == "청춘분식",
        "가성비 추천의 1위가 청춘분식이다."
    ):
        passed_tests += 1

    # --------------------------------------------------
    # 테스트 3
    # 예산 15,000원
    # 최종 가격 13,500원인 청춘분식만 주문 가능하다.
    # --------------------------------------------------

    result_3 = run_test_case(
        stores=stores,
        test_name="낮은 예산 필터링",
        budget=15000,
        category="전체",
        priority="균형"
    )

    total_tests += 1

    if check_result(
        len(result_3) == 1,
        "예산 15,000원에서는 한 개 매장만 추천된다."
    ):
        passed_tests += 1

    total_tests += 1

    if check_result(
        result_3
        and result_3[0]["store_name"] == "청춘분식",
        "예산 15,000원에서 청춘분식만 추천된다."
    ):
        passed_tests += 1

    # --------------------------------------------------
    # 테스트 4
    # 치킨 카테고리 필터
    # 청춘분식이 결과에 나오면 안 된다.
    # --------------------------------------------------

    result_4 = run_test_case(
        stores=stores,
        test_name="치킨 카테고리 필터링",
        budget=20000,
        category="치킨",
        priority="균형"
    )

    total_tests += 1

    if check_result(
        all(
            store["category"] == "치킨"
            for store in result_4
        ),
        "치킨 카테고리 결과에는 치킨 매장만 포함된다."
    ):
        passed_tests += 1

    # --------------------------------------------------
    # 최종 검증 결과
    # --------------------------------------------------

    print()
    print("=" * 90)
    print("검증 결과")
    print("=" * 90)
    print(f"통과: {passed_tests}개")
    print(f"전체: {total_tests}개")

    if passed_tests == total_tests:
        print("모든 추천 엔진 검증을 통과했습니다.")
        print("웹 화면 연결 단계로 진행할 수 있습니다.")
    else:
        print("일부 검증이 실패했습니다.")
        print("실패한 항목의 필터링 또는 점수 공식을 확인해야 합니다.")


if __name__ == "__main__":
    main()