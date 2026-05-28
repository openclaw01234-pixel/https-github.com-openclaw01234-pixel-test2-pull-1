/* =========================================
   App Configuration
   =========================================
   GOOGLE SIGN-IN SETUP:
   1. Go to https://console.cloud.google.com/
   2. Create a new project (or select existing)
   3. APIs & Services → Credentials → Create Credentials → OAuth Client ID
   4. Application type: Web application
   5. Authorized JavaScript origins:
      - http://localhost:8000
      - https://YOUR_USERNAME.github.io
      - (your deployed URL)
   6. Copy the Client ID and paste below in GOOGLE_CLIENT_ID
   ========================================= */

const APP_CONFIG = {
  // Replace with your own Google OAuth Client ID
  // Get it from: https://console.cloud.google.com/apis/credentials
  // Format: "1234567890-abcdef.apps.googleusercontent.com"
  GOOGLE_CLIENT_ID: '',  // <-- PASTE YOUR CLIENT ID HERE

  // Demo mode: when true, "Sign in with Google" works as a demo without real OAuth
  DEMO_MODE: true,

  APP_NAME: 'MX Player Pro',
  APP_VERSION: '1.1.0'
};
