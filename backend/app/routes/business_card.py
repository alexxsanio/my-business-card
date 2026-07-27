import os
from uuid import uuid4
from datetime import datetime

from flask import (
    Blueprint,
    jsonify,
    request,
    current_app
)

from werkzeug.utils import secure_filename

from app.extensions import db


business_card_bp = Blueprint(
    "business_card",
    __name__
)


ALLOWED_EXTENSIONS = {
    "png",
    "jpg",
    "jpeg",
    "webp"
}


def allowed(filename):

    return (
        "." in filename
        and
        filename.rsplit(".", 1)[1].lower()
        in ALLOWED_EXTENSIONS
    )


@business_card_bp.route(
    "/api/save_businesscard",
    methods=["POST"]
)
def save_businesscard():

    if "business_card" not in request.files:

        return jsonify({
            "error": "No image uploaded."
        }), 400

    image = request.files["business_card"]

    name = request.form.get(
        "name",
        ""
    ).strip()

    title = request.form.get(
        "title",
        ""
    ).strip()

    if not name:

        return jsonify({
            "error": "Missing name."
        }), 400

    if not title:

        return jsonify({
            "error": "Missing title."
        }), 400

    if image.filename == "":

        return jsonify({
            "error": "No file selected."
        }), 400

    if not allowed(image.filename):

        return jsonify({
            "error": "Unsupported file type."
        }), 400

    extension = image.filename.rsplit(
        ".",
        1
    )[1].lower()

    filename = (
        f"{uuid4()}.{extension}"
    )

    filename = secure_filename(
        filename
    )

    filepath = os.path.join(
        current_app.config[
            "UPLOAD_FOLDER"
        ],
        filename
    )

    image.save(filepath)

    document = {
        "name": name,
        "title": title,
        "image_filename": filename,
        "image_path": filepath,
        "created_at": datetime.utcnow()
    }

    result = db.visitors.insert_one(
        document
    )

    return jsonify({
        "success": True,
        "id": str(result.inserted_id),
        "filename": filename,
    }), 201