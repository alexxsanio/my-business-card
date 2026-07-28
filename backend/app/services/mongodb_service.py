from typing import Optional, Dict, Any

from bson import ObjectId

from app.extensions import db

from app.models.visitor import Visitor


def create_visitor(
    *,
    name: str,
    title: str,
    business_card: str
) -> Dict[str, Any]:
    """
    Create a visitor document in MongoDB.

    Args:
        name:
            Visitor name

        title:
            Visitor job title

        business_card:
            S3 image URL

    Returns:
        Created visitor information
    """


    visitor_document = Visitor.create(
        name=name,
        title=title,
        business_card=business_card
    )


    result = db.visitors.insert_one(
        visitor_document
    )


    return {
        "visitor_id": str(
            result.inserted_id
        ),
        "name": name,
        "title": title,
        "business_card": business_card
    }



def get_visitor(
    visitor_id: str
) -> Optional[Dict[str, Any]]:
    """
    Retrieve a visitor by MongoDB ID.
    """


    visitor = db.visitors.find_one(
        {
            "_id": ObjectId(
                visitor_id
            )
        }
    )


    if visitor is None:
        return None


    visitor["_id"] = str(
        visitor["_id"]
    )


    return visitor



def get_all_visitors():
    """
    Retrieve all visitors.
    """

    visitors = []

    cursor = db.visitors.find()

    for visitor in cursor:

        visitor["_id"] = str(
            visitor["_id"]
        )

        visitors.append(
            visitor
        )


    return visitors



def update_visitor(
    visitor_id: str,
    updates: Dict[str, Any]
) -> bool:
    """
    Update visitor information.
    """

    existing = get_visitor(
        visitor_id
    )

    if existing is None:
        return False

    updates = Visitor.update(
        existing,
        **updates
    )

    updates.pop(
        "_id",
        None
    )

    result = db.visitors.update_one(
        {
            "_id": ObjectId(
                visitor_id
            )
        },
        {
            "$set": updates
        }
    )

    return result.modified_count > 0



def delete_visitor(
    visitor_id: str
) -> bool:
    """
    Delete visitor record.
    """

    result = db.visitors.delete_one(
        {
            "_id": ObjectId(
                visitor_id
            )
        }
    )

    return result.deleted_count > 0