import { cookies } from "next/headers";
import { supabaseAdmin } from "@/lib/supabase-admin";

export interface ActivityData {
  button_name?: string;
  utm_id?: string;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  page_title?: string;
  time_on_page?: number;
  campaign_name?: string;
  link_copied?: boolean;
  referrer?: string;
  [key: string]: unknown;
}

export interface MarketingUserSession {
  userId: string | null;
  userName: string | null;
  sessionId: string;
  startTime: Date;
}

// Get or create marketing session
export function getMarketingSession(): MarketingUserSession {
  const cookieStore = cookies();
  const sessionId = cookieStore.get('marketing_session_id')?.value || `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

  return {
    userId: null,
    userName: null,
    sessionId,
    startTime: new Date()
  };
}

// Track marketing user activities
export async function trackMarketingActivity(
  activityType: string,
  activityData: ActivityData = {},
  options: {
    pageUrl?: string;
    referrer?: string;
    ipAddress?: string;
    userAgent?: string;
    durationSeconds?: number;
  } = {}
) {
  try {
    const cookieStore = cookies();
    const sessionId = cookieStore.get('marketing_session_id')?.value || null;
    const marketingSession = await getMarketingSession();

    // If we have a logged-in user, get their ID
    let userId = null;
    let userName = null;

    if (marketingSession.userId) {
      userId = marketingSession.userId;
      userName = marketingSession.userName;
    } else {
      // Try to get user from session cookie if available
      const sessionCookie = cookieStore.get('ts_marketing_session')?.value;
      if (sessionCookie) {
        const payload = sessionCookie.split('.')[0];
        if (payload) {
          const [timestamp, ...rest] = payload.split(':');
          userName = rest.join(':') || 'marketing-team';
        }
      }
    }

    const activity = {
      user_id: userId,
      username: userName || 'anonymous',
      activity_type: activityType,
      activity_data: activityData,
      page_url: options.pageUrl || null,
      referrer: options.referrer || null,
      ip_address: options.ipAddress || null,
      user_agent: options.userAgent || null,
      session_id: sessionId || marketingSession.sessionId,
      duration_seconds: options.durationSeconds || null,
      created_at: new Date().toISOString()
    };

    const { error } = await supabaseAdmin
      .from('marketing_user_activities')
      .insert([activity]);

    if (error) {
      console.error('Failed to track marketing activity:', error);
    }
  } catch (err) {
    console.error('Error tracking marketing activity:', err);
  }
}

// Track login activities
export async function trackMarketingLogin(userId: string, username: string) {
  await trackMarketingActivity('login', {
    username,
    login_time: new Date().toISOString()
  });
}

// Track logout activities
export async function trackMarketingLogout(userId: string, username: string, sessionDuration: number) {
  await trackMarketingActivity('logout', {
    username,
    logout_time: new Date().toISOString(),
    session_duration_seconds: sessionDuration
  });
}

// Track UTM creation
export async function trackUtmCreation(
  username: string,
  utmData: {
    source: string;
    medium: string;
    campaign: string;
    content?: string;
    term?: string;
    page: string;
  }
) {
  await trackMarketingActivity('utm_create', {
    ...utmData,
    username,
    created_at: new Date().toISOString()
  });
}

// Track UTM copy
export async function trackUtmCopy(
  username: string,
  utmId: string,
  utmData: {
    source: string;
    medium: string;
    campaign: string;
  }
) {
  await trackMarketingActivity('utm_copy', {
    username,
    utm_id: utmId,
    link_copied: true,
    ...utmData
  }, { durationSeconds: 0 });
}

// Track UTM view
export async function trackUtmView(
  username: string,
  utmId: string,
  utmData: {
    source: string;
    medium: string;
    campaign: string;
  }
) {
  await trackMarketingActivity('utm_view', {
    username,
    utm_id: utmId,
    ...utmData
  });
}

// Track campaign creation
export async function trackCampaignCreation(
  username: string,
  campaignData: {
    campaign_name: string;
    source: string;
    medium: string;
    description?: string;
  }
) {
  await trackMarketingActivity('campaign_create', {
    username,
    ...campaignData,
    created_at: new Date().toISOString()
  });
}

// Track site visits
export async function trackSiteVisit(
  username: string,
  pageUrl: string,
  referrer?: string,
  timeOnPage?: number
) {
  await trackMarketingActivity('site_visit', {
    username,
    page_url: pageUrl,
    time_on_page: timeOnPage || 0
  }, { referrer });
}

// Track button clicks
export async function trackButtonClick(
  username: string,
  buttonName: string,
  pageUrl: string,
  additionalData?: Record<string, unknown>
) {
  await trackMarketingActivity('button_click', {
    username,
    button_name: buttonName,
    page_url: pageUrl,
    ...additionalData
  }, { durationSeconds: 0 });
}

// Get user activity summary
export async function getUserActivitySummary(username: string, days: number = 7) {
  try {
    const { data, error } = await supabaseAdmin
      .from('marketing_user_activities')
      .select('*')
      .eq('username', username)
      .gte('created_at', new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString())
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching user activity summary:', error);
      return null;
    }

    return data;
  } catch (err) {
    console.error('Error getting user activity summary:', err);
    return null;
  }
}

// Get team activity overview for admin
export async function getTeamActivityOverview(days: number = 7) {
  try {
    const { data, error } = await supabaseAdmin
      .from('marketing_user_activities')
      .select('*')
      .gte('created_at', new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString())
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching team activity overview:', error);
      return null;
    }

    return data;
  } catch (err) {
    console.error('Error getting team activity overview:', err);
    return null;
  }
}

// Initialize marketing session cookie
export async function initializeMarketingSession() {
  const cookieStore = await cookies();
  const sessionId = `marketing_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

  cookieStore.set('marketing_session_id', sessionId, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 60 * 60 * 24 * 7 // 7 days
  });
}