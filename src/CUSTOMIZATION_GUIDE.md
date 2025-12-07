# 🎨 Customization Guide

This guide will help you customize your Genshin Impact-inspired app without needing to ask for help!

## 📁 File Structure

```
/config/theme.ts          <- Main theme config (colors, spacing, etc.)
/styles/globals.css       <- Global styles, fonts, and typography
/components/*.tsx         <- Individual component files
/App.tsx                  <- Main app file
```

## 🎨 Changing Colors

**To change colors**, edit `/config/theme.ts`:

```typescript
colors: {
  primary: '#4a90e2',        // Change this to any hex color!
  primaryDark: '#7b68ee',    // Secondary brand color
  gold: '#f5a623',           // Accent colors
  // ... etc
}
```

### Common Color Changes:

| What you want to change | Edit this in theme.ts |
|------------------------|----------------------|
| Button colors | `colors.primary` and `colors.primaryDark` |
| Background | `colors.bgDark`, `colors.bgMedium`, `colors.bgLight` |
| Text color | `colors.textPrimary`, `colors.textSecondary` |
| Gold/orange accents | `colors.gold` |
| Star ratings | `colors.rarity` (1-5 star colors) |

## 🔤 Changing Fonts

**To change fonts**, edit `/styles/globals.css`:

Look for the `@layer base` section and change:

```css
h1, h2, h3 {
  font-family: 'Your Font Name', sans-serif;
}
```

To use custom fonts, add them at the top of `globals.css`:

```css
@import url('https://fonts.googleapis.com/css2?family=Your+Font&display=swap');
```

## 📏 Changing Spacing & Sizes

**To change padding, margins, sizes**, edit `/config/theme.ts`:

```typescript
spacing: {
  navHeight: '70px',      // Bottom nav height
  cardPadding: '16px',    // Card padding
  screenPadding: '20px',  // Screen edges
}
```

## 🎭 Changing Gradients

**To change gradient colors**, edit `/config/theme.ts`:

```typescript
gradients: {
  primary: 'from-[#4a90e2] to-[#7b68ee]',  // Main gradient
  gold: 'from-[#f5a623] to-[#ef4444]',     // Gold gradient
}
```

These use Tailwind CSS gradient syntax.

## 🖼️ Changing Screen Layout

**To modify individual screens**, edit these files:

- Quest screen: `/components/QuestScreen.tsx`
- Wish/Banner screen: `/components/WishScreen.tsx`
- Inventory screen: `/components/InventoryScreen.tsx`
- Achievements screen: `/components/AchievementsScreen.tsx`
- Admin panel: `/components/AdminScreen.tsx`

## 🔧 Tips for Editing

1. **Colors**: Always use hex codes like `#ff0000` or RGB like `rgb(255, 0, 0)`
2. **Spacing**: Use px units like `20px` or `1rem`
3. **Save your changes**: The app auto-refreshes when you save
4. **Break something?**: Just undo (Cmd/Ctrl + Z) or ask me to fix it!

## 🤝 Working Together

**You can customize:**
- Colors (theme.ts)
- Fonts (globals.css)
- Spacing (theme.ts)
- Layout tweaks (component files)
- Text content

**Ask me for help with:**
- New features
- Complex interactions
- Data management
- Bug fixes
- New screens or components

## 💡 Quick Examples

### Make Everything Purple:
```typescript
// In /config/theme.ts
colors: {
  primary: '#9333ea',
  primaryDark: '#7c3aed',
  gold: '#a855f7',
}
```

### Make Cards Bigger:
```typescript
// In /config/theme.ts
spacing: {
  cardPadding: '24px', // was 16px
}
```

### Change Background to Darker:
```typescript
// In /config/theme.ts
colors: {
  bgDark: '#000000',
  bgMedium: '#0a0a0a',
  bgLight: '#111111',
}
```

---

**Have fun customizing! If you get stuck or want to add a new feature, just ask!** 🎮
