from io import BytesIO
from typing import Dict, Any

from PIL import Image


def get_image_metadata(
    image_file
) -> Dict[str, Any]:
    """
    Extract image metadata.

    Args:
        image_file:
            Flask uploaded image object.

    Returns:
        Dictionary containing image information.
    """

    image_bytes = image_file.read()

    # Reset file pointer so later upload
    # operations can read the file again
    image_file.seek(0)

    image = Image.open(
        BytesIO(image_bytes)
    )

    return {
        "format": image.format,
        "width": image.width,
        "height": image.height,
        "mode": image.mode
    }



def validate_image_dimensions(
    image_file,
    min_width: int = 300,
    min_height: int = 150
) -> bool:
    """
    Ensure uploaded image is large enough.

    Business cards usually require
    enough resolution for OCR.
    """


    metadata = get_image_metadata(
        image_file
    )


    return (
        metadata["width"] >= min_width
        and
        metadata["height"] >= min_height
    )



def compress_image(
    image_file,
    quality: int = 85
):
    """
    Compress image before uploading.

    Returns:
        BytesIO object containing
        compressed image.

    Useful if mobile photos are too large.
    """

    image_bytes = image_file.read()

    image_file.seek(0)

    image = Image.open(
        BytesIO(image_bytes)
    )

    output = BytesIO()

    image.save(
        output,
        format="JPEG",
        quality=quality,
        optimize=True
    )

    output.seek(0)

    return output



def create_thumbnail(
    image_file,
    size=(400,250)
):
    """
    Create a smaller preview image.

    Useful for:
        - visitor dashboards
        - admin panels
        - search results
    """

    image_bytes = image_file.read()

    image_file.seek(0)

    image = Image.open(
        BytesIO(image_bytes)
    )

    image.thumbnail(
        size
    )

    output = BytesIO()

    image.save(
        output,
        format="JPEG"
    )

    output.seek(0)

    return output