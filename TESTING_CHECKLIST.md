# SnapAsset AI - Pre-Production Testing Checklist

**Dev Server:** http://localhost:3000
**Testing Date:** 2025-11-04

---

## 🔐 AUTHENTICATION TESTING

### Sign Up Flow
- [ ] Visit http://localhost:3000/auth
- [ ] Click "Sign Up" tab
- [ ] Enter test email and password
- [ ] Check for validation errors (if any)
- [ ] Verify account creation success message
- [ ] Check email for confirmation link (if email is configured)

### Sign In Flow
- [ ] Visit http://localhost:3000/auth
- [ ] Enter valid credentials
- [ ] Click "Sign In"
- [ ] Verify redirect to /dashboard
- [ ] Check that user name appears in UI

### Magic Link (Optional)
- [ ] Click "Send magic link" option
- [ ] Enter email address
- [ ] Verify success message
- [ ] Check email for magic link

### Sign Out
- [ ] Click profile/user menu
- [ ] Click "Sign Out"
- [ ] Verify redirect to landing page
- [ ] Confirm session cleared

---

## 🏠 DASHBOARD & NAVIGATION

### Dashboard Page (http://localhost:3000/dashboard)
- [ ] Stats cards display correctly (Total Assets, Total Value, Properties, Coverage)
- [ ] "Add Asset" button visible and clickable
- [ ] Search bar works
- [ ] Category filter dropdown works
- [ ] Sort buttons work (Date, Value)
- [ ] Asset cards display with images
- [ ] Pagination works (if >12 assets)
- [ ] No console errors

### Navigation
- [ ] Click all main menu items:
  - [ ] Dashboard
  - [ ] Properties
  - [ ] Reports
  - [ ] Bulk Operations
  - [ ] Settings/Profile
