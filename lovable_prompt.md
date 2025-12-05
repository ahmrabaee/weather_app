# Palestine Early Warning System - Complete Lovable AI Prompt

## 🎯 Project Overview

Create a **professional, government-style Early Warning System web application** for Palestine. This is a **front-end only prototype** with no backend - all data is simulated and stored in memory or browser localStorage.

**CRITICAL DESIGN REQUIREMENT**: The design MUST follow a **formal, authoritative government website aesthetic** - professional, trustworthy, and institutional. This is NOT a consumer app - it's a national crisis management system.

**CRITICAL IMPLEMENTATION REQUIREMENT**: You MUST create **ALL 8 PAGES** listed in this document:
1. Login & Role Selection
2. Admin Dashboard (Meteorology)
3. Create/Edit Alert
4. Sector Dashboard (Other Ministries)
5. Approve Alerts
6. Disseminate Alert
7. Public Alert View
8. Activity Logs

Do NOT skip any pages. Each page is essential for the complete prototype.

---

## 🎨 Design System & Visual Identity

### Color Palette (Based on Government Website Standards)

**Primary Colors:**
- **Navy Blue (Primary)**: `#1e3a5f` - Main header, navigation, primary buttons
- **Dark Blue**: `#2c5282` - Secondary elements, hover states
- **Light Blue Background**: `#f0f4f8` - Page backgrounds, card backgrounds

**Alert Level Colors (Critical - Must be exact):**
- **Yellow Alert**: `#FFC107` - "Be Aware" level
- **Orange Alert**: `#FF9800` - "Be Prepared" level  
- **Red Alert**: `#DC2626` - "Take Action" level

**Neutral Colors:**
- White: `#FFFFFF` - Cards, input fields
- Light Gray: `#F3F4F6` - Borders, dividers
- Medium Gray: `#6B7280` - Secondary text
- Dark Gray: `#1F2937` - Primary text

**Status Colors:**
- Green (Success): `#10B981` - Completed, Acknowledged
- Blue (Info): `#3B82F6` - In Progress
- Gray (Pending): `#9CA3AF` - Pending status

### Typography

**Font Family**: 
- Primary: `'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif`
- Arabic Support: Include proper Arabic font rendering

**Font Sizes:**
- Page Title (H1): `2.25rem` (36px) - Bold (font-weight: 700)
- Section Title (H2): `1.875rem` (30px) - Bold
- Card Title (H3): `1.5rem` (24px) - Semibold (font-weight: 600)
- Body Text: `1rem` (16px) - Regular (font-weight: 400)
- Small Text: `0.875rem` (14px) - Regular
- Captions: `0.75rem` (12px) - Regular

### Component Design Patterns

**Cards:**
```
- Background: White (#FFFFFF)
- Border: 1px solid #E5E7EB
- Border Radius: 12px
- Shadow: 0 1px 3px rgba(0, 0, 0, 0.1)
- Hover Shadow: 0 4px 6px rgba(0, 0, 0, 0.1)
- Padding: 24px
- Transition: all 0.3s ease
```

**Blue Corner Decorative Elements** (Signature Design Feature):
Add to important cards:
```
- Top-left corner: 16px × 16px gradient overlay (from-primary/10)
- Bottom-right corner: 16px × 16px gradient overlay
- Top-left accent lines: 1.5px × 32px and 32px × 1.5px (primary color)
- Border-left: 4px solid primary color
```

**Buttons:**

Primary Button:
```
- Background: Gradient from #1e3a5f to #2c5282
- Text: White, font-weight: 600
- Padding: 12px 24px
- Border Radius: 8px
- Shadow: 0 2px 4px rgba(0, 0, 0, 0.2)
- Hover: Scale 1.05, increased shadow
- Transition: all 0.3s ease
```

Secondary Button:
```
- Background: White
- Border: 2px solid #1e3a5f
- Text: #1e3a5f, font-weight: 600
- Same padding, radius, transitions as primary
```

Destructive Button:
```
- Background: Gradient from #DC2626 to #B91C1C
- Text: White
- Same styling as primary button
```

**Alert Level Badges:**
```
- Yellow: Background #FFC107, uppercase text, bold
- Orange: Background #FF9800, uppercase text, bold
- Red: Background #DC2626, white text, uppercase, bold
- Padding: 8px 16px
- Border Radius: 20px (pill shape)
- Font Size: 14px
- Shadow: 0 2px 6px rgba(color, 0.3)
```

**Input Fields:**
```
- Background: White
- Border: 2px solid #E5E7EB
- Border Radius: 8px
- Padding: 12px 16px
- Focus: Border color changes to primary blue
- Font Size: 16px
- Transition: border-color 0.2s ease
```

**Navigation Header:**
```
- Background: Navy Blue (#1e3a5f)
- Height: 72px
- Text: White
- Logo/Title: Font-size 24px, font-weight: 700
- User info: Right side, font-size 14px
- Shadow: 0 2px 8px rgba(0, 0, 0, 0.15)
```

### Responsive Design

- **Desktop**: 1200px+ (3-column layouts where applicable)
- **Tablet**: 768px - 1199px (2-column layouts)
- **Mobile**: < 768px (1-column, stacked layout)

### Animations & Transitions

