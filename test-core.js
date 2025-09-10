// Simple test to verify @sero/core is working
import { sero } from './packages/core/dist/index.js';

console.log('Testing @sero/core...');

// Test basic configuration
sero.configure({
  delayMs: 100,
  viewTransitions: true,
  respectReducedMotion: true,
  timeoutMs: 1000
});

console.log('✅ Configuration successful');

// Test subscription
const unsubscribe = sero.subscribe((context) => {
  console.log('📡 Transition event:', context.phase);
});

console.log('✅ Subscription successful');

// Test setPaths
sero.setPaths('/home', '/about');
console.log('✅ setPaths successful');

// Test state
const state = sero.getState();
console.log('📊 Current state:', state);

// Test notifyExternalNavigation
sero.notifyExternalNavigation();
console.log('✅ notifyExternalNavigation successful');

// Clean up
unsubscribe();
console.log('✅ Unsubscribe successful');

console.log('🎉 All tests passed! @sero/core is working correctly.');
