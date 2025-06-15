class Config:
    DEBUG = False
    TESTING = False
    JSON_AS_ASCII = False
    JSON_SORT_KEYS = False
    MAX_CONTENT_LENGTH = 10 * 1024 * 1024

    CORS_RESOURCES = {r"/*": {"origins": ["http://localhost:5173"]}}
