import os

# Create logs directory if it doesn't exist
if not os.path.exists('./backend/logs'):
    os.makedirs('./backend/logs')

import logging.config
from pythonjsonlogger import jsonlogger

LOGGING = {
    "version": 1,
    "disable_existing_loggers": False,
    "formatters": {
        "json": {
            "format": "%(asctime)s %(levelname)s %(message)s",
            "class": "pythonjsonlogger.jsonlogger.JsonFormatter",
        }
    },
    "handlers": {
        "file": {
            "class": "logging.FileHandler",
            "filename": "./backend/logs/app.log",
            "formatter": "json",
            "level": "DEBUG",  # Ensure file handler captures all logs
        },
        "stdout": {
            "class": "logging.StreamHandler",
            "stream": "ext://sys.stdout",
            "formatter": "json",
            "level": "DEBUG",  # Ensure stdout handler captures all logs
        }
    },
    "root": {
        "handlers": ["file", "stdout"],
        "level": "DEBUG",  # Ensure root logger captures all logs
    }
}

logging.config.dictConfig(LOGGING)
