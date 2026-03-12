#!/bin/bash
# Cleanup script for removing unused dependencies and components
# Run this script to remove unused dev dependencies and UI components

set -e

echo "🧹 Starting cleanup process..."

# Remove unused devDependencies
echo "📦 Removing unused dependencies..."
npm uninstall lovable-tagger @playwright/test @testing-library/jest-dom --legacy-peer-deps

# Remove unused files
echo "🗑️  Removing unused configuration files..."
rm -f playwright-fixture.ts playwright.config.ts

# Remove unused UI components
echo "🗑️  Removing unused UI components (150KB savings)..."
UNUSED_COMPONENTS=(
  "accordion.tsx"
  "alert-dialog.tsx"
  "aspect-ratio.tsx"
  "breadcrumb.tsx"
  "calendar.tsx"
  "carousel.tsx"
  "checkbox.tsx"
  "collapsible.tsx"
  "command.tsx"
  "context-menu.tsx"
  "drawer.tsx"
  "hover-card.tsx"
  "input-otp.tsx"
  "menubar.tsx"
  "navigation-menu.tsx"
  "pagination.tsx"
  "popover.tsx"
  "progress.tsx"
  "radio-group.tsx"
  "resizable.tsx"
  "scroll-area.tsx"
  "select.tsx"
  "separator.tsx"
  "sheet.tsx"
  "sidebar.tsx"
  "skeleton.tsx"
  "slider.tsx"
  "switch.tsx"
  "table.tsx"
  "tabs.tsx"
  "toggle-group.tsx"
  "toggle.tsx"
  "alert.tsx"
  "input.tsx"
)

for component in "${UNUSED_COMPONENTS[@]}"; do
  if [ -f "src/components/ui/$component" ]; then
    rm "src/components/ui/$component"
    echo "  ✓ Removed $component"
  fi
done

echo ""
echo "✅ Cleanup complete!"
echo ""
echo "Next steps:"
echo "1. Run: npm install"
echo "2. Run: npm run build"
echo "3. Verify the site still works: npm run dev"
echo ""
echo "Expected results:"
echo "  • Bundle size reduced by ~150KB"
echo "  • node_modules reduced by ~50-100MB"
echo "  • Faster install and build times"
