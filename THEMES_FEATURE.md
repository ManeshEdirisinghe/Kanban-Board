# Custom Themes & Branding Feature

## Overview
Your Kanban Board now includes a comprehensive custom theming system that allows users to personalize the appearance of their boards with custom brand colors and themes.

## Features Implemented

### 1. **Theme Toggle Button**
- Located in the top-right header next to the notification bell
- Quickly switch between Dark and Light themes
- Icon animates on hover for visual feedback

### 2. **Theme Customizer Modal**
- Access via the palette icon button next to the theme toggle
- Fully customizable color scheme with live preview

### 3. **Quick Theme Presets**
Five built-in theme presets for instant styling:
- **Dark**: Professional dark theme (Default: Blue accents)
- **Light**: Clean light theme
- **Blue**: Cool blue accent colors
- **Purple**: Vibrant purple and magenta accents
- **Green**: Fresh green and teal accents

### 4. **Custom Color Picker**
Three main color customization options:

#### Primary Brand Color
- Controls main accent elements (buttons, links, highlights)
- Default: `#3b82f6` (Blue)

#### Secondary Brand Color
- Controls secondary UI elements and gradients
- Default: `#a855f7` (Purple)

#### Accent Color
- Controls tertiary elements and highlights
- Default: `#06b6d4` (Cyan)

### 5. **Board Branding**
- Custom text field for board name or company branding
- Stored in theme configuration for future use

### 6. **Theme Persistence**
- All custom theme settings are saved to browser localStorage
- Settings persist across browser sessions
- Separate from light/dark theme preference

## How to Use

### Accessing Theme Customizer
1. Click the **palette icon** (🎨) in the top-right header
2. The "Customize Theme" modal will open

### Applying Quick Presets
1. Open the theme customizer
2. Click any of the 5 preset buttons
3. Colors update instantly in the preview
4. Click "Save Theme" to apply

### Custom Color Selection
1. Click the **color input boxes** next to each color label
2. A native color picker will open
3. Select your desired color
4. The hex value displays live next to the picker
5. Click "Save Theme" to apply

### Resetting to Defaults
1. Click the **"Reset to Default"** button
2. Confirm the action
3. All colors and settings return to default

## Technical Details

### Storage
- Theme preferences stored in `localStorage` as `kanbanCustomTheme`
- Format: JSON object with `primary`, `secondary`, `accent`, and `branding` properties

### CSS Variables Used
- `--accent-blue`: Primary brand color
- `--accent-purple`: Secondary brand color
- `--accent-cyan`: Accent color

### Components Affected
Theme colors automatically update:
- Header and navigation elements
- Buttons and interactive elements
- Task card borders and highlights
- Modal dialogs
- Calendar view
- Gradients throughout the interface

## Default Color Scheme
```javascript
Primary:   #3b82f6 (Blue)
Secondary: #a855f7 (Purple)
Accent:    #06b6d4 (Cyan)
```

## Available Presets
```javascript
Dark:   { primary: '#3b82f6', secondary: '#a855f7', accent: '#06b6d4' }
Light:  { primary: '#2563eb', secondary: '#9333ea', accent: '#0891b2' }
Blue:   { primary: '#0ea5e9', secondary: '#3b82f6', accent: '#06b6d4' }
Purple: { primary: '#a855f7', secondary: '#d946ef', accent: '#ec4899' }
Green:  { primary: '#10b981', secondary: '#14b8a6', accent: '#06b6d4' }
```

## User Experience
- **Live Preview**: Color hex values update as you select colors
- **One-Click Presets**: Quick application of professional color schemes
- **Persistent Customization**: Settings saved automatically across sessions
- **Reset Option**: Easy way to restore defaults
- **Responsive Design**: Theme customizer works seamlessly on mobile and desktop

## Future Enhancements
Possible additions to the theming system:
- Export/import theme configurations
- Share theme presets with team members
- Advanced typography options
- Custom font families
- Theme marketplace/gallery
- Accessibility-focused color presets
