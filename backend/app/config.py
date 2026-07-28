import os

from dotenv import load_dotenv


# Load environment variables from .env
load_dotenv()


class Config:
    """
    Application configuration.
    """

    # Flask
    SECRET_KEY = os.getenv(
        "SECRET_KEY",
        "development-secret-key"
    )

    DEBUG = os.getenv(
        "FLASK_DEBUG",
        "True"
    ).lower() == "true"

    # MongoDB
    MONGODB_URI = os.getenv("MONGODB_URI")

    DATABASE_NAME = os.getenv(
        "DATABASE_NAME",
        "my_business_card"
    )

    # AWS S3
    AWS_ACCESS_KEY_ID = os.getenv(
        "AWS_ACCESS_KEY_ID"
    )

    AWS_SECRET_ACCESS_KEY = os.getenv(
        "AWS_SECRET_ACCESS_KEY"
    )

    AWS_REGION = os.getenv(
        "AWS_REGION",
        "us-east-1"
    )

    S3_BUCKET = os.getenv(
        "S3_BUCKET"
    )

    # Upload limits
    MAX_CONTENT_LENGTH = 10 * 1024 * 1024  # 10 MB

    @classmethod
    def validate(cls):
        """
        Validate required configuration values.
        Raises RuntimeError if anything important is missing.
        """

        required = {
            "MONGODB_URI": cls.MONGODB_URI,
            "AWS_ACCESS_KEY_ID": cls.AWS_ACCESS_KEY_ID,
            "AWS_SECRET_ACCESS_KEY": cls.AWS_SECRET_ACCESS_KEY,
            "S3_BUCKET": cls.S3_BUCKET,
        }

        missing = [
            key
            for key, value in required.items()
            if not value
        ]

        if missing:
            raise RuntimeError(
                "Missing required environment variables: "
                + ", ".join(missing)
            )