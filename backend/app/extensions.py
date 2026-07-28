from typing import Optional

import boto3
from boto3.session import Session
from flask import Flask
from pymongo import MongoClient
from pymongo.database import Database


mongo_client: Optional[MongoClient] = None
db: Optional[Database] = None
s3 = None


def init_extensions(app: Flask) -> None:
    """
    Initialize MongoDB and Amazon S3 clients.
    """

    global mongo_client
    global db
    global s3

    # -------------------------
    # MongoDB
    # -------------------------

    mongo_client = MongoClient(
        app.config["MONGODB_URI"]
    )

    db = mongo_client[
        app.config["DATABASE_NAME"]
    ]

    # Verify connection
    mongo_client.admin.command("ping")

    # -------------------------
    # Amazon S3
    # -------------------------

    session = Session(
        aws_access_key_id=app.config[
            "AWS_ACCESS_KEY_ID"
        ],
        aws_secret_access_key=app.config[
            "AWS_SECRET_ACCESS_KEY"
        ],
        region_name=app.config[
            "AWS_REGION"
        ],
    )

    s3 = session.client("s3")

    print("✓ MongoDB connected")
    print("✓ Amazon S3 connected")