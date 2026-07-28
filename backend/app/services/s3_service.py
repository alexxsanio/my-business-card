from uuid import uuid4

from flask import current_app

from app.extensions import s3


def upload_business_card(
    image
) -> str:
    """
    Upload business card image to S3.

    Args:
        image:
            Flask uploaded file object.

    Returns:
        Public S3 URL.
    """

    if image.filename == "":
        raise ValueError(
            "Empty filename."
        )


    # Get file extension
    extension = (
        image.filename
        .rsplit(".", 1)[-1]
        .lower()
    )


    # Create unique S3 path
    filename = (
        f"business_cards/"
        f"{uuid4()}."
        f"{extension}"
    )


    bucket = current_app.config[
        "S3_BUCKET"
    ]


    region = current_app.config[
        "AWS_REGION"
    ]


    try:

        s3.upload_fileobj(
            Fileobj=image,
            Bucket=bucket,
            Key=filename,
            ExtraArgs={
                "ContentType": image.content_type
            }
        )


    except Exception as error:

        raise Exception(
            f"S3 upload failed: {str(error)}"
        )


    image_url = (
        f"https://"
        f"{bucket}.s3."
        f"{region}.amazonaws.com/"
        f"{filename}"
    )


    return image_url