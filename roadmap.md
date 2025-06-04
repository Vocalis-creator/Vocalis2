# 📌 Vocalis Development Roadmap

This roadmap outlines the phased development of Vocalis — a personalized historical audio tour app — to guide implementation and help Cursor focus on the right tasks at the right time.

---

## ✅ Phase 1: UI Foundations (Local Only)
Goal: Build the base screens and layouts without backend or dynamic data.

- [ ] Implement SplashScreen and verify it launches to HomeScreen
- [ ] Build HomeScreen with top nav, profile icon, and stubbed tour list
- [ ] Create Profile/Login screen (without backend integration)
- [ ] Configure navigation stack and shared theme/style
- [ ] Set up font, color palette, spacing tokens

---

## 🔜 Phase 2: Core Features – Static Content
Goal: Build app features using static/dummy data before connecting to backend.

- [ ] Build TourCard component with image, title, tags, and duration
- [ ] Add AudioPlayer screen with static audio + play/pause
+ [ ] Add CustomizeTourScreen:
    - Location entry input
    - Duration slider
    - Multi-select interest tags
    - Toggle for directions/route guidance
    - 'Create Tour' button
    - Leads to loading/spinner screen

- [ ] Wire up navigation between Home → Tour → AudioPlayer

---

## 🔄 Phase 3: Supabase Integration
Goal: Connect app to Supabase for user data, tours, and auth.

- [ ] Set up Supabase project
- [ ] Implement Auth (login/signup + guest flow)
- [ ] Create DB schema: users, tours, segments
- [ ] Sync tour list with Supabase (read-only)
- [ ] Store selected interests and user sessions

---

## 🧠 Phase 4: AI + TTS Integration
Goal: Deliver dynamically generated tour scripts with audio.

- [ ] Implement GPT-powered tour content generator (mock at first)
- [ ] Integrate TTS (Expo Speech, then ElevenLabs or Play.ht)
- [ ] Generate audio segments from script and display with progress bar

---

## 📦 Phase 5: Offline Support
Goal: Allow downloaded tours and cached audio playback.

- [ ] Enable tour downloads using `expo-file-system`
- [ ] Add offline availability indicator to tour cards
- [ ] Handle fallback when no internet connection

---

## 🚀 Phase 6: Finalization and Deployment
Goal: Prepare for TestFlight and production builds.

- [ ] Set up EAS Build for iOS and Android
- [ ] Polish UI animations and interactions
- [ ] Add analytics and error tracking
- [ ] Submit to TestFlight