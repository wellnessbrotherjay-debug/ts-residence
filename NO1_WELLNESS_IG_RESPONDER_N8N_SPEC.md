# No.1 Wellness Instagram Responder - N8N Workflow Specification

**Status**: Ready for Implementation  
**Target**: Instagram Comments, Follows, DMs  
**Team**: Randolph (Backend), Mona/Phil (Escalations)  
**Created**: 2026-04-21

---

## 🎯 WORKFLOW OVERVIEW

```
Instagram Webhook
     ↓
Route by Event Type
     ├─ FOLLOW → Auto-reply + Log
     ├─ COMMENT → Classify → AI Reply → Log
     └─ DM (collab keywords) → Alert Mona/Phil → Log
     ↓
Supabase (Global DB) - All interactions logged
```

---

## 📋 CREDENTIALS & SETUP

### Instagram API
```
App ID: 1479447920293589
App Secret: YOUR_INSTAGRAM_APP_SECRET
IG Business Account ID: YOUR_IG_BUSINESS_ACCOUNT_ID
User Access Token: YOUR_INSTAGRAM_ACCESS_TOKEN
```

### Supabase
```
Project: Global DB (bwndbccgzjdgtcyornwn)
Region: us-east-1
Service Role Key: YOUR_SUPABASE_SERVICE_ROLE_KEY
API URL: https://bwndbccgzjdgtcyornwn.supabase.co
```

### Notifications
```
WhatsApp Number (Mona/Phil): +710711777186
Email: wellnesbrotherjay@gmail.com
```

---

## 🛠️ SUPABASE TABLE SETUP

Before building the workflow, create this table in Supabase:

```sql
CREATE TABLE ig_interactions (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  interaction_type VARCHAR(50) NOT NULL, -- 'comment', 'follow', 'dm'
  instagram_username VARCHAR(255),
  instagram_user_id VARCHAR(255),
  message_text TEXT,
  ai_reply TEXT,
  sentiment_classification VARCHAR(50), -- 'positive', 'negative', 'neutral', 'inquiry'
  collab_flagged BOOLEAN DEFAULT FALSE,
  notification_sent BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_ig_interactions_username ON ig_interactions(instagram_username);
CREATE INDEX idx_ig_interactions_type ON ig_interactions(interaction_type);
CREATE INDEX idx_ig_interactions_created ON ig_interactions(created_at);
```

---

## 📦 N8N NODES & CONFIGURATION

### Node 1: Webhook (Trigger)
**Type**: Webhook  
**Name**: Instagram Webhook Trigger  
**Configuration**:
- **Authentication**: None (open webhook)
- **HTTP Method**: POST
- **Path**: `/webhook/instagram`
- **Save URL** for Instagram Graph API webhook setup

**Expected Webhook Payload** (from Instagram):
```json
{
  "object": "instagram",
  "entry": [
    {
      "id": "account_id",
      "changes": [
        {
          "value": {
            "from": { "id": "user_id", "username": "username" },
            "message": "comment text or dm text",
            "type": "comment|follow|message"
          },
          "field": "comments|followers|messages"
        }
      ]
    }
  ]
}
```

---

### Node 2: Route Events
**Type**: Switch  
**Name**: Route by Event Type  
**Configuration**:
```
Default Route: Comment

Route 1: Follows
  Condition: {{ $json.entry[0].changes[0].value.type == 'follow' }}
  Target: Node 3 (Follow Handler)

Route 2: DMs
  Condition: {{ $json.entry[0].changes[0].value.type == 'message' }}
  Target: Node 6 (DM Handler)

Route 3: Comments (Default)
  Condition: (always)
  Target: Node 4 (Comment Handler)
```

---

### Node 3: Follow Handler
**Type**: Set (Data Transform)  
**Name**: Build Follow Response  
**Configuration**:
```
Set:
  user.username = {{ $json.entry[0].changes[0].value.from.username }}
  user.id = {{ $json.entry[0].changes[0].value.from.id }}
  message = "Hey! Thanks for following No.1 Wellness. Your wellbeing is our No.1 priority. 🙏"
  type = "follow"
```

**Next**: Node 7 (Send Follow DM)

---

### Node 4: Comment Classifier
**Type**: Google Gemini (Google AI node)  
**Name**: Classify Comment Intent  
**Configuration**:
```
Model: gemini-1.5-flash
Max tokens: 100
Temperature: 0.3

Prompt:
"""
Classify the following Instagram comment as ONE of: positive_engagement, question, inquiry_collab, spam.

Comment: "{{ $json.entry[0].changes[0].value.message }}"

Respond with ONLY the classification in lowercase, nothing else.
"""
```

**Next**: Node 5 (Conditional Route by Classification)

---

