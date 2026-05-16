"""
Local development settings for PharmaManager.

Extends base settings with DEBUG mode enabled.
Never use in production.
"""

from .base import *  # noqa: F401, F403
from decouple import config

DEBUG = config('DEBUG', default=True, cast=bool)
