# 🔢 Error Codes Reference

The Factory Copilot system sends error codes to n8n webhooks to help identify specific machine issues.

## Error Code Format

Error codes follow the pattern: `E###` where:
- `E` = Error prefix
- `###` = Numeric code (000-999)

## Error Code List

| Code | Description | Condition | Severity |
|------|-------------|-----------|----------|
| **E000** | Unknown/General Error | Default fallback | Medium |
| **E001** | High Temperature | Temperature > 90°C | High |
| **E002** | High Vibration | Vibration > 10 mm/s | High |
| **E003** | High Error Count | Error count > 15 | High |
| **E004** | Slow Cycle Time | Cycle time > 70s | Medium |
| **E005** | Critical Risk | Risk score ≥ 90% | Critical |
| **E006** | High Risk | Risk score ≥ 75% | High |

## Usage in n8n Webhook

When downtime risk ≥ 75%, the webhook payload includes:

```json
{
  "risk_score": 85,
  "error_code": "E001",
  "sensor_data": {
    "temperature": 92.5,
    "vibration": 7.8,
    ...
  },
  "alert_type": "high_downtime_risk",
  "explanation": {
    "root_cause": "...",
    "recommended_action": "..."
  },
  "timestamp": "2026-01-31T19:30:00"
}
```

## Error Code Determination Logic

The system automatically determines the error code based on:

1. **Primary Issue Detection** (checked in order):
   - Temperature > 90°C → `E001`
   - Vibration > 10 mm/s → `E002`
   - Error count > 15 → `E003`
   - Cycle time > 70s → `E004`

2. **Risk-Based Fallback**:
   - Risk ≥ 90% → `E005` (Critical)
   - Risk ≥ 75% → `E006` (High)

3. **Default**:
   - Otherwise → `E000` (Unknown)

## Custom Error Codes

You can also pass custom error codes when triggering the webhook:

```python
from automation import AutomationTrigger

automation = AutomationTrigger()
automation.trigger_maintenance_alert(
    risk_score=85,
    sensor_data={...},
    explanation={...},
    error_code="BEARING_FAILURE"  # Custom code
)
```

## n8n Workflow Usage

In your n8n workflow, you can use the error code to:

1. **Route to different handlers**:
   ```
   IF error_code == "E001" → Send to Temperature Alert Handler
   IF error_code == "E002" → Send to Vibration Alert Handler
   ```

2. **Set priority**:
   ```
   IF error_code == "E005" → Priority: CRITICAL
   IF error_code == "E006" → Priority: HIGH
   ```

3. **Create tickets**:
   ```
   Use error_code as ticket category/type
   ```

## Example n8n Workflow Logic

```javascript
// In n8n Code node
const errorCode = $json.error_code;
const riskScore = $json.risk_score;

let priority = "MEDIUM";
let category = "GENERAL";

switch(errorCode) {
  case "E001":
    priority = "HIGH";
    category = "TEMPERATURE";
    break;
  case "E002":
    priority = "HIGH";
    category = "VIBRATION";
    break;
  case "E005":
    priority = "CRITICAL";
    category = "SYSTEM";
    break;
  default:
    priority = riskScore >= 90 ? "HIGH" : "MEDIUM";
}

return {
  priority,
  category,
  errorCode,
  ...$json
};
```

## Testing Error Codes

Test different error codes:

```bash
# Test with custom error code
python scripts/test_n8n_simple.py

# Or modify the test script to include error_code in payload
```

## Error Code Mapping

| Error Code | Typical Causes | Recommended Actions |
|------------|----------------|---------------------|
| E001 | Motor overheating, cooling failure | Check cooling system, reduce load |
| E002 | Bearing wear, misalignment | Inspect bearings, check alignment |
| E003 | Software errors, communication issues | Check logs, restart system |
| E004 | Mechanical wear, process issues | Inspect mechanical components |
| E005 | Multiple critical issues | Immediate shutdown, full inspection |
| E006 | Elevated risk, preventive action needed | Schedule maintenance, monitor closely |