### Node 5: Route by Classification
**Type**: Switch  
**Name**: Handle by Classification  
**Configuration**:
```
Route 1: Collab Inquiry
  Condition: {{ $json.body.includes('inquiry_collab') }}
  Target: Node 10 (Escalate to Mona/Phil)

Route 2: Question/Positive/Engagement
  Condition: (always - default)
  Target: Node 8 (Generate Comment Reply)
```

---

### Node 6: DM Handler
**Type**: Set  
**Name**: Extract DM Data  
**Configuration**:
```
Set:
  user.username = {{ $json.entry[0].changes[0].value.from.username }}
  user.id = {{ $json.entry[0].changes[0].value.from.id }}
  message = {{ $json.entry[0].changes[0].value.message }}
  type = "dm"
```

**Next**: Node 9 (Check for Collab Keywords in DM)

---

### Node 7: Send Follow Reply
**Type**: HTTP Request  
**Name**: Send DM Reply to Follower  
**Configuration**:
```
Method: POST
URL: https://graph.instagram.com/v18.0/{{ $json.user.id }}/messages

Headers:
  Authorization: Bearer {{ $secrets.INSTAGRAM_ACCESS_TOKEN }}

Body (JSON):
{
  "recipient": {
    "id": "{{ $json.user.id }}"
  },
  "messaging_type": "RESPONSE",
  "message": {
    "text": "{{ $json.message }}"
  }
}
```

**Next**: Node 12 (Log to Supabase)

**Error Handler**: Node 11 (OnError - Log Error)

---

### Node 8: Generate Comment Reply
**Type**: Google Gemini  
**Name**: AI Comment Response Generator  
**Configuration**:
```
Model: gemini-1.5-flash
Max tokens: 150
Temperature: 0.7

Prompt:
"""
You are a professional, friendly wellness brand representative for No.1 Wellness Club (recovery, yoga, pilates, massage, Bali).

Generate a SHORT, professional, informative response to this Instagram comment.
Tone: Premium, warm, helpful. Focus on member wellbeing.
Max 2-3 sentences.

Comment: "{{ $json.entry[0].changes[0].value.message }}"

Respond with ONLY the reply message, no quotes or extra text.
"""
```

**Next**: Node 12 (Log to Supabase)

---

### Node 9: Check Collab Keywords in DM
**Type**: Set  
**Name**: Extract DM Metadata  
**Configuration**:
```
Set:
  message_lower = {{ $json.message.toLowerCase() }}
  has_collab_keyword = {{ 
    $json.message_lower.includes('collab') || 
    $json.message_lower.includes('influencer') || 
    $json.message_lower.includes('partner') || 
    $json.message_lower.includes('work with us') ||
    $json.message_lower.includes('brand deal')
  }}
```

**Next**: Node 10 (Route)

---

### Node 10: Route DM by Keywords
**Type**: Switch  
**Name**: Collab or Regular DM?  
**Configuration**:
```
Route 1: Escalate Collab
  Condition: {{ $json.has_collab_keyword == true }}
  Target: Node 11 (Alert Mona/Phil)

Route 2: Log Regular DM
  Condition: (default)
  Target: Node 12 (Log to Supabase)
```

---

### Node 11: Escalate to Team
**Type**: HTTP Request (WAHA WhatsApp)  
**Name**: Send WhatsApp Alert to Mona/Phil  
**Configuration**:
```
Method: POST
URL: http://your-waha-instance:3000/api/sendMessage
(Or use n8n's WhatsApp node if available)

Headers:
  Authorization: Bearer {{ $secrets.WAHA_API_KEY }}

Body (JSON):
{
  "chatId": "+710711777186",
  "text": "🔔 IG Collab Inquiry\n\nFrom: @{{ $json.user.username }}\nMessage: {{ $json.message }}\n\nPlease follow up!"
}
```

**Next**: Node 12 (Log to Supabase)

---

### Node 12: Log to Supabase
**Type**: Postgres (Supabase)  
**Name**: Log Interaction to Database  
**Configuration**:
```
Host: bwndbccgzjdgtcyornwn.supabase.co
Port: 5432
Database: postgres
Username: postgres
Password: {{ $secrets.SUPABASE_PASSWORD }}
SSL: true

Query (INSERT):
INSERT INTO ig_interactions (
  interaction_type,
  instagram_username,
  instagram_user_id,
  message_text,
  ai_reply,
  sentiment_classification,
  collab_flagged,
  notification_sent
) VALUES (
  $1, $2, $3, $4, $5, $6, $7, $8
)

Parameters:
1. {{ $json.type || 'comment' }}
2. {{ $json.user.username }}
3. {{ $json.user.id }}
4. {{ $json.message || $json.entry[0].changes[0].value.message }}
5. {{ $json.body || 'auto-reply' }}
6. {{ $json.sentiment || 'neutral' }}
7. {{ $json.has_collab_keyword || false }}
8. {{ $json.notification_sent || false }}
```

