from typing import Callable
from app.core.logging import logger

def startup_event_handler() -> Callable[[], None]:
    def on_app_start() -> None:
        try:
            logger.info("startup_event", message="App started successfully")
        except Exception as e:
            error_msg = f"Error during app startup: {e}"
            logger.critical("startup_event", error_msg=error_msg)
            raise RuntimeError(error_msg) from e

    return on_app_start
