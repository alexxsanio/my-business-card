from typing import Dict, Any

from app.services.s3_service import (
    upload_business_card
)

from app.services.mongodb_service import (
    create_visitor
)


def save_business_card(
    *,
    image,
    name: str,
    title: str
) -> Dict[str, Any]:
    """
    Complete business card saving workflow.

    Steps:
        1. Upload image to S3
        2. Save visitor information in MongoDB
        3. Return saved data

    Args:
        image:
            Uploaded Flask file object

        name:
            Person's name

        title:
            Person's title

    Returns:
        Visitor record information
    """

    # -------------------------
    # Step 1:
    # Upload image to S3
    # -------------------------

    image_url = upload_business_card(
        image
    )

    # -------------------------
    # Step 2:
    # Save metadata to MongoDB
    # -------------------------

    visitor = create_visitor(
        name=name,
        title=title,
        business_card=image_url
    )


    # -------------------------
    # Step 3:
    # Return result
    # -------------------------

    return {
        "visitor_id": visitor[
            "visitor_id"
        ],
        "name": visitor[
            "name"
        ],
        "title": visitor[
            "title"
        ],
        "business_card": visitor[
            "business_card"
        ]
    }