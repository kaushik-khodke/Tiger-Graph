import re
from typing import Tuple

# Transient error keywords matching Google GenAI / HTTP errors
TRANSIENT_PATTERNS = [
    r"429",
    r"rate[_\s-]?limit",
    r"quota",
    r"resource[_\s-]?exhausted",
    r"500",
    r"502",
    r"503",
    r"504",
    r"timeout",
    r"timed[_\s-]?out",
    r"deadline[_\s-]?exceeded",
    r"connection[_\s-]?reset",
    r"connection[_\s-]?refused",
    r"temporar(y|ily)[_\s-]?unavailable",
    r"service[_\s-]?unavailable",
    r"internal[_\s-]?server[_\s-]?error",
    r"model[_\s-]?unavailable",
    r"overloaded"
]

def is_transient_error(exc: Exception) -> Tuple[bool, str]:
    """
    Evaluates whether an exception represents a retryable transient provider error.
    Returns (is_transient: bool, reason: str).
    """
    err_str = str(exc).lower()
    exc_type = type(exc).__name__.lower()
    
    combined = f"{exc_type}: {err_str}"
    
    for pattern in TRANSIENT_PATTERNS:
        match = re.search(pattern, combined)
        if match:
            matched_text = match.group(0)
            return True, f"Transient provider failure: {matched_text}"
            
    # Check status_code attribute if available
    status_code = getattr(exc, "status_code", None)
    if status_code in (429, 500, 502, 503, 504):
        return True, f"HTTP status code {status_code}"
        
    return False, f"Non-transient error: {exc_type}"
