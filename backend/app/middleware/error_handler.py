from flask import Flask, jsonify
from werkzeug.exceptions import HTTPException
from pymongo.errors import PyMongoError

def register_error_handlers(
    app: Flask
):
    """
    Register global Flask error handlers.
    """

    @app.errorhandler(HTTPException)
    def handle_http_error(error):
        return jsonify({
            "success": False,
            "error": error.description
        }), error.code

    @app.errorhandler(PyMongoError)
    def handle_database_error(error):
        app.logger.error(
            f"MongoDB Error: {str(error)}"
        )

        return jsonify({
            "success": False,
            "error":
                "Database operation failed."
        }), 500

    @app.errorhandler(ValueError)
    def handle_value_error(error):
        return jsonify({
            "success": False,
            "error": str(error)
        }), 400

    @app.errorhandler(Exception)
    def handle_general_error(error):

        app.logger.exception(
            error
        )

        return jsonify({
            "success": False,
            "error":
                "Internal server error."
        }), 500