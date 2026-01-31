"""
Error Codes Definition
Centralized error code definitions for Factory Copilot system
"""
from typing import Dict, Optional

# Error Code Definitions
class ErrorCodes:
    """Error code constants and mappings"""
    
    # Error Code Values
    UNKNOWN = "E000"
    HIGH_TEMPERATURE = "E001"
    HIGH_VIBRATION = "E002"
    HIGH_ERROR_COUNT = "E003"
    SLOW_CYCLE_TIME = "E004"
    CRITICAL_RISK = "E005"
    HIGH_RISK = "E006"
    
    # Error Code Descriptions
    DESCRIPTIONS: Dict[str, str] = {
        UNKNOWN: "Unknown/General Error",
        HIGH_TEMPERATURE: "High Temperature",
        HIGH_VIBRATION: "High Vibration",
        HIGH_ERROR_COUNT: "High Error Count",
        SLOW_CYCLE_TIME: "Slow Cycle Time",
        CRITICAL_RISK: "Critical Risk",
        HIGH_RISK: "High Risk"
    }
    
    # Error Code Severity Levels
    SEVERITY: Dict[str, str] = {
        UNKNOWN: "MEDIUM",
        HIGH_TEMPERATURE: "HIGH",
        HIGH_VIBRATION: "HIGH",
        HIGH_ERROR_COUNT: "HIGH",
        SLOW_CYCLE_TIME: "MEDIUM",
        CRITICAL_RISK: "CRITICAL",
        HIGH_RISK: "HIGH"
    }
    
    # Thresholds for error code determination
    THRESHOLDS: Dict[str, float] = {
        "TEMPERATURE_HIGH": 90.0,  # °C
        "VIBRATION_HIGH": 10.0,    # mm/s
        "ERROR_COUNT_HIGH": 15.0,   # count
        "CYCLE_TIME_SLOW": 70.0,    # seconds
        "RISK_CRITICAL": 90.0,      # percentage
        "RISK_HIGH": 75.0           # percentage
    }
    
    # Typical causes for each error code
    CAUSES: Dict[str, str] = {
        UNKNOWN: "General system issue or multiple contributing factors",
        HIGH_TEMPERATURE: "Motor overheating, cooling system failure, excessive load",
        HIGH_VIBRATION: "Bearing wear, misalignment, unbalanced rotating parts",
        HIGH_ERROR_COUNT: "Software errors, communication issues, sensor malfunctions",
        SLOW_CYCLE_TIME: "Mechanical wear, process inefficiencies, component degradation",
        CRITICAL_RISK: "Multiple critical issues detected simultaneously",
        HIGH_RISK: "Elevated risk requiring preventive action"
    }
    
    # Recommended actions for each error code
    ACTIONS: Dict[str, str] = {
        UNKNOWN: "Monitor closely, check system logs, schedule general inspection",
        HIGH_TEMPERATURE: "Check cooling system, reduce load, inspect motor bearings",
        HIGH_VIBRATION: "Inspect bearings, check alignment, balance rotating components",
        HIGH_ERROR_COUNT: "Check system logs, restart affected systems, verify sensor connections",
        SLOW_CYCLE_TIME: "Inspect mechanical components, optimize process parameters",
        CRITICAL_RISK: "Immediate shutdown required, full system inspection, emergency maintenance",
        HIGH_RISK: "Schedule maintenance, monitor closely, prepare for potential shutdown"
    }


def determine_error_code(sensor_data: Dict, risk_score: float) -> str:
    """
    Determine error code based on sensor readings and risk score
    
    Args:
        sensor_data: Dictionary with sensor readings (temperature, vibration, error_count, cycle_time)
        risk_score: Downtime risk percentage (0-100)
        
    Returns:
        Error code string (e.g., "E001")
    """
    # Extract sensor values with defaults
    temp = sensor_data.get('temperature', 0)
    vibration = sensor_data.get('vibration', 0)
    error_count = sensor_data.get('error_count', 0)
    cycle_time = sensor_data.get('cycle_time', 0)
    
    # Check thresholds in priority order
    thresholds = ErrorCodes.THRESHOLDS
    
    if temp > thresholds["TEMPERATURE_HIGH"]:
        return ErrorCodes.HIGH_TEMPERATURE
    elif vibration > thresholds["VIBRATION_HIGH"]:
        return ErrorCodes.HIGH_VIBRATION
    elif error_count > thresholds["ERROR_COUNT_HIGH"]:
        return ErrorCodes.HIGH_ERROR_COUNT
    elif cycle_time > thresholds["CYCLE_TIME_SLOW"]:
        return ErrorCodes.SLOW_CYCLE_TIME
    elif risk_score >= thresholds["RISK_CRITICAL"]:
        return ErrorCodes.CRITICAL_RISK
    elif risk_score >= thresholds["RISK_HIGH"]:
        return ErrorCodes.HIGH_RISK
    else:
        return ErrorCodes.UNKNOWN


def get_error_info(error_code: str) -> Dict[str, str]:
    """
    Get complete information about an error code
    
    Args:
        error_code: Error code string (e.g., "E001")
        
    Returns:
        Dictionary with description, severity, cause, and action
    """
    return {
        "code": error_code,
        "description": ErrorCodes.DESCRIPTIONS.get(error_code, "Unknown error code"),
        "severity": ErrorCodes.SEVERITY.get(error_code, "UNKNOWN"),
        "cause": ErrorCodes.CAUSES.get(error_code, "Unknown cause"),
        "recommended_action": ErrorCodes.ACTIONS.get(error_code, "Contact support")
    }


def get_all_error_codes() -> Dict[str, Dict[str, str]]:
    """
    Get all error codes with their information
    
    Returns:
        Dictionary mapping error codes to their information
    """
    return {
        code: get_error_info(code)
        for code in ErrorCodes.DESCRIPTIONS.keys()
    }
