from pymongo import MongoClient

mongo_client = None

db = None


def init_db(app):

    global mongo_client
    global db

    mongo_client = MongoClient(
        app.config["MONGODB_URI"]
    )

    db = mongo_client[
        app.config["DATABASE_NAME"]
    ]