- [ ] All pages load without errors
- [ ] Back button works correctly
- [ ] URLs are correct (no #hash routes)

---

## 📦 ASSET MANAGEMENT

### Create New Asset (http://localhost:3000/assets/add)
- [ ] Form loads correctly
- [ ] All form fields are visible:
  - [ ] Title
  - [ ] Description
  - [ ] Category dropdown
  - [ ] Brand
  - [ ] Model
  - [ ] Serial number
  - [ ] Condition
  - [ ] Estimated value
  - [ ] Purchase date
  - [ ] Property/Room selectors
- [ ] Photo upload section visible
- [ ] Can select photos from device
- [ ] Photo preview appears after selection
- [ ] Can upload multiple photos
- [ ] Primary photo selection works
- [ ] Form validation works (required fields)
- [ ] Submit button creates asset
- [ ] Redirect to asset detail page after creation
- [ ] Success toast notification appears

### Photo Upload Testing
- [ ] Click photo upload area
- [ ] Select 1 photo - uploads successfully
- [ ] Select multiple photos - all upload
- [ ] Large photos (>5MB) - check handling
- [ ] Set one as primary photo
- [ ] EXIF data extracted (check in asset details if implemented)
- [ ] Photos display in grid
- [ ] Can remove uploaded photos

### Edit Asset
- [ ] Navigate to an asset detail page
- [ ] Click "Edit" button
- [ ] Form pre-populated with asset data
- [ ] Make changes to any field
- [ ] Save changes
- [ ] Verify changes persisted
- [ ] Check updated_at timestamp

### View Asset Details
- [ ] Click on any asset card
- [ ] Asset detail page loads
- [ ] All information displays correctly
- [ ] Photos display in gallery/carousel
- [ ] Primary photo shows first
- [ ] Can click through photos
- [ ] Property and room info shown
- [ ] Edit and Delete buttons visible

### Delete Asset
- [ ] Click "Delete" button on asset
- [ ] Confirmation dialog appears
- [ ] Confirm deletion
- [ ] Asset removed from list
- [ ] Success message appears

---

## 🏢 PROPERTIES & ROOMS

### Create Property (http://localhost:3000/properties)
- [ ] Click "Add Property" button
- [ ] Enter property name
- [ ] Enter address
- [ ] Enter description
- [ ] Save property
- [ ] Property appears in list

### Create Room
- [ ] Select a property
- [ ] Click "Add Room"
- [ ] Enter room name
- [ ] Save room
- [ ] Room appears in property detail

### Assign Asset to Room
- [ ] Edit an asset
- [ ] Select property dropdown
- [ ] Select room dropdown
- [ ] Save changes
- [ ] Verify asset shows in room

---

## 📊 REPORTS & FEATURES

### Claim Report
- [ ] Navigate to Reports page
- [ ] Click "Generate Report"
- [ ] Select report type
- [ ] Report generates successfully
- [ ] Can download report (if implemented)
- [ ] Report contains accurate data

### Assessment Flow (if enabled)
- [ ] Visit /assessment
- [ ] Complete assessment quiz
- [ ] View results page
- [ ] Score displays correctly
- [ ] Recommendations show
- [ ] Can join waitlist

### Jumpstart Mode (if enabled)
- [ ] First-time user sees Jumpstart prompt
- [ ] Select a mode (Quick Win/High-Value/Room Blitz)
- [ ] Follow prompts
- [ ] Create assets via prompts
- [ ] Complete flow
- [ ] Celebration modal appears

---

## 📱 MOBILE RESPONSIVE TESTING

### Viewport Testing
- [ ] Resize browser to mobile width (375px)
- [ ] Navigation menu collapses to hamburger
- [ ] All pages remain usable
- [ ] Forms fit mobile screen
- [ ] Buttons are large enough to tap
- [ ] Images scale properly
- [ ] No horizontal scroll

### Touch Interactions
- [ ] Tap all buttons (not just click)
- [ ] Swipe gestures work (if implemented)
- [ ] Photo upload works on mobile
- [ ] Dropdowns work with touch

---

## 🎨 UI/UX QUALITY

### Visual Quality
- [ ] Consistent spacing throughout
- [ ] Readable font sizes
- [ ] Good contrast ratios
- [ ] Icons display correctly
- [ ] Loading states show (spinners/skeletons)
- [ ] Error states show helpful messages
- [ ] Success states show confirmations
- [ ] Animations are smooth (not janky)

### Accessibility
- [ ] Can navigate with keyboard (Tab key)
- [ ] Focus indicators visible
- [ ] Form labels present
- [ ] Error messages clear
- [ ] Alt text on images (check inspector)

---

## ⚡ PERFORMANCE

### Load Times
- [ ] Landing page loads quickly (<2s)
- [ ] Dashboard loads quickly
- [ ] Images lazy load
- [ ] No layout shift (CLS)
- [ ] Smooth scrolling

### Console Check
- [ ] Open DevTools Console (F12)
- [ ] Navigate through all pages
- [ ] Look for errors (red messages)
- [ ] Check for warnings (yellow messages)
- [ ] Note any performance issues

---

## 🔍 BROWSER COMPATIBILITY

### Test in Multiple Browsers
- [ ] Chrome/Edge (Chromium)
- [ ] Firefox
- [ ] Safari (if on Mac)
- [ ] Mobile Safari (iPhone)
- [ ] Mobile Chrome (Android)

---

## 💳 STRIPE TESTING (Test Mode)

### Payment Flow
- [ ] Navigate to subscription/payment page
- [ ] Click "Subscribe" or "Upgrade"
- [ ] Stripe Checkout loads
- [ ] Use test card: 4242 4242 4242 4242
- [ ] Enter any future date and CVC
- [ ] Complete payment
- [ ] Redirect back to app
- [ ] Subscription status updates
- [ ] Check Stripe Dashboard for event

---

## 🐛 ISSUE TRACKING

### Issues Found

| Issue # | Page | Description | Severity | Fixed? |
|---------|------|-------------|----------|--------|
| 1 | | | | ☐ |
| 2 | | | | ☐ |
| 3 | | | | ☐ |

**Severity Levels:**
- 🔴 Critical: Blocks core functionality
- 🟡 High: Major feature broken
- 🟢 Medium: Minor issue, has workaround
- 🔵 Low: Cosmetic/enhancement

---

## ✅ FINAL CHECKLIST

Before deploying to production:

- [ ] All critical (🔴) issues fixed
- [ ] All high (🟡) issues fixed
- [ ] Authentication works completely
- [ ] Assets can be created and edited
- [ ] Photos upload successfully
- [ ] Mobile view works
- [ ] No console errors on key pages
- [ ] Stripe test payment works
- [ ] Performance is acceptable
- [ ] UI looks polished

---

## 🚀 READY FOR DEPLOYMENT?

If all tests pass, proceed with:

```bash
# Deploy to preview first
npm run netlify:deploy

# Test preview URL thoroughly
# Then deploy to production
npm run netlify:deploy:prod
```

---

**Testing Started:** _____________
**Testing Completed:** _____________
**Ready for Production:** YES ☐ / NO ☐
Errors : 
Failed to load resource: the server responded with a status of 404 (Not Found)Understand this error
127.0.0.1:54321/rest/v1/loss_events?select=*&status=eq.active&deadline_60_days=gte.2025-11-04:1  Failed to load resource: the server responded with a status of 404 (Not Found)Understand this error
app-index.js:33 Error loading loss events: Object
window.console.error @ app-index.js:33Understand this error
127.0.0.1:54321/rest/v1/assets?select=id%2Ctitle%2Ccategory%2Ccondition%2Cestimated_value%2Ccreated_at%2Cproperties%28name%29%2Crooms%28name%29%2Casset_photos%28file_path%2Cis_primary%29&order=created_at.desc&offset=0&limit=12:1  Failed to load resource: the server responded with a status of 404 (Not Found)Understand this error
127.0.0.1:54321/rest/v1/rpc/has_role:1  Failed to load resource: the server responded with a status of 404 (Not Found)Understand this error
127.0.0.1:54321/rest/v1/rpc/has_role:1  Failed to load resource: the server responded with a status of 404 (Not Found)Understand this error
site.webmanifest:1  Failed to load resource: the server responded with a status of 404 (Not Found)Understand this error
dashboard:1 Manifest fetch from http://localhost:3000/site.webmanifest failed, code 404Understand this error
127.0.0.1:54321/rest/v1/rpc/has_role:1  Failed to load resource: the server responded with a status of 404 (Not Found)Understand this error
127.0.0.1:54321/rest/v1/loss_events?select=*&status=eq.active&deadline_60_days=gte.2025-11-04:1  Failed to load resource: the server responded with a status of 404 (Not Found)Understand this error
127.0.0.1:54321/rest/v1/assets?select=id%2Ctitle%2Ccategory%2Ccondition%2Cestimated_value%2Ccreated_at%2Cproperties%28name%29%2Crooms%28name%29%2Casset_photos%28file_path%2Cis_primary%29&order=created_at.desc&offset=0&limit=12:1  Failed to load resource: the server responded with a status of 404 (Not Found)Understand this error
127.0.0.1:54321/rest/v1/loss_events?select=*&status=eq.active&deadline_60_days=gte.2025-11-04:1  Failed to load resource: the server responded with a status of 404 (Not Found)Understand this error
127.0.0.1:54321/rest/v1/assets?select=id%2Ctitle%2Ccategory%2Ccondition%2Cestimated_value%2Ccreated_at%2Cproperties%28name%29%2Crooms%28name%29%2Casset_photos%28file_path%2Cis_primary%29&order=created_at.desc&offset=0&limit=12:1  Failed to load resource: the server responded with a status of 404 (Not Found)Understand this error
127.0.0.1:54321/rest/v1/loss_events?select=*&status=eq.active&deadline_60_days=gte.2025-11-04:1  Failed to load resource: the server responded with a status of 404 (Not Found)Understand this error
127.0.0.1:54321/rest/v1/assets?select=id%2Ctitle%2Ccategory%2Ccondition%2Cestimated_value%2Ccreated_at%2Cproperties%28name%29%2Crooms%28name%29%2Casset_photos%28file_path%2Cis_primary%29&order=created_at.desc&offset=0&limit=12:1  Failed to load resource: the server responded with a status of 404 (Not Found)Understand this error
app-index.js:33 Error loading loss events: Object
window.console.error @ app-index.js:33Understand this error
app-index.js:33 Error loading loss events: Object
window.console.error @ app-index.js:33Understand this error
app-index.js:33 Error loading loss events: Object
window.console.error @ app-index.js:33Understand this error
hot-reloader-client.js:187 [Fast Refresh] rebuilding
hot-reloader-client.js:44 [Fast Refresh] done in 177ms
127.0.0.1:54321/rest/v1/properties?select=id%2Cname%2Caddress%2Cdescription%2Ccreated_at&order=created_at.desc:1  Failed to load resource: the server responded with a status of 404 (Not Found)Understand this error
127.0.0.1:54321/rest/v1/properties?select=id%2Cname%2Caddress%2Cdescription%2Ccreated_at&order=created_at.desc:1  Failed to load resource: the server responded with a status of 404 (Not Found)Understand this error
site.webmanifest:1  Failed to load resource: the server responded with a status of 404 (Not Found)Understand this error
properties:1 Manifest fetch from http://localhost:3000/site.webmanifest failed, code 404Understand this error
127.0.0.1:54321/rest/v1/loss_events?select=*&status=eq.active&deadline_60_days=gte.2025-11-04:1  Failed to load resource: the server responded with a status of 404 (Not Found)Understand this error
app-index.js:33 Error loading loss events: Object
window.console.error @ app-index.js:33Understand this error
127.0.0.1:54321/rest/v1/assets?select=id%2Ctitle%2Ccategory%2Ccondition%2Cestimated_value%2Ccreated_at%2Cproperties%28name%29%2Crooms%28name%29%2Casset_photos%28file_path%2Cis_primary%29&order=created_at.desc&offset=0&limit=12:1  Failed to load resource: the server responded with a status of 404 (Not Found)Understand this error
127.0.0.1:54321/rest/v1/rpc/has_role:1  Failed to load resource: the server responded with a status of 404 (Not Found)Understand this error
127.0.0.1:54321/rest/v1/rpc/has_role:1  Failed to load resource: the server responded with a status of 404 (Not Found)Understand this error
127.0.0.1:54321/rest/v1/loss_events?select=*&status=eq.active&deadline_60_days=gte.2025-11-04:1  Failed to load resource: the server responded with a status of 404 (Not Found)Understand this error
127.0.0.1:54321/rest/v1/assets?select=id%2Ctitle%2Ccategory%2Ccondition%2Cestimated_value%2Ccreated_at%2Cproperties%28name%29%2Crooms%28name%29%2Casset_photos%28file_path%2Cis_primary%29&order=created_at.desc&offset=0&limit=12:1  Failed to load resource: the server responded with a status of 404 (Not Found)Understand this error
app-index.js:33 Error loading loss events: Object
window.console.error @ app-index.js:33Understand this error
site.webmanifest:1  Failed to load resource: the server responded with a status of 404 (Not Found)Understand this error
dashboard:1 Manifest fetch from http://localhost:3000/site.webmanifest failed, code 404Understand this error
hot-reloader-client.js:187 

no nagation on Properties, add aseet, reports, bulk operations pages. i can't navagate back or to other pages

Can't logoff from dashboard. 