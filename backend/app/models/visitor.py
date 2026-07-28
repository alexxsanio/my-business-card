from datetime import datetime
from typing import Dict, Any


class Visitor:
    """
    Represents a visitor document stored in MongoDB.
    """

    @staticmethod
    def create(
        *,
        name: str,
        title: str,
        business_card: str,
    ) -> Dict[str, Any]:
        """
        Build a MongoDB visitor document.

        Args:
            name: Visitor's full name
            title: Visitor's job title
            business_card: S3 URL of the uploaded business card

        Returns:
            Dictionary ready to insert into MongoDB.
        """

        return {
            "name": name.strip(),
            "title": title.strip(),
            "business_card": business_card,
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow()
        }

    @staticmethod
    def update(
        existing: Dict[str, Any],
        **kwargs
    ) -> Dict[str, Any]:
        """
        Update an existing visitor document.
        """

        for key, value in kwargs.items():
            if value is not None:
                existing[key] = value

        existing["updated_at"] = datetime.utcnow()

        return existing