**Next**: Node 13 (Respond to Webhook)

---

### Node 13: Respond to Webhook
**Type**: Respond to Webhook  
**Name**: Acknowledge Receipt  
**Configuration**:
```
Status Code: 200

Body (JSON):
{
  "status": "success",
  "message": "Interaction processed",
  "timestamp": "{{ now.toISOString() }}"
}
```

---

### Node 14 (Optional): Error Handler
**Type**: Catch  
**Name**: OnError - Log Failures  
**Configuration**:
```
Attach to: Any node that can fail (API calls)

On Error → Set Node:
  error.message = {{ $error.message }}
  error.node = {{ $execution.nodeNames[-2] }}
  error.timestamp = {{ now.toISOString() }}
  
Then → Log to Supabase errors table (create ig_errors table similar to ig_interactions)
```

---

## ⚙️ WORKFLOW LOGIC FLOW

```
START: Instagram Webhook comes in
  ↓
Route by Type (Node 2)
  ├─ FOLLOW
  │  └─ Build response (Node 3)
  │     └─ Send DM (Node 7)
  │        └─ Log (Node 12)
  │
  ├─ DM
  │  └─ Extract data (Node 6)
  │     └─ Check collab keywords (Node 9)
  │        ├─ Has keywords → Alert team (Node 11) → Log
  │        └─ No keywords → Log
  │
  └─ COMMENT
     └─ Classify intent (Node 4)
        ├─ Collab inquiry → Alert team (Node 11) → Log
        └─ Other → Generate AI reply (Node 8) → Log
         
All paths → Respond to webhook (Node 13)
```

---

## 🔐 ENVIRONMENT VARIABLES / SECRETS

Store these in n8n Credentials:

```
INSTAGRAM_ACCESS_TOKEN=YOUR_INSTAGRAM_ACCESS_TOKEN
INSTAGRAM_BUSINESS_ACCOUNT_ID=YOUR_IG_BUSINESS_ACCOUNT_ID
INSTAGRAM_APP_ID=YOUR_INSTAGRAM_APP_ID
INSTAGRAM_APP_SECRET=YOUR_INSTAGRAM_APP_SECRET

SUPABASE_API_KEY=YOUR_SUPABASE_SERVICE_ROLE_KEY
SUPABASE_HOST=bwndbccgzjdgtcyornwn.supabase.co
SUPABASE_DATABASE=postgres
SUPABASE_USER=postgres

WAHA_API_KEY=your-waha-key
WAHA_INSTANCE_URL=http://your-waha-instance:3000

GEMINI_API_KEY=your-gemini-api-key
```

---

## 🚀 ACTIVATION STEPS (For Randolph)

1. **Build workflow** in n8n using nodes 1-13 above
2. **Test webhook URL** - once saved, copy webhook URL to Instagram Graph API webhook setup
3. **Configure Instagram webhook** in your Meta App:
   - Go to Meta App Dashboard
   - Settings → Webhooks
   - Subscribe to: `comments`, `messaging`, `messaging_optins`
   - Verify token: use any string, n8n will auto-verify
   - Paste n8n webhook URL
4. **Test flows**:
   - Post a comment on your IG → should get auto-reply
   - Follow the account → should get welcome DM
   - DM with "collab" keyword → should alert Mona/Phil on WhatsApp
5. **Monitor** Supabase table for all logged interactions
6. **Enable workflow** in n8n (toggle the run button)

---

## 📊 MONITORING & MAINTENANCE

**Weekly checks**:
- Review `ig_interactions` table for new interactions
- Check `sentiment_classification` accuracy
- Verify WhatsApp alerts reaching Mona/Phil
- Monitor for spam/bot comments (filter in Node 4)

**Cost optimization**:
- Gemini Flash Lite: ~$0.075 per 1M tokens (cheapest)
- Batch similar comments in peak hours (future optimization)
- Only call AI for non-spam comments (filter first)

---

## 🔧 TROUBLESHOOTING

| Issue | Solution |
|-------|----------|
| Webhook not receiving | Check Instagram webhook setup, verify token in Meta app |
| AI replies are generic | Adjust Gemini prompt or temperature in Node 8 |
| WhatsApp not sending | Verify WAHA is running, API key is correct, number has WhatsApp |
| Supabase connection fails | Check credentials, verify table exists, check RLS policies |
| DM escalation not working | Check collab keywords list, verify WhatsApp number format |

---

## 📞 SUPPORT

- **Randolph**: Handles n8n setup, credentials, webhook configuration
- **Mona/Phil**: Monitor WhatsApp alerts for collab inquiries
- **Jay**: Reviews Supabase logs, adjusts AI prompts, monitors sentiment accuracy

---

**Ready to build?** Follow the nodes 1-13 in order. Let me know if you hit any snags!
