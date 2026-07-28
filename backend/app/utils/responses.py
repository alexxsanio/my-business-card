from flask import jsonify
from typing import Any, Optional


def success_response(
    data: Optional[Any] = None,
    status_code: int = 200
):
    """
    Create a successful API response.

    Args:
        data:
            Response payload.

        status_code:
            HTTP status code.

    Returns:
        Flask JSON response.
    """

    response = {
        "success": True,
        "data": data
    }

    return jsonify(response), status_code



def error_response(
    message: str,
    status_code: int = 400
):
    """
    Create an error API response.

    Args:
        message:
            Error description.

        status_code:
            HTTP status code.

    Returns:
        Flask JSON response.
    """

    response = {
        "success": False,
        "error": message
    }

    return jsonify(response), status_code