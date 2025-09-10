#!/bin/bash

# Sero Packages Publishing Script
set -e

echo "🚀 Publishing Sero Packages"
echo "=========================="

# Check if we're in the right directory
if [ ! -f "pnpm-workspace.yaml" ]; then
    echo "❌ Error: Must be run from the root of the Sero workspace"
    exit 1
fi

# Check if user is logged into NPM
if ! npm whoami > /dev/null 2>&1; then
    echo "❌ Error: Not logged into NPM. Run 'npm login' first."
    exit 1
fi

echo "✅ NPM login verified"

# Clean and build all packages
echo "🧹 Cleaning previous builds..."
pnpm clean

echo "🔨 Building all packages..."
pnpm build

echo "🔍 Running type checks..."
pnpm typecheck

echo "✅ All checks passed!"

# Ask for confirmation
echo ""
echo "📦 Ready to publish the following packages:"
echo "  - @sero/core"
echo "  - @sero/react" 
echo "  - @sero/nextjs"
echo ""

read -p "Continue with publishing? (y/N): " -n 1 -r
echo ""

if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "❌ Publishing cancelled"
    exit 0
fi

# Publish to NPM
echo "📤 Publishing to NPM..."
pnpm -r publish --access public --no-git-checks

echo ""
echo "🎉 Successfully published all packages!"
echo ""
echo "📋 Next steps:"
echo "  1. Verify packages at https://npmjs.com/package/@sero/core"
echo "  2. Test installation: npm install @sero/nextjs"
echo "  3. Create a GitHub release to trigger GitHub Packages"
echo ""
