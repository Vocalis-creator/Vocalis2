import { createClient } from '@supabase/supabase-js';
import Constants from 'expo-constants';
import type { Database } from '../services/supabase';

// This script adds sample tours to test the fetchUserTours functionality
// Run with: npx ts-node scripts/add-sample-tours.ts

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables');
  process.exit(1);
}

const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);

const sampleTours = [
  {
    user_id: 'test-user-id', // Replace with actual user ID
    title: 'Vatican Museums Virtual Tour',
    location: 'Vatican City',
    duration_minutes: 45,
    interests: 'art, history, religion',
    segments: [
      {
        title: 'Welcome to Vatican Museums',
        content: 'Welcome to one of the world\'s greatest art collections. The Vatican Museums house a vast collection of art and historical artifacts collected by the Catholic Church over centuries.',
        audio_url: 'https://www2.cs.uic.edu/~i101/SoundFiles/BabyElephantWalk60.wav',
        duration_seconds: 120,
        order_index: 1,
      },
      {
        title: 'Sistine Chapel',
        content: 'The Sistine Chapel is renowned for its Renaissance art, most notably the ceiling painted by Michelangelo. This sacred space serves as the site of papal conclaves.',
        audio_url: 'https://www2.cs.uic.edu/~i101/SoundFiles/BabyElephantWalk60.wav',
        duration_seconds: 180,
        order_index: 2,
      },
      {
        title: 'Raphael Rooms',
        content: 'The Raphael Rooms are four rooms in the Apostolic Palace decorated by the Renaissance master Raphael and his workshop, showcasing some of the finest frescoes in Western art.',
        audio_url: 'https://www2.cs.uic.edu/~i101/SoundFiles/BabyElephantWalk60.wav',
        duration_seconds: 150,
        order_index: 3,
      },
    ],
  },
  {
    user_id: 'test-user-id', // Replace with actual user ID
    title: 'Ancient Rome Walking Tour',
    location: 'Rome, Italy',
    duration_minutes: 60,
    interests: 'history, architecture, archaeology',
    segments: [
      {
        title: 'Forum Romanum',
        content: 'The Roman Forum was the center of political, commercial, and judicial life in ancient Rome. These ruins tell the story of the heart of the Roman Empire.',
        audio_url: 'https://www2.cs.uic.edu/~i101/SoundFiles/BabyElephantWalk60.wav',
        duration_seconds: 240,
        order_index: 1,
      },
      {
        title: 'Colosseum Architecture',
        content: 'The Colosseum is an architectural marvel of ancient Rome, capable of holding 50,000 spectators. Its innovative design influenced stadium construction for centuries.',
        audio_url: 'https://www2.cs.uic.edu/~i101/SoundFiles/BabyElephantWalk60.wav',
        duration_seconds: 200,
        order_index: 2,
      },
    ],
  },
];

async function addSampleTours() {
  try {
    console.log('🔄 Adding sample tours to database...');
    
    for (const tour of sampleTours) {
      const { data, error } = await supabase
        .from('tours')
        .insert([tour])
        .select()
        .single();
        
      if (error) {
        console.error('❌ Error adding tour:', error);
      } else {
        console.log('✅ Added tour:', data.title);
      }
    }
    
    console.log('🎉 Sample tours added successfully!');
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

addSampleTours(); 