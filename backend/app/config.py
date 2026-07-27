import os
from dotenv import load_dotenv

load_dotenv()


class Config:

    MONGODB_URI = os.getenv("MONGODB_URI")

    DATABASE_NAME = os.getenv("DATABASE_NAME")

    UPLOAD_FOLDER = os.getenv(
        "UPLOAD_FOLDER",
        "app/uploads/business_cards"
    )

    MAX_CONTENT_LENGTH = 10 * 1024 * 1024