// ESLint flat config for the website's hand-written JavaScript, built on the shared
// OpenSpace configuration (@openspace/shared-configs).
//
// The scripts in assets/js are plain browser scripts (no modules, no build step), so the
// config targets that: browser globals, ES2022, and a few rules on top of the shared
// ones. Formatting is left to Prettier. Minified vendor files are excluded. Inline
// scripts inside _template/*.ejs.md are not covered; they are build-time templates, not
// shipped JS files
import { tsLint } from '@openspace/shared-configs/eslint';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  {
    ignores: ['assets/js/iconify-icon.min.js']
  },
  {
    files: ['assets/js/**/*.js'],
    extends: [tsLint],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'script',
      globals: {
        window: 'readonly',
        document: 'readonly',
        console: 'readonly',
        navigator: 'readonly',
        location: 'readonly',
        history: 'readonly',
        fetch: 'readonly',
        URL: 'readonly',
        URLSearchParams: 'readonly',
        IntersectionObserver: 'readonly',
        ResizeObserver: 'readonly',
        MutationObserver: 'readonly',
        performance: 'readonly',
        requestAnimationFrame: 'readonly',
        cancelAnimationFrame: 'readonly',
        setTimeout: 'readonly',
        clearTimeout: 'readonly',
        setInterval: 'readonly',
        clearInterval: 'readonly',
        queueMicrotask: 'readonly',
        alert: 'readonly',
        confirm: 'readonly',
        prompt: 'readonly',
        localStorage: 'readonly',
        sessionStorage: 'readonly',
        matchMedia: 'readonly',
        getComputedStyle: 'readonly',
        scrollTo: 'readonly',
        Date: 'readonly',
        Math: 'readonly',
        JSON: 'readonly',
        Object: 'readonly',
        Array: 'readonly',
        String: 'readonly',
        Number: 'readonly',
        Boolean: 'readonly',
        Symbol: 'readonly',
        Set: 'readonly',
        Map: 'readonly',
        WeakMap: 'readonly',
        WeakSet: 'readonly',
        Promise: 'readonly',
        Error: 'readonly',
        TypeError: 'readonly',
        RangeError: 'readonly',
        RegExp: 'readonly',
        Intl: 'readonly',
        encodeURIComponent: 'readonly',
        decodeURIComponent: 'readonly',
        encodeURI: 'readonly',
        decodeURI: 'readonly',
        parseInt: 'readonly',
        parseFloat: 'readonly',
        isNaN: 'readonly',
        isFinite: 'readonly',
        globalThis: 'readonly',
        // Third-party globals:
        // Cookiebot is provided by the Cookiebot consent script (see
        // _template/cookiebot.html); initImpactMap is defined by the inline
        // script in _template/impact-map.ejs.md on the impact page.
        Cookiebot: 'readonly',
        initImpactMap: 'readonly'
      }
    },
    rules: {
      // The shared config enables the TypeScript version of the rule for all files
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': [
        'error',
        { varsIgnorePattern: '^_', args: 'none' }
      ],
      'require-await': 'error',
      'no-eval': 'error',
      'no-implied-eval': 'error',
      'no-var': 'error',
      'prefer-const': 'error',
      eqeqeq: ['error', 'smart'],
      curly: ['error', 'multi-line']
    }
  }
);
