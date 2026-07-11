# ai_service.py

import os

from dotenv import load_dotenv
from google import genai


# Oracle_MVP/.env 파일의 내용을 불러온다.
load_dotenv()


def get_api_key():
    """
    .env에서 Gemini API 키를 가져온다.
    키가 없으면 오류를 발생시킨다.
    """
    api_key = os.getenv("GEMINI_API_KEY")

    if not api_key:
        raise RuntimeError(
            ".env 파일에 GEMINI_API_KEY가 없습니다."
        )

    if api_key == "여기에_실제_API_키":
        raise RuntimeError(
            ".env의 예시 문구를 실제 Gemini API 키로 바꿔주세요."
        )

    return api_key


def get_model_name():
    """
    .env에서 모델명을 가져온다.
    모델명이 없으면 gemini-2.5-flash를 사용한다.
    """
    return os.getenv(
        "GEMINI_MODEL",
        "gemini-2.5-flash"
    )


def create_client():
    """
    Gemini API 클라이언트를 생성한다.
    """
    return genai.Client(
        api_key=get_api_key()
    )


def test_ai_connection():
    """
    Gemini API 자체가 정상적으로 응답하는지 시험한다.
    """
    client = create_client()
    model_name = get_model_name()

    response = client.models.generate_content(
        model=model_name,
        contents=(
            "FLOOK AI와 Gemini API 연결에 성공했습니다라고 "
            "한국어 한 문장으로 답해주세요."
        )
    )

    if not response.text:
        raise RuntimeError(
            "Gemini에서 빈 응답이 반환되었습니다."
        )

    return response.text.strip()


def format_recommendations(recommendations):
    """
    Python 추천 결과를 Gemini가 읽을 수 있는
    텍스트 형식으로 변환한다.
    """
    result_lines = []

    for rank, store in enumerate(
        recommendations,
        start=1
    ):
        positive_keywords = ", ".join(
            store.get("positive_keywords", [])
        )

        negative_keywords = ", ".join(
            store.get("negative_keywords", [])
        )

        store_text = (
            f"{rank}위\n"
            f"매장명: {store['store_name']}\n"
            f"메뉴명: {store['menu_name']}\n"
            f"카테고리: {store['category']}\n"
            f"최종 결제금액: {store['final_price']}원\n"
            f"평점: {store['rating']}점\n"
            f"리뷰 수: {store['review_count']}개\n"
            f"예상 배달시간: "
            f"{store['estimated_delivery_time']}분\n"
            f"긍정 키워드: {positive_keywords}\n"
            f"부정 키워드: {negative_keywords}\n"
            f"Python 추천 점수: {store['score']}점"
        )

        result_lines.append(store_text)

    return "\n\n".join(result_lines)


def create_fallback_summary(
    recommendations,
    budget,
    priority
):
    """
    Gemini 호출이 실패했을 때 보여줄
    기본 규칙 기반 추천 문장이다.
    """
    if not recommendations:
        return None

    first_store = recommendations[0]

    positive_keywords = ", ".join(
        first_store.get("positive_keywords", [])
    )

    summary = (
        f"{first_store['store_name']}이 가장 높은 추천 점수를 "
        f"받았습니다. 최종 결제금액은 "
        f"{first_store['final_price']:,}원으로 "
        f"예산 {budget:,}원 이내입니다. "
        f"평점은 {first_store['rating']}점이고 "
        f"예상 배달시간은 "
        f"{first_store['estimated_delivery_time']}분입니다."
    )

    if positive_keywords:
        summary += (
            f" 긍정 리뷰에서는 "
            f"{positive_keywords} 등의 특징이 나타났습니다."
        )

    summary += (
        f" 현재 사용자가 선택한 우선순위는 "
        f"'{priority}'입니다."
    )

    return summary


def generate_ai_summary(
    recommendations,
    budget,
    category,
    priority,
    max_delivery_time
):
    """
    Python이 정한 상위 추천 결과를 Gemini에 전달하여
    추천 이유를 자연어로 생성한다.
    """
    if not recommendations:
        return None

    recommendation_text = format_recommendations(
        recommendations
    )

    prompt = f"""
당신은 배달 음식 추천 서비스 FLOOK AI의 추천 설명 담당자입니다.

중요한 규칙:
- 추천 순위와 점수는 Python 프로그램이 이미 확정했습니다.
- 순위를 변경하지 마세요.
- 제공되지 않은 매장, 가격, 평점, 할인 정보를 만들지 마세요.
- 제공된 데이터만 사용하세요.

사용자 조건:
- 최대 예산: {budget}원
- 선택 카테고리: {category}
- 추천 우선순위: {priority}
- 최대 배달시간: {max_delivery_time}분

Python 추천 결과:
{recommendation_text}

다음 기준으로 설명하세요.

1. 1위가 선정된 핵심 이유를 설명하세요.
2. 2위와 3위가 있다면 각각의 장점을 간단히 설명하세요.
3. 부정 키워드는 주의점으로 짧게 언급하세요.
4. 350자 이내의 자연스러운 한국어 문단으로 작성하세요.
5. 표, 제목, 별표, 마크다운은 사용하지 마세요.
""".strip()

    try:
        client = create_client()
        model_name = get_model_name()

        response = client.models.generate_content(
            model=model_name,
            contents=prompt
        )

        if not response.text:
            raise RuntimeError(
                "Gemini가 빈 답변을 반환했습니다."
            )

        return response.text.strip()

    except Exception as error:
        # Flask를 실행한 터미널에서 실제 오류를 확인할 수 있다.
        print()
        print("[Gemini 호출 실패]")
        print(f"오류 종류: {type(error).__name__}")
        print(f"오류 내용: {error}")
        print()

        # Gemini가 실패해도 웹페이지는 계속 작동한다.
        return create_fallback_summary(
            recommendations=recommendations,
            budget=budget,
            priority=priority
        )


def main():
    """
    ai_service.py를 직접 실행했을 때
    Gemini 연결만 검사한다.
    """
    print("Gemini API 연결 테스트를 시작합니다.")

    try:
        result = test_ai_connection()

        print()
        print("[연결 성공]")
        print(result)

    except Exception as error:
        print()
        print("[연결 실패]")
        print(f"오류 종류: {type(error).__name__}")
        print(f"오류 내용: {error}")


if __name__ == "__main__":
    main()