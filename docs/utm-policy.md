# TS Residence: UTM & Campaign Tracking Policy

This document outlines the strict naming conventions for Google Analytics 4 (GA4) and Meta campaign tracking. To maintain clean reporting, avoid fragmented data, and correctly attribute conversions, **all external links to TS Residence must follow these rules.**

## 1. Golden Rules of UTM Tagging

1. **Lowercase Only:** Never use capital letters. (Use `meta`, not `Meta`).
2. **Snake Case:** Use underscores `_` to separate words. No spaces, dashes, or special characters. (Use `summer_promo`, not `summer-promo` or `summer promo`).
3. **Be Consistent:** Use the exact `utm_source` and `utm_medium` pairs defined below. Do not invent new sources for existing platforms.
4. **No PII:** Never place names, emails, or phone numbers in any UTM parameter.

---

## 2. Standardized Source & Medium Pairs

When building links, always use these exact source/medium combinations to ensure GA4 maps them to the correct Default Channel Group.

| Channel / Platform | `utm_source` | `utm_medium` | Example Usage |
| :--- | :--- | :--- | :--- |
| **Meta Ads (FB/IG)** | `meta` | `paid_social` | Sponsored posts, Reels ads, Carousel ads. |
| **Google Search Ads** | `google` | `cpc` | Paid search keywords. |
| **Google Display Ads** | `google` | `display` | Banners across Google Network. |
| **Email Newsletter** | `newsletter` | `email` | Monthly resident updates. |
| **Organic Instagram** | `instagram` | `social` | Link in bio, organic story swiped. |
| **Organic TikTok** | `tiktok` | `social` | Link in bio. |
| **Referral Partners**| `[partner_name]` | `referral` | e.g. `utm_source=bali_nomads&utm_medium=referral` |

---

## 3. Campaign, Content, & Term Guidelines

### `utm_campaign`
The overarching marketing initiative.
- **Format:** `[market]_[objective]_[theme]`
- **Examples:** `aus_retargeting_q3`, `global_brand_awareness`, `jkt_longstay_promo`

### `utm_content`
Used for exact creative, ad variant, or placement A/B testing.
- **Format:** `[format]_[visual_theme]_[copy_variant]`
- **Examples:** `reels_coworking_v1`, `carousel_pool_lifestyle`, `static_bedroom_dark`

### `utm_term`
Primarily used for Search keywords, but in paid social, use it for audience targeting.
- **Examples:** `expat_bali_30d`, `digital_nomad_lookalike`, `sem_luxury_apartment_seminyak`

---

## 4. URL Builder Template (For Media Buyers)

### Meta Ads Default Tracking Template
In Ads Manager, under "URL Parameters", paste the following exactly. (Meta will auto-fill the brackets dynamically).

\`\`\`text
utm_source=meta&utm_medium=paid_social&utm_campaign={{campaign.name}}&utm_content={{ad.name}}&utm_term={{adset.name}}
\`\`\`
*Note: Ensure your Meta Campaign, Adset, and Ad names are already formatted in `snake_case` before publishing!*

### Google Ads Default Tracking Template
Google Ads should have **Auto-tagging enabled** (which produces `gclid`). However, for safety/redundancy, you can use:

\`\`\`text
{lpurl}?utm_source=google&utm_medium=cpc&utm_campaign={campaignid}&utm_term={keyword}&utm_content={creative}
\`\`\`

---

## 5. System Handling & Persistence (How it works technically)

Our application automatically captures `utm_*` and advertising click IDs (`gclid`, `fbclid`, `ttclid`) whenever a user lands on the site.

- **First-Touch Persistence:** The very first UTMs a user arrives with are locked in `localStorage` as their "first touch".
- **Latest-Touch Persistence:** The most recent ad they clicked is stored as "latest touch". 
- **Outbound Link Decoration:** When a user clicks "Book Now" or is redirected to a third-party booking engine, these captured UTMs are automatically appended to the destination URL, ensuring cross-domain tracking works perfectly.
- **Events Matrix:** Every GA4 & Meta event (e.g., `cta_click`, `form_submit`) sends the current UTM payload, giving us exact ROAS modeling.
