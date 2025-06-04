# Cursor Rules for Vocalis (React Native App)

## 📱 Project Overview

Vocalis is a mobile app that delivers **personalized, AI-generated historical audio tours**. Users select topics of interest, and the app delivers narrated, location-based storytelling through a clean and immersive interface.

This project uses **React Native** via **Expo with a custom Dev Client** — not Expo Go, and not the bare workflow.

---

## 🧱 Tech Stack

- **Framework**: React Native (TypeScript)
- **Runtime**: Expo with `expo-dev-client`
- **Backend**: Supabase (Auth, PostgreSQL, Storage)
- **Audio**:
  - Text-to-Speech via `expo-speech` or external TTS like ElevenLabs
  - Playback via `expo-av`
- **Location Services**: `expo-location`
- **State Management**: Context API or Redux (as needed)
- **Version Control**: GitHub
- **Build Targets**: iOS simulator for local testing; EAS Build for TestFlight in future

---

## 🔧 Development Guidelines

- Always assume **Expo Dev Client** is being used.
- Never reference Expo Go limitations (we can add native modules freely).
- Assume CocoaPods and Xcode are available (macOS environment).
- Use `npx expo run:ios` to test in iOS simulator.
- Organize files by module: 
  - `screens/`
  - `components/`
  - `services/`
  - `assets/`
- Ask for confirmation before:
  - Overwriting existing logic
  - Modifying navigation stack
  - Creating new folders or moving files

---

## 🧭 Screen Navigation Flow

1. **SplashScreen**
   - Auto-launches on app open
   - Displays logo and animation
   - Routes directly to HomeScreen

2. **HomeScreen**
   - Central hub with:
     - Personalized content cards
     - “Start Tour” CTA
     - Integrated location/map and search features
   - Top Navigation Bar includes:
     - Home icon (current screen)
     - Profile icon (navigates to Profile/Login)

3. **Profile/LoginScreen**
   - Appears when Profile icon is tapped from the Home screen
   - Allows login/signup or “Continue as Guest”
   - Future integration with Supabase Auth

---

## 🔊 Audio Playback & Generation

- Use `expo-av` for playback of locally stored or streamed audio.
- Use `expo-speech` initially, with optional migration to ElevenLabs or Play.ht.
- All tour content is segmented into short audio chapters (~2–5 min).
- Each segment includes:
  - Title
  - Text content
  - Audio URL (or TTS-generated string)
- Audio player screen should support:
  - Play/Pause
  - Progress bar
  - Transcript toggle
  - Minimalist design with tour image or background

---

## 📍 Location Features

- Use `expo-location` for getting the user’s current coordinates.
- Show nearby tour suggestions directly on the Home screen (inline, not via a separate map).
- Allow optional manual search from the Home screen.

---

## 🔐 Auth Flow

- Users may log in with Supabase Auth (email/password or OAuth in future).
- Users can also choose **“Continue as Guest”**, which generates a temporary session.
- Auth state should be stored globally and persist across sessions.
- Profile screen should show login status, interests, and download history.

---

## 🧠 AI Tour Content Generation (Planned)

- Dynamic scripts generated via OpenAI API (or stubbed locally for now).
- Content model includes:
  - Tour metadata (title, location, tags, estimated duration)
  - List of segments:
    - `order`
    - `text_content`
    - `audio_url` (TTS result)
    - `duration`

---

## 💾 Offline Support

- Downloadable tours with offline audio caching
- Use `expo-file-system` or Supabase Storage for managing downloaded assets
- Show download progress/status in tour cards

---

## 🎨 Design & Theming

- **Color palette**: Dark navy blue background with bronze/gold accent colors
- **Typography**:
  - Prefer **easy-to-read system fonts** like **Arial** or **Calibri**
  - Use a clean sans-serif for body and headers unless a serif is equally readable
- **Layout style**:
  - Card-based tour previews
  - Rounded buttons
  - Top navigation bar on all screens
  - Minimalist, historically inspired aesthetic

---

## 🧪 In Progress

- ✅ Splash Screen is currently under development and should launch the app directly into HomeScreen
- 🔜 Next: Build HomeScreen with integrated content sections, navigation bar, and stubbed data
- Supabase integration will begin after initial UI screens are working in iOS simulator

