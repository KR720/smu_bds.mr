from flask import Flask, render_template, request

from data_loader import load_flook_data
from scoring import calculate_final_price, calculate_store_score


# Gemini 연결이 실패해도 추천 기능은 계속 작동하게 처리
try:
    from ai_service import generate_ai_summary
except Exception as import_error:
    print("[AI 모듈 불러오기 실패]")
    print(import_error)
    generate_ai_summary = None


app = Flask(__name__)


PRIORITIES = [
    "균형",
    "가성비",
    "높은 평점",
    "빠른 배달"
]


def get_categories(stores):
    """
    CSV에 들어 있는 카테고리를 자동으로 추출한다.
    """
    categories = sorted({
        store["category"]
        for store in stores
        if store.get("category")
    })

    return ["전체"] + categories


def parse_positive_integer(value, field_name):
    """
    HTML에서 받은 값을 양의 정수로 변환한다.
    """
    try:
        number = int(value)

    except (TypeError, ValueError) as error:
        raise ValueError(
            f"{field_name}에는 숫자를 입력해주세요."
        ) from error

    if number <= 0:
        raise ValueError(
            f"{field_name}에는 0보다 큰 숫자를 입력해주세요."
        )

    return number


def is_available(
    store,
    budget,
    category,
    max_delivery_time
):
    """
    사용자의 필수 조건을 만족하는 매장인지 확인한다.
    """

    # 카테고리 검사
    if (
        category != "전체"
        and store["category"] != category
    ):
        return False

    # 최소 주문금액 검사
    if store["menu_price"] < store["min_order_price"]:
        return False

    final_price = calculate_final_price(store)

    # 예산 검사
    if final_price > budget:
        return False

    # 배달시간 검사
    if (
        store["estimated_delivery_time"]
        > max_delivery_time
    ):
        return False

    return True


def recommend_stores(
    stores,
    budget,
    category,
    priority,
    max_delivery_time,
    limit=3
):
    """
    조건에 맞는 매장의 점수를 계산하고
    상위 결과를 반환한다.
    """

    recommendations = []

    for store in stores:

        if not is_available(
            store=store,
            budget=budget,
            category=category,
            max_delivery_time=max_delivery_time
        ):
            continue

        score_result = calculate_store_score(
            store,
            budget,
            priority
        )

        result = store.copy()

        result["final_price"] = calculate_final_price(store)
        result["score"] = score_result["total_score"]
        result["score_details"] = score_result

        recommendations.append(result)

    recommendations.sort(
        key=lambda item: (
            -item["score"],
            -item["rating"],
            item["estimated_delivery_time"]
        )
    )

    return recommendations[:limit]


@app.route("/", methods=["GET", "POST"])
def index():
    """
    FLOOK AI 메인 페이지
    """

    stores = load_flook_data()
    categories = get_categories(stores)

    recommendations = []
    ai_summary = None
    error_message = None
    searched = False

    form_data = {
        "budget": "20000",
        "category": "전체",
        "priority": "균형",
        "max_delivery_time": "60"
    }

    if request.method == "POST":
        searched = True

        form_data = {
            "budget": request.form.get(
                "budget",
                ""
            ).strip(),

            "category": request.form.get(
                "category",
                "전체"
            ).strip(),

            "priority": request.form.get(
                "priority",
                "균형"
            ).strip(),

            "max_delivery_time": request.form.get(
                "max_delivery_time",
                ""
            ).strip()
        }

        try:
            budget = parse_positive_integer(
                form_data["budget"],
                "예산"
            )

            max_delivery_time = parse_positive_integer(
                form_data["max_delivery_time"],
                "최대 배달시간"
            )

            if form_data["category"] not in categories:
                raise ValueError(
                    "올바른 카테고리를 선택해주세요."
                )

            if form_data["priority"] not in PRIORITIES:
                raise ValueError(
                    "올바른 추천 우선순위를 선택해주세요."
                )

            recommendations = recommend_stores(
                stores=stores,
                budget=budget,
                category=form_data["category"],
                priority=form_data["priority"],
                max_delivery_time=max_delivery_time,
                limit=3
            )

            print()
            print(
                f"[추천 결과 개수] "
                f"{len(recommendations)}개"
            )

            for store in recommendations:
                print(
                    store["store_name"],
                    store["score"]
                )

            # Gemini는 별도로 실행한다.
            # 실패해도 추천 결과에는 영향을 주지 않는다.
            if (
                recommendations
                and generate_ai_summary is not None
            ):
                try:
                    ai_summary = generate_ai_summary(
                        recommendations=recommendations,
                        budget=budget,
                        category=form_data["category"],
                        priority=form_data["priority"],
                        max_delivery_time=max_delivery_time
                    )

                except Exception as ai_error:
                    print()
                    print("[Gemini 추천 설명 생성 실패]")
                    print(type(ai_error).__name__)
                    print(ai_error)

                    ai_summary = None

        except ValueError as error:
            error_message = str(error)

        except Exception as error:
            print()
            print("[추천 처리 오류]")
            print(type(error).__name__)
            print(error)

            error_message = (
                "추천 처리 중 오류가 발생했습니다. "
                "터미널의 오류 내용을 확인해주세요."
            )

    return render_template(
        "index.html",
        stores_count=len(stores),
        categories=categories,
        priorities=PRIORITIES,
        recommendations=recommendations,
        ai_summary=ai_summary,
        form_data=form_data,
        error_message=error_message,
        searched=searched
    )


if __name__ == "__main__":
    app.run(
        host="0.0.0.0",
        port=5000,
        debug=True
    )