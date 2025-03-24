<img width="100%" alt="banner" src="https://github.com/user-attachments/assets/1091f42e-42c2-4764-a6ce-8008850cd823">

# BeyondLife – Digital Will APP (Source Code)

[![React Native](https://img.shields.io/badge/Framework-React%20Native-blue)](https://reactnative.dev/)
[![Expo](https://img.shields.io/badge/Built%20with-Expo-purple)](https://expo.dev/)
[![AGPL License](https://img.shields.io/badge/license-AGPL--3.0-green.svg)](LICENSE)

Welcome to the open-source demo source code for **BeyondLife** – a secure, interactive, and future-oriented digital will experience.  
This repository contains the **core source code** for a lightweight demo version of the BeyondLife app, focusing on X(formerly Twitter) integration.

> 👉 **Looking for a hands-on experience?**  
> Try out our guided interactive demo in the [BeyondLife Demo Repo](https://github.com/LimeFavoredOrange/BeyondLife_Demo).




---

## ✨ What’s in This Repo?

This repo offers a **demonstration version** of BeyondLife’s digital will configuration process. It is designed to showcase the application's technical structure, UI flow, and integration capabilities with a single platform – **X**.

- 🧩 **Modular Components**: Built with scalable architecture for future multi-platform expansion.
- 🛠️ **Twitter Will Configuration Page**: Users can simulate setting a digital will for their Twitter account.
- 🔄 **OAuth Login**: Twitter account connection is fully functional (auth only; no real data is touched).
- 🧪 **Predefined Data for Safety**: All tweet-related actions use **predefined dummy data** to avoid the accidental deletion of actual user data during testing.

> ⚠️ We do **not** retrieve or delete your real Twitter data in this demo version. The actions are purely simulated for a safe experience.

---
## 📂 Project Structure Overview

```bash
.
├── Data/                     # Predefined demo data (e.g. dummy tweets)
├── assets/                   # Static assets such as icons or illustrations
├── components/               # Reusable UI components
├── redux/                    # Redux store, slices, and state logic
├── screens/                  # Screen-level components (e.g. TwitterConfig)
├── utils/                    # Utility functions
├── App.js                    # Root app component
├── api.js                    # API logic (with backend)
├── app.json                  # Expo app configuration
├── babel.config.js           # Babel compiler settings
├── eas.json                  # Expo EAS build config
├── index.js                  # Entry point for React Native app
├── metro.config.js           # Metro bundler config
├── package.json              # Project dependencies and scripts
├── package-lock.json         # Locked dependency versions
├── tailwind.config.js        # Tailwind CSS settings (NativeWind)
└── .gitignore                # Git ignored files
```

---

## 🧪 Demo Mode Explanation

To protect user privacy, this demo uses **preloaded tweet data** for all interactions in the Twitter digital will configuration flow.

| Feature             | Description                                                                 |
|---------------------|-----------------------------------------------------------------------------|
| 🔑 **Twitter Login**      | Uses real OAuth flow to simulate account connection                     |
| 📝 **Tweet Selection**    | Operates on static tweet data loaded locally                            |
| 💥 **Delete Operation**   | Only affects dummy data – **no actual tweets will be removed**          |
| ✅ **Purpose**            | Demonstrates app UX without risk to user accounts                       |
---

## ⚙️ .env Configuration

This repository **does not include** a `.env` file for security and privacy reasons.  
To run the project locally or connect to live services, you must create a `.env` file in the project root with the following structure:

```env
CLIENT_ID=your-twitter-client-id
CLIENT_SECRET=your-twitter-client-secret
BACKEND_URL=https://your-ngrok-or-backend-url.com

DROPBOX_KEY=your-dropbox-app-key

GOOGLE_IOSCLIENT_ID=your-google-ios-client-id
GOOGLE_WEB_ID=your-google-web-client-id

FIX_SALT=your-salt-string
```

### 🔑 Field Explanations

| Variable              | Description                                                                 |
|-----------------------|-----------------------------------------------------------------------------|
| `CLIENT_ID`           | **Twitter App Client ID**. Create and copy this from the [Twitter Developer Portal](https://developer.twitter.com/en/portal/dashboard) under your app’s OAuth 2.0 settings. |
| `CLIENT_SECRET`       | **Twitter App Client Secret**. Found in the same section as above. Keep it private. |
| `BACKEND_URL`         | The full URL of your backend server. For local testing, we recommend [ngrok](https://ngrok.com/) or [Cloudflare Tunnel](https://developers.cloudflare.com/cloudflare-one/connections/connect-apps/install-and-setup/tunnel-guide/). |
| `DROPBOX_KEY`         | **Dropbox App Key**. Create an app in the [Dropbox App Console](https://www.dropbox.com/developers/apps) and copy its App Key here. |
| `GOOGLE_IOSCLIENT_ID` | **Google OAuth Client ID for iOS**. Go to [Google Cloud Console](https://console.cloud.google.com/apis/credentials), create an OAuth 2.0 Client ID for Mobile, and paste it here. |
| `GOOGLE_WEB_ID`       | **Google OAuth Client ID for Web**. Similar to the above, but for Web client type. |
| `FIX_SALT`            | A fixed salt string used internally for hashing or secure local storage. You can generate one using a secure random string generator (e.g. `openssl rand -base64 32`). |

---

## ⚠️ Disclaimer


This project is intended solely for research and academic purposes. The implementations provided here are proof-of-concept and have not been optimized or thoroughly tested for use in production environments. Users should be aware that applying this code in a production setting carries inherent risks, including but not limited to potential security vulnerabilities and performance inefficiencies. By using this code, you acknowledge that any use of this project in a production environment is at your own risk, and the authors of this project are not responsible for any damages or losses that may occur. We recommend conducting thorough testing and reviews if you intend to adapt this work for any production-level applications.

---

## 📄 License

This project is licensed under the GNU Affero General Public License v3.0 (AGPL-3.0).  
See the [LICENSE](./LICENSE) file for details.




