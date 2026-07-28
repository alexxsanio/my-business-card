from flask import (
    Blueprint,
    request,
    jsonify
)

from app.services.business_card_service import (
    save_business_card
)

from app.utils.responses import (
    success_response,
    error_response
)


business_card_bp = Blueprint(
    "business_card",
    __name__
)


@business_card_bp.route(
    "/save_businesscard",
    methods=["POST"]
)
def upload_business_card():

    try:

        # Get image
        image = request.files.get(
            "business_card"
        )


        # Get user information
        name = request.form.get(
            "name"
        )

        title = request.form.get(
            "title"
        )


        if image is None:

            return error_response(
                "Business card image is required.",
                400
            )


        if not name:

            return error_response(
                "Name is required.",
                400
            )


        if not title:

            return error_response(
                "Title is required.",
                400
            )


        result = save_business_card(
            image=image,
            name=name,
            title=title
        )


        return success_response(
            data=result,
            status_code=201
        )


    except Exception as error:

        return error_response(
            str(error),
            500
        )