- **Hover Effects**: Scale 1.02-1.05 for cards/buttons
- **Page Transitions**: Fade in 0.3s ease
- **Loading States**: Skeleton screens or pulse animations
- **Micro-animations**: Icon pulses for alerts, smooth reveals

---

## 📱 Application Pages & Detailed Specifications

### Page 1: Login & Role Selection

**URL**: `/` or `/login`

**Purpose**: Allow users to select their ministry role and enter the system

**Layout:**

```
┌─────────────────────────────────────────┐
│  [Navy Blue Header Bar]                 │
│  Early Warning System                   │
└─────────────────────────────────────────┘
│                                         │
│         [Centered Login Card]           │
│                                         │
│         Login                           │
│                                         │
│    [Select Role Dropdown ▼]            │
│    - Meteorology                        │
│    - Civil Defense                      │
│    - Agriculture                        │
│    - Water Authority                    │
│    - Environment                        │
│    - Security                           │
│                                         │
│    [Username Field]                     │
│    [Password Field]                     │
│                                         │
│    [Log in Button - Full Width]        │
│                                         │
└─────────────────────────────────────────┘
```

**Specific Elements:**

1. **Header**:
   - Background: Navy blue (#1e3a5f)
   - Text: "Early Warning System" - White, 24px, centered or left-aligned
   - No additional elements

2. **Login Card**:
   - Centered on page (max-width: 400px)
   - White background
   - Border radius: 16px
   - Padding: 48px 32px
   - Shadow: Large (elevation-3)

3. **"Login" Title**:
   - Font-size: 32px
   - Font-weight: 700
   - Color: Dark gray (#1F2937)
   - Margin-bottom: 32px
   - Centered

4. **Role Selector Dropdown**:
   - Label: "Select your role" (above dropdown)
   - Full width
   - Options displayed in dropdown
   - Default: "Meteorology" pre-selected
   - Large, readable text (16px)

5. **Username Field**:
   - Placeholder: "Username"
   - Type: text
   - Full width
   - Margin-top: 16px

6. **Password Field**:
   - Placeholder: "Password"
   - Type: password
   - Full width
   - Margin-top: 16px

7. **Login Button**:
   - Text: "Log in"
   - Full width
   - Primary button style (navy blue gradient)
   - Font-size: 18px
   - Margin-top: 24px

**Behavior:**
- On button click:
  - If role = "Meteorology" → Navigate to Admin Dashboard (Page 2)
  - If role = any other ministry → Navigate to Sector Dashboard (Page 4)
- No actual authentication required (demo prototype)
- Store selected role in React state/context or localStorage

---

### Page 2: Admin Dashboard (Meteorology Control Panel)

**URL**: `/admin-dashboard`

**Access**: Meteorology role only

**Purpose**: Central command center for viewing all alerts, statistics, and system status

**Layout:**

```
┌──────────────────────────────────────────────────────────┐
│ [Header: Early Warning System | Meteorology | Logout]   │
├──────────────────────────────────────────────────────────┤
│                                                          │
│  [Page Title: Dashboard]                                 │
│                                                          │
│  ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐│
│  │Active  │ │Yellow  │ │Orange  │ │ Red    │ │Avg     ││
│  │Alerts  │ │Alerts  │ │Alerts  │ │Alerts  │ │Response││
│  │   12   │ │   5    │ │   4    │ │   3    │ │ 2.5h   ││
│  └────────┘ └────────┘ └────────┘ └────────┘ └────────┘│
│                                                          │
│  [Filter: All | Active | Past]  [+ Create Alert Button] │
│                                                          │
│  ┌─────────────────────────────────────────────────────┐│
│  │ Alert List Table                                    ││
│  │ ID | Title | Level | Areas | Until | Status | Edit ││
│  │────┼───────┼───────┼───────┼───────┼────────┼──────││
│  │ ...                                                  ││
│  └─────────────────────────────────────────────────────┘│
└──────────────────────────────────────────────────────────┘
```

**Specific Elements:**

1. **Header Bar**:
   - Navy blue background, full width, height 72px
   - Left: "Early Warning System" logo/text (white, 20px)
   - Center: Current role badge "Meteorology" (small badge, white text)
   - Right: User icon + "Logout" button

2. **Statistics Cards Row** (5 cards):
   - Each card: White background, blue corner decorations
   - Border-left: 4px solid primary blue
   - Layout: Grid (5 columns on desktop, 2-3 on tablet, 1 on mobile)
   - **Card Structure**:
     - Icon on top (relevant icon for each metric)
     - Large number (48px, bold, primary color)
     - Label below (14px, gray color)
   
   Cards content:
   - **Active Alerts Total**: Icon (AlertTriangle), Number, "Active Alerts"
   - **Yellow Alerts**: Yellow background badge, number, "Yellow"
   - **Orange Alerts**: Orange background badge, number, "Orange"  
   - **Red Alerts**: Red background badge, number, "Red"
   - **Avg Response Time**: Clock icon, time value, "Avg Response"

3. **Action Bar**:
   - Space-between layout
   - Left: Filter buttons (All / Active / Past) - Button group style
   - Right: "+ Create New Alert" button (primary blue, large)

4. **Alerts Table**:
   - White card with shadow
   - Blue corner decorations
   - Responsive table with alternating row colors on hover
   - **Columns**:
     - **Alert ID**: e.g., "ALERT-001" (monospace font, small, gray)
     - **Title**: Main heading, bold, 16px, truncated if long
     - **Level**: Colored badge (Yellow/Orange/Red) with uppercase text
     - **Affected Areas**: Comma-separated list,truncated with "..."
     - **Valid Until**: Date/time, small font
     - **Status**: Badge (Draft/Issued/Active)
     - **Actions**: "View" and "Edit" icon buttons

5. **Row Interactions**:
   - Hover: Background changes to light blue (#F0F4F8)
   - Click on row: Highlight and show details
   - Selected row: Blue left border (4px)

**Behavior:**
- Filter buttons update table visibility
- Create Alert button → Navigate to Create Alert page (Page 3)
- Edit button → Navigate to Create Alert page with pre-filled data
- View button → Show alert details modal or navigate to detail view

---

### Page 3: Create / Edit Alert (Meteorology)

**URL**: `/create-alert` or `/edit-alert/:id`

**Access**: Meteorology only

**Purpose**: Form to create new weather alerts or edit existing ones

**Layout:**

```
┌──────────────────────────────────────────┐
│ [Header with Back button]                │
├──────────────────────────────────────────┤
│                                          │
│  Create Alert / Edit Alert               │
│                                          │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ │
│  │Heatwave  │ │Drought   │ │Flood     │ │
│  │Yellow    │ │Orange    │ │Red       │ │
│  └──────────┘ └──────────┘ └──────────┘ │
│                                          │
│  [Map Preview]                           │
│                                          │
│  Alert Details Form:                     │
│  - Hazard Type [Dropdown]                │
│  - Alert Level [Yellow|Orange|Red]       │
│  - Title [Text Input]                    │
│  - Affected Areas [Multi-select]         │
│  - Valid From [DateTime]                 │
│  - Valid To [DateTime]                   │
│  - Description AR [Textarea]             │
│  - Description EN [Textarea]             │
│  - Public Advice AR [Textarea]           │
│  - Public Advice EN [Textarea]           │
│  - Sector Recommendations [Textareas]    │
│                                          │
│  [Preview] [Cancel] [Save as Draft]      │
│  [Send Alert - Primary Button]           │
└──────────────────────────────────────────┘
```

**Specific Elements:**

1. **Header with Navigation**:
   - Back button (← icon + "Back to Dashboard")
   - Page title: "Create Alert" or "Edit Alert"
   - Navy blue top bar as usual

2. **Quick Alert Type Pills** (Top of form):
   - Three large, colored buttons showing quick templates
   - Yellow box: "Heatwave | Yellow"
   - Orange box: "Drought | Orange"
   - Red box: "Flood | Red"
   - Click to auto-fill some fields

3. **Map Preview Section**:
   - Light blue background box
   - Simple outline map of Palestine
   - Affected areas highlighted based on selection
   - Height: 300-400px

4. **Form Sections** (Organized in collapsible or tabbed sections):

   **Basic Information:**
   - Hazard Type: Dropdown (Heatwave, Flood, Storm, Drought, etc.)
   - Alert Level: Three large radio buttons (Yellow/Orange/Red) with color coding
   - Alert Title: Text input (single line, max-width)

   **Geographic & Time Scope:**
   - Affected Areas: Multi-select checkboxes or tags
     - Options: Ramallah, Jericho, Gaza, Hebron, Nablus, Jenin, etc.
   - Valid From: Date + Time picker
   - Valid To: Date + Time picker

   **Descriptions & Public Messaging:**
   - Technical Description (Arabic): Large textarea, RTL text direction
   - Technical Description (English): Large textarea
   - Public Advice (Arabic): Textarea, RTL, bullet points encouraged
   - Public Advice (English): Textarea

   **Sector-Specific Recommendations:**
   - For each ministry (Civil Defense, Agriculture, Water, Environment):
     - Labeled textarea: "Recommended Actions for [Ministry Name]"
     - Placeholder text suggesting action format

5. **Action Buttons** (Bottom of form):
   - Layout: Right-aligned group
   - Buttons (left to right):
     - "Preview" (secondary, outline style)
     - "Cancel" (secondary, outline style)
     - "Save as Draft" (secondary, solid)
     - "Send Alert" (primary, large, gradient blue)

**Behavior:**
- Auto-save draft to localStorage every 30 seconds
- Preview button → Show read-only preview modal
- Send Alert → Validate fields, create alert object, add to alerts array, navigate to dashboard
- Cancel → Confirm dialog, then navigate back

**Form Validation:**
- Required fields: Hazard Type, Level, Title, At least 1 affected area, Valid From/To
- Valid From must be before Valid To
- Show inline error messages

---

### Page 4: Sector Dashboard (Other Ministries)

**URL**: `/sector-dashboard`

**Access**: Civil Defense, Agriculture, Water, Environment, Security roles

**Purpose**: View relevant alerts and update ministry's response status

**Layout:**

```
┌──────────────────────────────────────────────────────────┐
│ [Header: EWS | Civil Defense | Logout]                  │
├──────────────────────────────────────────────────────────┤
│                                                          │
│  Civil Defense Dashboard                                 │
│                                                          │
│  ┌──────────────┐  ┌──────────────────────────────────┐ │
│  │ Active       │  │ Alert Details                    │ │
│  │ Alerts List  │  │                                  │ │
│  │              │  │ [When selected from list]        │ │
│  │ □ Alert 1    │  │                                  │ │
│  │ □ Alert 2    │  │ Title: Heatwave in Ramallah      │ │
│  │ □ Alert 3    │  │ Level: [Orange Badge]            │ │
│  │              │  │ Affected: Ramallah, Jericho      │ │
│  │              │  │ Valid: 24 Apr - 26 Apr           │ │
│  │              │  │                                  │ │
│  │              │  │ Description: [Full text...]      │ │
│  │              │  │                                  │ │
│  │              │  │ Recommended Actions for You:     │ │
│  │              │  │ - Prepare emergency teams        │ │
│  │              │  │ - Stock supplies                 │ │
│  │              │  │                                  │ │
│  │              │  │ Other Sectors Status:            │ │
│  │              │  │ 🟢 Water: Acknowledged           │ │
│  │              │  │ 🔵 Agriculture: In Progress      │ │
│  │              │  │                                  │ │
│  │              │  │ Update Your Status:              │ │
│  │              │  │ [Status Dropdown ▼]              │ │
│  │              │  │ [Notes Textarea]                 │ │
│  │              │  │ [Save Status Button]             │ │
│  └──────────────┘  └──────────────────────────────────┘ │
└──────────────────────────────────────────────────────────┘
```

**Specific Elements:**

1. **Header**:
   - Same navy blue header
   - Shows current ministry name (e.g., "Civil Defense")

2. **Page Title**:
   - E.g., "Civil Defense Dashboard"
   - 36px, bold

3. **Two-Column Layout** (Responsive: stacks on mobile):

   **Left Column - Alerts List (30% width)**:
   - Vertical list of alert cards
   - Each card shows:
     - Level badge (Yellow/Orange/Red) - Left side
     - Alert title (bold, 16px)
     - Affected areas (small, gray, truncated)
     - Valid until date (small)
     - Current sector status badge (bottom right)
   - Selected card: Blue left border (6px), light blue background

   **Right Column - Alert Details (70% width)**:
   - Only shows when an alert is selected from left list
   - White card with shadow and blue corner decorations
   
   **Details Card Structure**:
   
   a. **Alert Header**:
      - Large title
      - Alert level badge (large, prominent)
      - Metadata: Issued by, Issue time, Valid from-to
   
   b. **Geographic Info**:
      - "Affected Areas" heading
      - List or tags of areas
      - Optional: Small map preview
   
   c. **Description Section**:
      - "What is Happening?" heading
      - Full technical description (Arabic or English based on language setting)
   
   d. **Sector-Specific Section**:
      - "Recommended Actions for [Your Ministry]" heading
      - Bulleted list of actions from Meteorology
      - Highlighted box (light background)
   
   e. **Other Sectors Status**:
      - "Other Ministries' Response" heading
      - List of other sectors with status badges:
        - Green check: Completed/Acknowledged
        - Blue clock: In Progress
        - Gray: Pending
   
   f. **Your Action Panel** (Bottom of card):
      - "Update Your Status" heading
      - Dropdown menu:
        - Options: Pending, Acknowledged, In Progress, Completed
        - Selected option saves to alert object
      - "Notes/Comments" textarea (optional, for internal use)
      - "Save Status" button (primary style)

**Behavior:**
- On page load: Fetch/filter alerts relevant to this sector
- Click alert in left list → Load details in right panel
- Update status dropdown → Enable "Save" button
- Save button click → Update alert's statusBySector object, show success toast

---

### Page 5: Approve Alerts (Approval Workflow Page)

**URL**: `/alert-approval`

**Access**: Designated approvers (e.g., Senior Meteorology staff, Civil Defense leadership)

**Purpose**: Review pending alerts before public dissemination

**Layout:**

```
┌──────────────────────────────────────────────────────────┐
│ [Header: EWS | Admin | Logout]                          │
├──────────────────────────────────────────────────────────┤
│                                                          │
│  Approve Alerts                                          │
│                                                          │
│  ┌──────────────────┐  ┌───────────────────────────────┐│
│  │ Pending List     │  │ Heatwave in Ramallah          ││
│  │ (Left Sidebar)   │  │                               ││
│  │                  │  │ Severe heatwave expected...   ││
│  │ 🟡 Heatwave...   │  │                               ││
│  │ 🟠 Flood...      │  │ [Alert Level Badge]           ││
│  │ 🔴 Storm...      │  │                               ││
│  │                  │  │ Details:                      ││
│  │                  │  │ - Hazard: Heatwave            ││
│  │                  │  │ - Affected: Ramallah          ││
│  │                  │  │ - From: 24 Apr 10:00          ││
│  │                  │  │ - To: 26 Apr 18:00            ││
│  │                  │  │                               ││
│  │                  │  │ [Reject Button]  [Approve]    ││
│  └──────────────────┘  └───────────────────────────────┘│
└──────────────────────────────────────────────────────────┘
```

**Specific Elements:**

1. **Pending Alerts List** (Left sidebar, 30%):
   - Vertical list of alerts awaiting approval
   - Each item shows:
     - Alert level icon/color indicator
     - Title (truncated)
     - Sent by username/role
     - Timestamp
   - Selected alert: Highlighted background

2. **Alert Details Panel** (Right, 70%):
   - Large card showing full alert information
   - **Header**: Alert title + level badge
   - **Description**: Full text with proper formatting
   - **Metadata Grid**:
     - Hazard Type
     - Severity Level
     - Affected Areas (tags)
     - Valid From/To times
     - Sent By
   - **Public Message Preview** (what citizens will see)
   - **Action Buttons Row** (bottom):
     - "Reject" button (left, secondary, red outline)
     - "Approve" button (right, primary, large, green/blue)

**Behavior:**
- Approve click:
  - Mark alert as "Approved" and "Issued"
  - Move to Active alerts
  - Show success notification
  - Remove from pending list
- Reject click:
  - Show rejection reason modal (textarea)
  - Mark alert as "Rejected"
  - Notify creator
  - Remove from pending list

---

### Page 6: Disseminate Alert (Multi-Channel Distribution)

**URL**: `/disseminate-alert`

**Access**: Meteorology, Civil Defense (communications staff)

**Purpose**: Send approved alerts through multiple channels (SMS, WhatsApp, Email)

**Layout:**

```
┌──────────────────────────────────────────────────────────┐
│ [Header]                                                 │
├──────────────────────────────────────────────────────────┤
│                                                          │
│  Disseminate Alert                                       │
│                                                          │
│  ┌──────────────────────────────────────────────────────┐│
│  │ [SMS Tab] [WhatsApp Tab] [Email Tab]                ││
│  │                                                      ││
│  │ Message Preview:                                     ││
│  │ ┌────────────────────────────────────────────────┐  ││
│  │ │ [Preview of message as citizens will see it]   │  ││
│  │ │                                                │  ││
│  │ │ 🚨 ALERT: Heatwave in Ramallah (Orange)       │  ││
│  │ │ Severe heatwave expected...                    │  ││
│  │ └────────────────────────────────────────────────┘  ││
│  │                                                      ││
│  │ Recipients:                                          ││
│  │ ☑ Ramallah District (120k recipients)               ││
│  │ ☑ Jericho District (45k recipients)                 ││
│  │ ☐ Gaza Strip (2.1M recipients)                      ││
│  │ ☐ Emergency Response Teams (500)                    ││
│  │                                                      ││
│  │ [Send SMS Button]                                    ││
│  └──────────────────────────────────────────────────────┘│
│                                                          │
│  Activity Log:                                           │
│  ┌──────────────────────────────────────────────────────┐│
│  │ • SMS sent to Ramallah (120k) - 24 Apr 12:30 ✓      ││
│  │ • Email sent to Emergency Teams - 24 Apr 12:25 ✓    ││
│  └──────────────────────────────────────────────────────┘│
└──────────────────────────────────────────────────────────┘
```

**Specific Elements:**

1. **Channel Tabs**:
   - Three tabs: SMS, WhatsApp, Email
   - Active tab: Navy blue background, white text
   - Inactive tabs: Light gray, darker text
   - Tab content changes based on selection

2. **Message Preview Card** (For each channel):
   - **SMS Preview**: 
     - Simple text box styled like phone SMS
     - Character count shown (160/320 chars)
     - Plain text format
   - **WhatsApp Preview**: 
     - WhatsApp-style green bubble
     - Shows how message appears with timestamps
     - Can include emojis
   - **Email Preview**:
     - Email template view
     - Subject line, body preview
     - Shows sender "Palestine EWS System"

3. **Recipients Selection**:
   - Checkboxes for different recipient groups:
     - By district/governorate (with population count)
     - Emergency response teams
     - Government officials
     - "Emergency Response Teams" separate option
   - Interactive cards: Click to toggle selection
   - Selected cards: Blue border, blue background tint

4. **Send Button** (For each tab):
   - Large, primary button
   - Text changes per channel: "Send SMS", "Send WhatsApp", "Send Email"
   - Disabled if no recipients selected

5. **Activity Log** (Below main card):
   - Recent dissemination history
   - Each entry shows:
     - Channel icon
     - Message type (SMS/WhatsApp/Email)
     - Recipient count/group
     - Timestamp
     - Status icon (✓ sent, ⏳ pending, ✗ failed)

**Behavior:**
- Tab switch: Update preview and recipient options
- Checkbox toggle: Update recipient count
- Send button click:
  - Validate selection
  - Show confirmation modal ("Send to X recipients?")
  - On confirm: Simulate sending (add to log)
  - Show success toast
- Log updates in real-time

---

### Page 7: Public Alert View (Citizen-Facing)

**URL**: `/public/[alert-id]` or `/public-alert`

**Access**: Public (no login required)

**Purpose**: Display alert information for general public

**Layout:**

```
┌──────────────────────────────────────────────────────────┐
│ [Colored Alert Banner - Full Width]                     │
│ 🟠 ORANGE ALERT                                          │
│ Heatwave Expected - Ramallah Region                      │
└──────────────────────────────────────────────────────────┘

│  ┌─────────────────────────────────────────────────────┐│
│  │ What is Happening?                                  ││
│  │ Severe heatwave expected in Ramallah and nearby     ││
│  │ areas. Temperatures will exceed 40°C...             ││
│  └─────────────────────────────────────────────────────┘│
│                                                          │
│  ┌─────────────────────────────────────────────────────┐│
│  │ When?                                               ││
│  │ From: Wednesday, 24 April 2024, 10:00 AM            ││
│  │ To: Friday, 26 April 2024, 6:00 PM                  ││
│  └─────────────────────────────────────────────────────┘│
│                                                          │
│  ┌─────────────────────────────────────────────────────┐│
│  │ Where?                                              ││
│  │ [Map showing affected regions highlighted]         ││
│  │ • Ramallah    • Jericho    • Al-Bireh              ││
│  └─────────────────────────────────────────────────────┘│
│                                                          │
│  ┌─────────────────────────────────────────────────────┐│
│  │ ⚡ What Should I Do?                                 ││
│  │ ✓ Avoid direct sunlight 11am-4pm                   ││
│  │ ✓ Drink plenty of water                            ││
│  │ ✓ Check on elderly neighbors                       ││
│  │ ✓ Keep windows closed during hottest hours         ││
│  │ ✓ Never leave children or pets in vehicles         ││
│  └─────────────────────────────────────────────────────┘│
│                                                          │
│  ℹ️ This is a demonstration prototype using test data.  │
│                                                          │
└──────────────────────────────────────────────────────────┘
```

**Specific Elements:**

1. **Alert Banner** (Top, full-width):
   - Background color matches alert level:
     - Yellow: #FFC107
     - Orange: #FF9800
     - Red: #DC2626
   - Large text (40-48px): Alert level name + icon
   - Secondary text (24px): Alert title
   - High contrast (dark text on yellow/orange, white on red)
   - Padding: 48px vertical, responsive

2. **Content Cards** (4 main sections):
   - All cards: White background, shadow, rounded corners
   - Consistent padding (32px)
   - Icon + heading for each section

   **Card 1: "What is Happening?"**
   - Info icon (ℹ️) 
   - Heading: "What is Happening?" (32px, bold)
   - Body text: Full description from alert (20px, easy to read)

   **Card 2: "When?"**
   - Calendar icon (📅)
   - Heading: "When?"
   - From/To dates and times (large, bold formatting)

   **Card 3: "Where?"**
   - Map pin icon (📍)
   - Heading: "Where?"
   - **Map Component**:
     - Simple SVG or image map of Palestine
     - Affected areas highlighted in alert color
     - Minimum height: 400px
     - Borders/shadows
   - Affected areas as tags/pills below map

   **Card 4: "What Should I Do?"**
   - Lightning icon (⚡)
   - Heading: "What Should I Do?" (36px, primary color, bold)
   - Background: Light gradient (from-primary/10)
   - Border: 4px solid primary
   - **Advice List**:
     - Large checkmark icon (✓) before each item (primary color)
     - Text size: 20px
     - Line spacing: Generous (1.8-2.0)
     - Each item on new line with padding

3. **Footer Disclaimer**:
   - Light gray background
   - Centered text
   - Small font (14px)
   - Info icon
   - Text: "This is a demonstration prototype using test data only."

**Responsive Behavior:**
- Banner text scales down on mobile
- Cards stack vertically on mobile
- Map remains visible but scales
- Advice checklist remains large and readable

**Language Support:**
- Page content should display in Arabic or English based on alert's language
- Right-to-left (RTL) layout for Arabic
- Font appropriate for Arabic text

---

### Page 8: Activity Logs

**URL**: `/logs`

**Access**: Admin roles (Meteorology, Civil Defense command)

**Purpose**: System activity tracking and audit trail

**Layout:**

```
┌──────────────────────────────────────────────────────────┐
│ [Header]                                                 │
├──────────────────────────────────────────────────────────┤
│                                                          │
│  📊 Activity Logs                                        │
│                                                          │
│  ┌─────────────────────────────────────────────────────┐│
│  │ ⚙️ Data Controls                                     ││
│  │ [Load Sample] [Clear All]                           ││
│  └─────────────────────────────────────────────────────┘│
│                                                          │
│  ┌─────────────────────────────────────────────────────┐│
│  │ ⏰ Activity Log                                      ││
│  │                                                      ││
│  │ [List of log entries]                               ││
│  │ • [Badge: Meteorology] 24 Apr, 12:30               ││
│  │   Created ALERT-001 (Orange) - Flash Flood         ││
│  │                                                      ││
│  │ • [Badge: Civil Defense] 24 Apr, 12:35             ││
│  │   Acknowledged ALERT-001                            ││
│  │                                                      ││
│  │ • [Badge: Water Authority] 24 Apr, 12:40           ││
│  │   Updated status to "In Progress"                   ││
│  └─────────────────────────────────────────────────────┘│
│                                                          │
│  ┌─────────────────────────────────────────────────────┐│
│  │ System Statistics                                    ││
│  │                                                      ││
│  │  ┌────────────┐  ┌────────────┐  ┌────────────┐   ││
│  │  │Total Logs: │  │Last Activity│  │System:     │   ││
│  │  │    156     │  │  12:45 PM   │  │  ✓ Active  │   ││
│  │  └────────────┘  └────────────┘  └────────────┘   ││
│  └─────────────────────────────────────────────────────┘│
│                                                          │
│  ┌─────────────────────────────────────────────────────┐│
│  │ 💡 Developer Note                                    ││
│  │ • This page is for testing and development          ││
│  │ • Use "Load Sample" to add test data                ││
│  │ • Use "Clear All" to reset system                   ││
│  │ • All data in this prototype is local and temporary ││
│  └─────────────────────────────────────────────────────┘│
└──────────────────────────────────────────────────────────┘
```

**Specific Elements:**

1. **Page Header**:
   - Database icon + "Activity Logs" title
   - Gradient background banner

2. **Data Controls Card**:
   - Gear icon + "Data Controls" heading
   - Two buttons:
     - "Load Sample Alerts": Adds 3-4 sample alerts to system
     - "Clear All": Removes all alerts and logs (with confirmation)

3. **Activity Log Card**:
   - Clock icon + "Activity Log" heading
   - Scrollable list (max-height with scrollbar)
   - Each log entry:
     - Role badge (colored based on ministry)
     - Timestamp (small, gray, monospace)
     - Action description (medium font)
     - Hover: Light background highlight

4. **System Statistics Card**:
   - Gradient background
   - Three stat boxes (side by side):
     - **Total Logs**: Large number with icon
     - **Last Activity Time**: Time display
     - **System Status**: Green "Active" badge

5. **Developer Note Card**:
   - Light bulb icon
   - Border: Primary color
   - Background: Light blue tint
   - Bullet points with information

---

## 🔧 Technical Requirements

### Technology Stack

**Must Use:**
- **Framework**: React 18+ with TypeScript
- **Styling**: Tailwind CSS (configured with custom color palette)
- **UI Components**: shadcn/ui component library
- **Icons**: Lucide React icons
- **Routing**: React Router DOM v6
- **State Management**: React Context API or Zustand
- **Forms**: React Hook Form
- **Notifications**: Sonner (toast notifications)
- **Date/Time**: date-fns or Day.js

### Data Management

**No Backend - All Data Client-Side:**
1. **State Management**:
   - Use React Context for global state (current user, alerts array)
   - Use localStorage for data persistence between sessions

2. **Mock Data Structure**:

```typescript
interface Alert {
  id: string; // e.g., "ALERT-001"
  title: string;
  titleEn: string;
  hazardType: "flood" | "heatwave" | "storm" | "drought" | "other";
  level: "yellow" | "orange" | "red";
  issueTime: string; // ISO date string
  validFrom: string;
  validTo: string;
  affectedAreas: string[]; // array of district names
  technicalDescAr: string;
  technicalDescEn: string;
  publicAdviceAr: string;
  publicAdviceEn: string;
  sectorRecommendations: {
    [sectorName: string]: string;
  };
  status: "draft" | "pending" | "issued" | "cancelled";
  sectorResponses: {
    sectorName: string;
    status: "pending" | "acknowledged" | "in-progress" | "completed";
    notes: string;
    timestamp: string;
  }[];
  createdBy: string;
  createdAt: string;
}
```

3. **Initialize with 3-5 Sample Alerts**:
   - Include different levels (yellow, orange, red)
   - Include different hazard types
   - Include realistic Arabic and English text

### Internationalization (i18n)

**Dual Language Support:**
- All interface text must support Arabic and English
- Language toggle in header
- RTL (right-to-left) layout for Arabic
- Store translations in context or i18n library
- Default language: Arabic

**Translation Keys Needed:**
- Navigation labels
- Button text
- Form labels
- Status messages
- All static content

**IMPORTANT LANGUAGE SETTINGS:**
- **Default Language**: **English** (NOT Arabic)
- **Language Switcher**: Include a language toggle button in the header (EN/AR or English/العربية)
- When Arabic is selected, apply RTL (right-to-left) layout and use Arabic fonts
- When English is selected, use LTR (left-to-right) layout
- Store language preference in localStorage or context
- All text content must be available in both English and Arabic

### Responsive Design

**Breakpoints:**
- Mobile: < 640px (single column)
- Tablet: 640px - 1024px (two columns where applicable)
- Desktop: > 1024px (multi-column layouts)

**Mobile Optimizations:**
- Hamburger menu if needed
- Stacked cards/sections
- Touch-friendly button sizes (minimum 44px × 44px)
- Simplified tables (card view on mobile)

### Accessibility

- Semantic HTML elements
- ARIA labels where needed
- Keyboard navigation support
- Focus indicators (visible outline)
- Color contrast ratio minimum 4.5:1
- Alt text for images and icons

### Performance

- Code splitting by route
- Lazy loading for heavy components
- Optimized images (use SVG where possible)
- Minimize bundle size
- Fast initial page load (< 3 seconds)

---

## 📐 Additional Design Guidelines

### Spacing System

Use consistent spacing based on 8px grid:
- xs: 4px
- sm: 8px
- md: 16px
- lg: 24px
- xl: 32px
- 2xl: 48px
- 3xl: 64px

### Shadow Elevation

- **Low (cards)**: `0 1px 3px rgba(0, 0, 0, 0.1)`
- **Medium (hover)**: `0 4px 6px rgba(0, 0, 0, 0.1)`
- **High (modals)**: `0 10px 25px rgba(0, 0, 0, 0.15)`
- **XL (dropdowns)**: `0 20px 40px rgba(0, 0, 0, 0.2)`

### Micro-interactions

- Button hover: Scale 1.05, increase shadow
- Card hover: Subtle background change, shadow increase
- Input focus: Border color change, subtle glow
- Loading states: Skeleton screens or pulse animations
- Page transitions: Smooth fade-in (300ms)

### Map Component

**CRITICAL: Use the Provided Palestine Map Image**

You MUST use the uploaded map image located at `public/images/final-map.png` for the Palestine map component.

**Implementation Requirements:**
- Display the map image from `public/images/final-map.png` as the base map
- Allow clickable/interactive regions (each governorate) if possible using image maps or SVG overlays
- Highlight affected areas by overlaying colored semi-transparent layers that match the alert level
- Apply color coding to match alert level (Yellow #FFC107, Orange #FF9800, Red #DC2626)
- Ensure responsive scaling (the map should scale down on mobile devices)
- The map should appear in:
  - Page 3 (Create/Edit Alert): Map Preview showing selected affected areas
  - Page 7 (Public Alert View): Interactive map showing which regions are affected
  - Optionally in other pages where geographic visualization is helpful

**Fallback:**
- If the uploaded image is not available, use a simple SVG placeholder outline of Palestine

---

## 🎭 User Experience (UX) Guidelines

### Navigation Flow

1. **Login** → Role Selection → Dashboard
2. **Meteorology Path**: Dashboard → Create Alert → Approval → Disseminate
3. **Other Ministries Path**: Dashboard → View Alert Details → Update Status
4. **Public Path**: Direct link to Public Alert View (no login)

### Error Handling

- **Form Validation**: Inline error messages, red border on invalid fields
- **API Errors** (simulated): Toast notifications
- **Empty States**: Friendly messages with call-to-action
- **404 Pages**: Custom not-found page with navigation

### Loading States

- **Page Load**: Skeleton screens
- **Button Actions**: Loading spinner, disabled state
- **Data Fetch**: Shimmer effect or progress indicator

### Notifications

Use toast notifications (Sonner):
- **Success**: Green, checkmark icon, 3 seconds
- **Error**: Red, X icon, 5 seconds
- **Info**: Blue, info icon, 4 seconds
- **Warning**: Orange, warning icon, 5 seconds

---

## 📝 Content Guidelines

### Writing Style

- **Tone**: Professional, authoritative, clear
- **Language**: Simple, direct, avoid jargon
- **Instructions**: Action-oriented, specific
- **Alerts**: Concise but complete information

### Sample Alert Content

**Heatwave (Orange):**
- Title: "Severe Heatwave Expected - Central Region"
- Description: "Temperatures expected to exceed 40°C for 3 consecutive days..."
- Public Advice: "Stay hydrated / Avoid midday sun / Check on elderly"

**Flood (Red):**
- Title: "Flash Flood Warning - Valleys and Low Areas"
- Description: "Heavy rainfall expected causing dangerous flash floods..."
- Public Advice: "Do not cross flooded roads / Stay away from valleys / Move to higher ground"

---

## ✅ Implementation Checklist

### Phase 1: Foundation (Essential)
- [ ] Set up React + TypeScript + Tailwind
- [ ] Configure custom color palette
- [ ] Install shadcn/ui and Lucide icons
- [ ] Set up routing structure
- [ ] Create reusable layout components (Header, etc.)
- [ ] Implement Context for user role and alerts

### Phase 2: Core Pages (Priority)
- [ ] Login page with role selection
- [ ] Admin Dashboard (Meteorology)
- [ ] Create/Edit Alert form
- [ ] Sector Dashboard (other ministries)
- [ ] Public Alert View

### Phase 3: Additional Features
- [ ] Approve Alerts page
- [ ] Disseminate Alert page
- [ ] Activity Logs page

### Phase 4: Polish
- [ ] Add all micro-interactions and animations
- [ ] Implement full Arabic language support
- [ ] Test responsive design all breakpoints
- [ ] Add sample data and demo mode
- [ ] Accessibility audit

---

## 🚀 Deployment Notes

- Host on: Vercel, Netlify, or similar
- No environment variables needed (no backend)
- Static site deployment
- Include README with demo instructions
- Add disclaimer about prototype nature

---

## 📚 Reference Materials

**Government Website Design Inspiration:**
- Formal, authoritative aesthetic
- High contrast for readability
- Clear hierarchy and organization
- Trustworthy color palette (navy blues, grays)
- Professional typography
- Minimal decorative elements
- Focus on functionality and clarity

**Early Warning System Standards:**
- WHO Emergency Risk Communication
- Common Alerting Protocol (CAP) principles
- Clear severity levels (Yellow/Orange/Red)
- Multi-channel dissemination
- Sector-specific guidance

---

## 🎯 Success Criteria

✅ Professional government-style appearance
✅ Intuitive navigation for non-technical users
✅ All 7-8 pages fully functional
✅ Smooth interactions and transitions
✅ Works perfectly on mobile and desktop
✅ Arabic language fully supported with RTL
✅ Can demo realistic end-to-end workflow
✅ No console errors or warnings
✅ Accessible keyboard navigation
✅ Fast load times (< 3s)

---

**END OF PROMPT**

This comprehensive specification should provide Lovable AI with everything needed to build the Early Warning System prototype exactly as designed. The application should feel professional, modern, and trustworthy - befitting a national government crisis management system.
