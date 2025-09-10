# 📦 Publishing Guide for Sero Packages

This guide covers how to publish the Sero packages to both NPM and GitHub Packages.

## 🚀 Quick Publish (Recommended)

### 1. **Using Changesets (Recommended)**

The easiest way to publish is using Changesets for version management:

1. **Add a changeset:**
   ```bash
   pnpm changeset
   # Follow prompts to describe your changes
   ```

2. **Version packages:**
   ```bash
   pnpm version-packages
   # This updates version numbers and creates a release commit
   ```

3. **Publish:**
   ```bash
   pnpm release:ci
   # Or push to trigger GitHub Actions
   git push origin main
   ```

### 2. **Automated Publishing via GitHub Actions**

1. **Create a release on GitHub:**
   ```bash
   # Tag and push
   git tag v0.1.0
   git push origin v0.1.0
   
   # Or create a release via GitHub UI
   ```

2. **The workflow automatically:**
   - Builds all packages
   - Runs type checking
   - Publishes to NPM

### 2. **Manual Publishing**

```bash
# Build and publish to NPM
pnpm release

# Or step by step:
pnpm build
pnpm typecheck
pnpm publish:npm
```

## 🔧 Setup Requirements

### NPM Setup

1. **Create NPM account** at https://npmjs.com
2. **Get NPM token:**
   ```bash
   npm login
   npm token create --read-only=false
   ```
3. **Add to GitHub Secrets:**
   - Go to GitHub repo → Settings → Secrets → Actions
   - Add `NPM_TOKEN` with your token

### GitHub Packages Setup

GitHub Packages is automatically configured and uses `GITHUB_TOKEN`.

## 📋 Pre-Publishing Checklist

- [ ] All packages build successfully (`pnpm build`)
- [ ] Type checking passes (`pnpm typecheck`)
- [ ] Version numbers updated in package.json files
- [ ] CHANGELOG.md updated (if exists)
- [ ] All tests pass (if any)
- [ ] Documentation updated

## 🏷️ Version Management

### Bump versions for all packages:
```bash
# Patch version (0.1.0 → 0.1.1)
pnpm -r exec -- npm version patch

# Minor version (0.1.0 → 0.2.0)
pnpm -r exec -- npm version minor

# Major version (0.1.0 → 1.0.0)
pnpm -r exec -- npm version major
```

### Manual version updates:
Update version in each package.json:
- `packages/core/package.json`
- `packages/react/package.json`
- `packages/next/package.json`

## 📦 Package Information

### Published Package Names:
- **Core**: `@sero/core`
- **React**: `@sero/react`
- **Next.js**: `@sero/nextjs`

### Installation for users:
```bash
# Core only
npm install @sero/core

# React
npm install @sero/react @sero/core

# Next.js
npm install @sero/nextjs @sero/core
```

## 🔒 Access Control

- **NPM**: Public packages under `@sero` scope
- **GitHub Packages**: Public packages linked to this repository

## 🛠️ Troubleshooting

### Common Issues:

1. **"Package already exists"**
   ```bash
   # Bump version first
   pnpm -r exec -- npm version patch
   ```

2. **"Authentication failed"**
   ```bash
   # Re-login to NPM
   npm logout
   npm login
   ```

3. **"Cannot publish over existing version"**
   - Update version numbers in package.json files
   - Or use `npm version` commands above

### Manual Registry Configuration:

```bash
# Check current registry
npm config get registry

# Set NPM registry (default)
npm config set registry https://registry.npmjs.org/

# Set GitHub Packages registry for @sero scope
npm config set @sero:registry https://npm.pkg.github.com
```

## 🚀 GitHub Actions Workflow

The workflow is triggered by:
- **GitHub Releases**: Automatic publishing
- **Manual Dispatch**: Choose version type (patch/minor/major)

### Manual Trigger:
1. Go to GitHub repo → Actions → "Publish Packages"
2. Click "Run workflow"
3. Select version type
4. Click "Run workflow"

## 📊 Post-Publishing

After successful publishing:

1. **Verify on NPM**: Check https://npmjs.com/package/@sero/core
2. **Verify on GitHub**: Check repo → Packages
3. **Test installation**: Try installing in a test project
4. **Update documentation**: Update README with new version info

## 🔄 Continuous Publishing

For ongoing development:

1. **Development**: Work on feature branches
2. **Release**: Merge to main → Create GitHub release
3. **Automatic**: GitHub Actions handles publishing
4. **Verify**: Check packages are available

## 🎯 Best Practices

- **Semantic Versioning**: Follow semver (major.minor.patch)
- **Changelog**: Document changes between versions
- **Testing**: Test packages before publishing
- **Coordination**: Keep all package versions in sync
- **Backup**: Tag releases in Git before publishing

---

## 📞 Support

If you encounter issues:
1. Check GitHub Actions logs
2. Verify NPM token permissions
3. Ensure package.json files are correct
4. Check network connectivity to registries
