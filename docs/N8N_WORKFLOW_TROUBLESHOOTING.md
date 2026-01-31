# n8n Workflow Troubleshooting Guide

## Issue: 404 Error - Webhook Not Found

### Problem
Your workflow is returning a 404 error, which typically means the webhook is not registered or the workflow is not active.

### Solution

#### 1. Activate the Workflow
**CRITICAL:** Your workflow shows `"active": false` in the JSON. You MUST activate it:

1. Open your n8n workflow in the editor
2. Click the **"Active"** toggle switch in the top-right corner
3. The switch should turn **green/blue** when active
4. Save the workflow

#### 2. Verify Webhook Configuration
- Ensure the webhook node is set to:
  - **HTTP Method:** POST
  - **Path:** `dcfe156b-af03-4cda-b0df-90afef09ac63`
  - **Response Mode:** `lastNode` (to return Gemini response)

#### 3. Test the Webhook
After activating, test with:
```bash
python scripts/test_n8n_simple.py
```

### Expected Response Structure

When your workflow is active and working, n8n will return the Gemini response. The response structure depends on your workflow configuration:

**Option 1: Direct output**
```json
{
  "output": "Gemini's response text here"
}
```

**Option 2: Nested structure**
```json
{
  "output": [
    [
      {
        "json": {
          "output": "Gemini's response text here"
        }
      }
    ]
  ]
}
```

**Option 3: Simple text**
```json
{
  "text": "Gemini's response text here"
}
```

### Display in Browser

The app will automatically:
1. ✅ Extract the Gemini response from any of these structures
2. ✅ Display it prominently in a purple gradient box
3. ✅ Show the full JSON response
4. ✅ Show all response headers

### Common Issues

1. **404 Error:** Workflow not activated → Activate the workflow
2. **Timeout:** Workflow taking too long → Increase timeout in `automation.py`
3. **Empty Response:** Check Gemini API credentials in n8n
4. **Wrong Format:** Verify `responseMode: "lastNode"` in webhook node

### Testing Steps

1. ✅ Activate workflow in n8n
2. ✅ Verify webhook URL matches: `https://ariefshaik.app.n8n.cloud/webhook-test/dcfe156b-af03-4cda-b0df-90afef09ac63`
3. ✅ Test with `python scripts/test_n8n_simple.py`
4. ✅ Trigger from app (enable failure mode, wait for high risk)
5. ✅ Check browser for Gemini response display
