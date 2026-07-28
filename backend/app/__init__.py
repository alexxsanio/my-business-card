from flask import Flask
from flask_cors import CORS

from app.config import Config
from app.extensions import init_extensions

from app.routes.business_card import business_card_bp
from app.middleware.error_handler import register_error_handlers


def create_app() -> Flask:
    """
    Flask application factory.
    """

    app = Flask(__name__)

    # Load configuration
    app.config.from_object(Config)

    Config.validate()

    # Enable CORS for the Next.js frontend
    CORS(
        app,
        resources={
            r"/api/*": {
                "origins": [
                    "http://localhost:3000"
                ]
            }
        },
        supports_credentials=True,
    )

    # Initialize shared extensions
    init_extensions(app)

    # Register API routes
    app.register_blueprint(
        business_card_bp,
        url_prefix="/api"
    )

    # Register global error handlers
    register_error_handlers(app)

    return app