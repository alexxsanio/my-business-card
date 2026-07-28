import os
from typing import Optional


ALLOWED_IMAGE_EXTENSIONS = {
    "png",
    "jpg",
    "jpeg",
    "webp"
}


MAX_IMAGE_SIZE_MB = 10


def allowed_file_extension(
    filename: str
) -> bool:
    """
    Check whether uploaded file
    has an allowed extension.
    """

    if "." not in filename:
        return False

    extension = (
        filename
        .rsplit(".", 1)[1]
        .lower()
    )

    return extension in ALLOWED_IMAGE_EXTENSIONS



def validate_image(
    image
) -> Optional[str]:
    """
    Validate uploaded image.

    Returns:
        None if valid.
        Error message if invalid.
    """

    if image is None:
        return "Image is required."


    if image.filename == "":
        return "Filename is empty."


    if not allowed_file_extension(
        image.filename
    ):
        return (
            "Unsupported image type. "
            "Allowed: png, jpg, jpeg, webp."
        )

    return None



def validate_name(
    name: str
) -> Optional[str]:
    """
    Validate person's name.
    """

    if not name:
        return "Name is required."

    name = name.strip()

    if len(name) < 2:
        return (
            "Name must contain "
            "at least 2 characters."
        )

    if len(name) > 100:
        return (
            "Name cannot exceed "
            "100 characters."
        )

    return None



def validate_title(
    title: str
) -> Optional[str]:
    """
    Validate person's job title.
    """

    if not title:
        return "Title is required."

    title = title.strip()

    if len(title) < 2:
        return (
            "Title must contain "
            "at least 2 characters."
        )

    if len(title) > 100:
        return (
            "Title cannot exceed "
            "100 characters."
        )

    return None



def validate_business_card_request(
    image,
    name: str,
    title: str
) -> Optional[str]:
    """
    Validate complete business card upload request.

    Returns:
        None if everything is valid.
        Error message otherwise.
    """

    image_error = validate_image(
        image
    )

    if image_error:
        return image_error


    name_error = validate_name(
        name
    )

    if name_error:
        return name_error



    title_error = validate_title(
        title
    )

    if title_error:
        return title_error

    return None