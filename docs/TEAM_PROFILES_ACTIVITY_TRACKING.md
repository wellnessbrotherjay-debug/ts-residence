# Team Profiles & Activity Tracking Implementation

## Status: In Progress

### Completed
- ✅ Added `marketing_user_activities` table to Supabase schema
- ✅ Created `marketing-activity.ts` library for tracking functions
- ✅ Updated marketing login API to track login activities
- ✅ Added comprehensive activity types: login, logout, utm_create, utm_copy, utm_view, campaign_create, site_visit, button_click

### Pending Tasks
- ⏳ Create logout API endpoint to track logout activities
- ⏳ Add UTM creation tracking to UTM builder
- ⏳ Add UTM copy tracking to UTM builder  
- ⏳ Add button click tracking throughout the marketing portal
- ⏳ Create admin dashboard for viewing team activity
- ⏳ Add site visit tracking for marketing team
- ⏳ Add session duration tracking
- ⏳ Test the complete activity tracking system

### Key Features to Implement

1. **Login/Logout Tracking**
   - Track when team members log in and out
   - Calculate session duration
   - Record login/logout timestamps

2. **UTM Activity Tracking**
   - Track when UTM links are created
   - Track when links are copied (clipboard)
   - Track when links are viewed/performance checked
   - Record all UTM parameters and metadata

3. **Campaign Management Tracking**
   - Track when campaigns are created/edited
   - Record campaign details and timestamps
   - Track campaign performance views

4. **Site Interaction Tracking**
   - Track all page visits by marketing team
   - Record time spent on each page
   - Track referrer sources

5. **Button Interaction Tracking**
   - Track all button clicks in marketing portal
   - Record button names and page contexts
   - Track important actions like generate, copy, save

6. **Admin Dashboard**
   - View all team member activities in chronological order
   - Filter activities by user, date range, activity type
   - See login/logout history with session durations
   - View UTM creation and copy activity
- Monitor team engagement and usage patterns

### Implementation Notes
- All activities stored in `marketing_user_activities` table
- Each activity includes: user_id, username, activity_type, activity_data, timestamps
- Session tracking via marketing_session_id cookie
- Privacy-first approach - only track work-related activities