# Obsidian Logging Setup

This setup gives you two kinds of memory:

1. UTM link creation history (automatic on every Save in the UTM Builder)
2. Copilot chat session archive (manual or scheduled sync)

Both sources are kept intentionally:

- Supabase is the operational source of truth for team tracking dashboards.
- Obsidian is the knowledge/context archive for long-term project memory.

## 1) Automatic UTM History -> Obsidian

When a user clicks Generate + Log in the UTM Builder:

- Team member name is required before generation
- The link is saved to Supabase table `generated_tracking_links`
- The API also appends a markdown block to your Obsidian vault (if configured)

### Required env var

Set this in your app environment:

```bash
OBSIDIAN_VAULT_PATH=/absolute/path/to/your/Obsidian/Vault
```

### Output note path

The note is written to:

`TS Residence/UTM Logs/utm-link-history.md`

Each entry contains:

- Created timestamp (server timestamp)
- Team member
- Source/medium/campaign/content/term
- Full generated URL

## 1.5) Marketing user profiles (recommended)

To track which team member created each link, configure named users:

```bash
MARKETING_USERS_JSON=[{"username":"antony","password":"strong-pass-1","displayName":"Antony"},{"username":"julia","password":"strong-pass-2","displayName":"Julia"}]
```

Behavior:

- Login requires username + password on the marketing portal.
- Session stores the user profile name.
- UTM creation is auto-attributed to the logged-in profile.
- For marketing sessions, server enforces `created_by` from session to prevent spoofing.

If `MARKETING_USERS_JSON` is not set, the app falls back to the old single password flow.

## 1.6) Link open history

In the UTM logs table, use `View Opens` to see per-link open events from Supabase `traffic_events`, including:

- exact timestamp
- landing page
- visitor/session identifier
- referrer
- geolocation (when available)

## 2) Copilot Chat History -> Obsidian

Use the sync script to copy Copilot debug logs to Obsidian.

### Command

```bash
pnpm obsidian:sync-chat --source "/absolute/path/to/copilot/session/log/folder" --vault "/absolute/path/to/Obsidian/Vault"
```

### Environment alternative

```bash
export COPILOT_LOG_SOURCE="/absolute/path/to/copilot/session/log/folder"
export OBSIDIAN_VAULT_PATH="/absolute/path/to/Obsidian/Vault"
pnpm obsidian:sync-chat
```

### Output paths

- Session files: `TS Residence/Chat Logs/<session-folder>/...`
- Index note: `TS Residence/Chat Logs/copilot-chat-history.md`

## Optional automation

You can run the chat sync command on a schedule using `launchd` or cron so new sessions are regularly imported.
