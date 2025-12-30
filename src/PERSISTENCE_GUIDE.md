# Soulbound - Data Persistence Guide

## Overview

Your Soulbound app now has full cloud-based data persistence using Supabase. All user progress, quest completions, inventory items, and admin customizations are automatically saved and will persist across browser sessions and devices.

## How It Works

### 🔐 Simple User Identification
- Each browser gets a unique user ID automatically on first visit
- No login required - the app generates a unique ID seamlessly
- User IDs are stored in the browser's localStorage for session persistence
- Format: `user_[timestamp]_[random_string]` (e.g., `user_1735408000_a3b2c1d4e5`)

### 💾 What Gets Saved

**Global Data (Affects All Users):**
1. **Narrative Customizations** - Shared across all browsers/devices
   - Custom prologue text (from Admin Mode)
   - Custom epilogue text (from Admin Mode)
   - These changes affect the app for everyone

**User-Specific Data (Per Browser):**
1. **Quest Progress** - Individual to each user
   - Quest completion status
   - Individual task checkmarks
   - Quest progress percentages
   - Unlocked quests from banner pulls

2. **Inventory** - Individual to each user
   - All items and quantities
   - Weapons, artifacts, materials, and currencies
   - Rewards from completed quests

### ⚡ Auto-Save System

Data is automatically saved whenever changes occur:
- Quest progress saves instantly when you check off tasks
- Inventory updates save when you gain rewards or unlock items
- Narrative changes save when you edit them in Admin Mode

**No manual save button needed** - everything syncs automatically!

### 🔄 How Data Syncs

#### On App Load:
1. App checks for existing user ID in localStorage
2. If no ID exists, generates a new unique user ID
3. Loads saved data from Supabase database
4. Falls back to default data if nothing saved yet

#### During Use:
- Changes are saved to Supabase in real-time
- Data persists even if you close the browser
- Return visits load your exact progress

### 🗄️ Database Structure

Data is stored in Supabase's key-value store with these keys:

**Global Keys (Shared):**
- `global:narratives` - Prologue and epilogue texts (affects all users)

**User-Specific Keys:**
- `user:{userId}:quests` - Array of quest progress data
- `user:{userId}:inventory` - Array of inventory items

### 🔁 Reset Functionality

The "Reset Quest Progress" button:
- Resets local data to defaults
- Clears all saved data from the database
- Keeps your user session active

### 🌐 Cross-Device Access

**Global Admin Changes:**
- ✅ Narrative customizations sync across ALL browsers and devices
- When you edit the prologue or epilogue in Admin Mode, it updates for everyone

**User Progress:**
- ⚠️ Each browser creates its own user session
- Quest progress and inventory are separate per browser/device
- To maintain the same progress, use the same browser

**Example:**
- Edit narratives on your laptop → Changes appear on your phone immediately
- Complete quests on your laptop → Progress stays on laptop only (unless you use same browser)

### 📱 Browser Storage

The app uses two storage methods:
1. **localStorage** (browser-only):
   - User ID (unique identifier)
   - "Seen cutscene" flag
   
2. **Supabase Database** (cloud):
   - Quest data
   - Inventory data
   - Narrative texts

## Technical Details

### API Endpoints

Backend server routes (`/supabase/functions/server/index.tsx`):
- `GET /global/config` - Fetch global admin config (narratives)
- `POST /global/narratives` - Save global narratives (admin)
- `GET /user/data?userId={userId}` - Fetch user-specific data
- `POST /user/quests` - Save quest progress
- `POST /user/inventory` - Save inventory items
- `POST /user/reset` - Clear all user data

### Frontend Integration

API utilities (`/utils/api.ts`):
- `initializeAuth()` - Generate or load user ID
- `loadStoredAuth()` - Load saved user ID
- `fetchGlobalConfig()` - Get global admin config
- `fetchUserData()` - Get user-specific data
- `saveQuests()` - Save quest changes
- `saveInventory()` - Save inventory changes
- `saveNarratives()` - Save global narrative changes (admin)
- `resetUserData()` - Clear all user data

## Privacy & Security

✅ **Secure**: All data is tied to anonymous user IDs
✅ **Private**: No personal information collected
✅ **Isolated**: Each user's data is completely separate
⚠️ **Note**: This is not meant for sensitive data (per Figma Make guidelines)

## Troubleshooting

### Data not saving?
- Check browser console for errors
- Ensure you have internet connection
- Verify Supabase connection is active

### Lost progress?
- Clearing browser data (localStorage) will lose your user ID
- Each browser/device creates separate progress
- Use the same browser to maintain progress

### Want to start fresh?
- Use the "Reset Quest Progress" button in Admin Mode
- OR clear your browser's localStorage for this site

## For Developers

The persistence system uses:
- **Client-side User IDs** for simple user identification
- **Supabase Key-Value Store** for data storage
- **React useEffect hooks** for auto-saving
- **localStorage** for user ID persistence

All code is well-documented and follows the Figma Make backend architecture.