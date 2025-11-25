# Styles Directory

This directory contains modular CSS files for the application.

## Structure

- **`base.css`** - Base styles including theme configuration and fundamental HTML/body styles
- **`animations.css`** - Reusable CSS animations used throughout the app

## Usage

All styles are imported in the main `app.css` file:

```css
@import 'tailwindcss';
@import './styles/base.css';
@import './styles/animations.css';
```

## Adding New Styles

When adding new styles:

1. **Animations** - Add to `animations.css` if it's a reusable animation
2. **Base/Theme** - Add to `base.css` if it's a fundamental style or theme configuration
3. **Component-specific** - Consider creating a new file if you have many component-specific styles

## Current Animations

- **`fadeIn`** - Smooth fade-in with slight upward movement (used for chat messages)
