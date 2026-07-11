from math import log10


def clamp(value, minimum=0, maximum=100):
    """
    점수가 최소 0점, 최대 100점을 넘지 않게 제한한다.
    """
    return max(minimum, min(value, maximum))


def calculate_final_price(store):
    """
    배달 주문 시 최종 결제금액을 계산한다.

    메뉴 가격 + 배달비 - 쿠폰 할인
    """
    final_price = (
        store["menu_price"]
        + store["delivery_fee"]
        - store["coupon_discount"]
    )

    return max(0, final_price)


def calculate_price_score(store, budget):
    """
    사용자의 예산과 최종 가격을 비교한다.

    예산을 넘으면 0점이다.
    예산 안에서는 가격이 저렴할수록 높은 점수를 받는다.
    """
    final_price = calculate_final_price(store)

    if budget <= 0:
        return 0.0

    if final_price > budget:
        return 0.0

    price_ratio = final_price / budget

    # 예산과 가격이 같으면 50점
    # 가격이 예산보다 저렴할수록 100점에 가까워진다.
    score = 100 - price_ratio * 50

    return round(clamp(score), 2)


def calculate_rating_score(store):
    """
    5점 만점 평점을 100점 만점으로 변환한다.
    """
    rating = store["rating"]

    score = rating / 5 * 100

    return round(clamp(score), 2)


def calculate_review_score(store):
    """
    리뷰 수가 많을수록 평가의 신뢰도가 높다고 판단한다.

    로그를 사용해 리뷰 수가 너무 큰 음식점이
    과도하게 유리해지는 것을 방지한다.
    """
    review_count = store["review_count"]

    if review_count <= 0:
        return 0.0

    score = log10(review_count + 1) / 4 * 100

    return round(clamp(score), 2)


def calculate_delivery_score(store):
    """
    배달시간이 짧을수록 높은 점수를 준다.

    20분 이하는 100점에 가깝고,
    배달시간이 길어질수록 점수가 감소한다.
    """
    delivery_time = store["estimated_delivery_time"]

    score = 100 - max(0, delivery_time - 20) * 2

    return round(clamp(score), 2)


def calculate_keyword_score(store):
    """
    긍정 키워드는 가산점,
    부정 키워드는 감점으로 처리한다.
    """
    positive_count = len(store["positive_keywords"])
    negative_count = len(store["negative_keywords"])

    score = (
        50
        + positive_count * 10
        - negative_count * 10
    )

    return round(clamp(score), 2)


def get_weights(priority):
    """
    사용자가 중요하게 보는 요소에 따라
    점수 반영 비율을 바꾼다.
    """

    if priority == "가성비":
        return {
            "price": 0.45,
            "rating": 0.20,
            "review": 0.10,
            "delivery": 0.15,
            "keyword": 0.10
        }

    if priority == "높은 평점":
        return {
            "price": 0.15,
            "rating": 0.45,
            "review": 0.20,
            "delivery": 0.10,
            "keyword": 0.10
        }

    if priority == "빠른 배달":
        return {
            "price": 0.15,
            "rating": 0.20,
            "review": 0.10,
            "delivery": 0.45,
            "keyword": 0.10
        }

    # 균형 추천
    return {
        "price": 0.25,
        "rating": 0.30,
        "review": 0.15,
        "delivery": 0.20,
        "keyword": 0.10
    }


def calculate_store_score(store, budget, priority="균형"):
    """
    한 음식점의 전체 추천 점수를 계산한다.
    """

    price_score = calculate_price_score(
        store,
        budget
    )

    rating_score = calculate_rating_score(store)
    review_score = calculate_review_score(store)
    delivery_score = calculate_delivery_score(store)
    keyword_score = calculate_keyword_score(store)

    weights = get_weights(priority)

    total_score = (
        price_score * weights["price"]
        + rating_score * weights["rating"]
        + review_score * weights["review"]
        + delivery_score * weights["delivery"]
        + keyword_score * weights["keyword"]
    )

    return {
        "total_score": round(total_score, 2),
        "price_score": price_score,
        "rating_score": rating_score,
        "review_score": review_score,
        "delivery_score": delivery_score,
        "keyword_score": keyword_score
    }