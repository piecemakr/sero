#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Define the publishing order (dependencies first)
const publishOrder = [
  'packages/core',
  'packages/react', 
  'packages/next'
];

function log(message) {
  console.log(`[publish-npm] ${message}`);
}

function execCommand(command, options = {}) {
  log(`Running: ${command}`);
  try {
    execSync(command, { 
      stdio: 'inherit', 
      cwd: process.cwd(),
      ...options 
    });
  } catch (error) {
    log(`Error running command: ${command}`);
    log(`Error: ${error.message}`);
    process.exit(1);
  }
}

function checkNpmAuth() {
  try {
    execSync('npm whoami', { stdio: 'pipe' });
    log('✅ NPM authentication verified');
  } catch (error) {
    log('❌ Not authenticated with NPM. Run "npm login" first.');
    process.exit(1);
  }
}

function buildPackages() {
  log('🔨 Building all packages...');
  execCommand('npm run build');
  
  log('🔍 Running type checks...');
  execCommand('npm run typecheck');
  
  log('✅ Build and type check completed');
}

function publishPackage(packagePath) {
  const packageJsonPath = path.join(packagePath, 'package.json');
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
  
  log(`📦 Publishing ${packageJson.name}@${packageJson.version}...`);
  
  try {
    execCommand(`npm publish --access public`, { cwd: packagePath });
    log(`✅ Successfully published ${packageJson.name}@${packageJson.version}`);
  } catch (error) {
    // Check if package already exists
    if (error.message.includes('403') || error.message.includes('already exists')) {
      log(`⚠️  ${packageJson.name}@${packageJson.version} already exists, skipping...`);
    } else {
      throw error;
    }
  }
}

function main() {
  const isDryRun = process.argv.includes('--dry-run');
  
  log('🚀 Starting Sero packages publication');
  if (isDryRun) {
    log('🧪 DRY RUN MODE - No packages will be published');
  }
  log('=====================================');
  
  // Check authentication
  checkNpmAuth();
  
  // Build all packages
  buildPackages();
  
  if (isDryRun) {
    log('📦 Would publish packages in this order:');
    for (const packagePath of publishOrder) {
      const packageJsonPath = path.join(packagePath, 'package.json');
      const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
      log(`  - ${packageJson.name}@${packageJson.version}`);
    }
    log('');
    log('✅ Dry run completed successfully!');
    log('💡 Run without --dry-run to actually publish');
  } else {
    // Publish packages in dependency order
    for (const packagePath of publishOrder) {
      publishPackage(packagePath);
    }
    
    log('');
    log('🎉 Successfully published all packages!');
    log('');
    log('📋 Next steps:');
    log('  1. Verify packages at https://npmjs.com/package/@sero/core');
    log('  2. Test installation: npm install @sero/nextjs');
    log('  3. Create a GitHub release to trigger GitHub Packages');
    log('');
  }
}

if (require.main === module) {
  main();
}

module.exports = { main };
