<img src="./static/favicon.svg" width="64" height="64" alt="" />

# kcalCalc

A free calorie counting app made to fit my needs.

## Setup Firebase:

- Create new Firebase Project
- Create Web App
- Copy following env values:
  - VITE_APIKEY
  - VITE_AUTHDOMAIN
  - VITE_PROJECTID
  - VITE_STORAGEBUCKET
  - VITE_MESSAGINGSENDERID
  - VITE_APPID
- Go to "Project settings" > "Service accounts" > "Generate new private key"
- Copy following env values:
  - VITE_ADMIN_CLIENT_EMAIL
  - VITE_ADMIN_PRIVATE_KEY
- Enable Auth: Go to "Authentication" > "Get started" > "Google" > "Enable" > set "Project support email" field > "Save"
- Enable Firestore: Go to "Firestore Database" > "Create database" > "Start in test mode" > "Next" > set "Cloud Firestore location" field near you > "Enable"
- Setup Rules: "Firestore Database" > "Rules" > paste following
  - ```js
    rules_version = '2';
    service cloud.firestore {
      match /databases/{database}/documents {
          match /Users/{userId}/{documents=**} {
          allow read, write: if userId == request.auth.uid;
        }
        match /Items/{documents=**} {
          allow read: if true;
          allow write: if true; // TODO: only owner can write
        }
      }
    }
    ```

---

TODO:

- Setup Guide for...
  - frontend
  - dev
