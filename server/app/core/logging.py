"""
Structured logging configuration using structlog
"""
import logging
import sys
import uuid
from contextvars import ContextVar
from typing import Any, Dict

import structlog
import uvicorn
from structlog.types import Processor


# Context variable to store correlation ID across async requests
correlation_id_var: ContextVar[str] = ContextVar('correlation_id', default='')


def add_correlation_id(logger, method_name: str, event_dict: Dict[str, Any]) -> Dict[str, Any]:
    """Add correlation ID to log entries"""
    correlation_id = correlation_id_var.get()
    if correlation_id:
        event_dict['correlation_id'] = correlation_id
    return event_dict


def add_app_context(logger, method_name: str, event_dict: Dict[str, Any]) -> Dict[str, Any]:
    """Add application context to log entries"""
    event_dict['app'] = 'aquarian-gnosis'
    event_dict['service'] = 'backend'
    return event_dict


def configure_logging(log_level: str = "INFO", json_logs: bool = False) -> None:
    """
    Configure structured logging for the application

    Args:
        log_level: Logging level (DEBUG, INFO, WARNING, ERROR, CRITICAL)
        json_logs: Whether to output logs in JSON format (useful for production)
    """
    # Configure the logging level
    logging.basicConfig(
        format="%(message)s",
        stream=sys.stdout,
        level=getattr(logging, log_level.upper()),
    )

    # Configure structlog processors
    processors: list[Processor] = [
        structlog.contextvars.merge_contextvars,
        add_correlation_id,
        add_app_context,
        structlog.processors.add_log_level,
        structlog.processors.StackInfoRenderer(),
    ]

    if json_logs:
        # Production: JSON format
        processors.extend([
            structlog.processors.dict_tracebacks,
            structlog.processors.JSONRenderer()
        ])
    else:
        # Development: Pretty console format
        processors.extend([
            structlog.dev.set_exc_info,
            structlog.dev.ConsoleRenderer(colors=True)
        ])

    # Configure structlog
    structlog.configure(
        processors=processors,
        context_class=dict,
        logger_factory=structlog.WriteLoggerFactory(),
        wrapper_class=structlog.make_filtering_bound_logger(
            getattr(logging, log_level.upper())
        ),
        cache_logger_on_first_use=True,
    )

    # Configure uvicorn access logs to use structlog
    logging.getLogger("uvicorn.access").handlers = []
    logging.getLogger("uvicorn.access").propagate = False


def get_logger(name: str = None) -> structlog.BoundLogger:
    """Get a structured logger instance"""
    return structlog.get_logger(name)


def set_correlation_id(correlation_id: str = None) -> str:
    """Set correlation ID for request tracking"""
    if correlation_id is None:
        correlation_id = str(uuid.uuid4())
    correlation_id_var.set(correlation_id)
    return correlation_id


def get_correlation_id() -> str:
    """Get current correlation ID"""
    return correlation_id_var.get()


# Create a default logger instance
logger = get_logger(__name__)