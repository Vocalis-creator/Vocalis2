import type { TourRequestDTO, TourResponse } from '../types';
import { supabase } from './supabase';

/**
 * Response structure for generated tours
 * This will be implemented when the backend API is ready
 */
export interface TourResponseDTO {
  id: string;
  title: string;
  location: string;
  duration_minutes: number;
  audio_url?: string;
  transcript?: string[];
  route_coordinates?: Array<{ lat: number; lng: number }>;
  generated_at: string;
  estimated_distance?: string;
  rating?: number;
}

/**
 * Tour Service for handling AI-generated tour requests
 * This service will be expanded in Phase 4 to communicate with the backend API
 */
export class TourService {
  private static instance: TourService;
  private baseUrl: string;

  private constructor() {
    // TODO: Get API base URL from environment config
    this.baseUrl = process.env.EXPO_PUBLIC_API_URL || 'https://api.vocalis.app';
  }

  /**
   * Singleton pattern to ensure only one instance of TourService
   */
  public static getInstance(): TourService {
    if (!TourService.instance) {
      TourService.instance = new TourService();
    }
    return TourService.instance;
  }

  /**
   * Generates a new tour based on user preferences
   * Currently returns mock data, will be replaced with actual API call
   * 
   * @param request - The tour request data from the user
   * @returns Promise resolving to the generated tour
   */
  async generateTour(request: TourRequestDTO): Promise<TourResponseDTO> {
    console.log('🚀 TourService.generateTour called with:', request);

    // TODO: Replace with actual API call in Phase 4
    // const response = await fetch(`${this.baseUrl}/tours/generate`, {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json',
    //     'Authorization': `Bearer ${await getAuthToken()}`, // When auth is implemented
    //   },
    //   body: JSON.stringify(request),
    // });
    //
    // if (!response.ok) {
    //   throw new Error(`API request failed: ${response.statusText}`);
    // }
    //
    // return await response.json();

    // Mock implementation for development
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          id: `tour_${Date.now()}`,
          title: `${request.location} Audio Tour`,
          location: request.location,
          duration_minutes: request.duration_minutes,
          audio_url: 'https://www2.cs.uic.edu/~i101/SoundFiles/BabyElephantWalk60.wav',
          transcript: [
            `Welcome to your personalized ${request.location} tour.`,
            `This ${request.duration_minutes}-minute experience has been tailored to your interests.`,
            ...(request.interests.length > 0 
              ? [`You'll discover fascinating insights about ${request.interests.join(', ')}.`]
              : []
            ),
            ...(request.include_directions 
              ? ['Turn-by-turn directions will guide you through each point of interest.']
              : []
            ),
            'Let\'s begin this journey through history and culture.',
          ],
          route_coordinates: request.include_directions ? [
            { lat: 41.9028, lng: 12.4534 }, // Example coordinates
            { lat: 41.9030, lng: 12.4536 },
          ] : undefined,
          generated_at: new Date().toISOString(),
          estimated_distance: '0.5 miles',
          rating: 4.8,
        });
      }, 2000); // Simulate API delay
    });
  }

  /**
   * Retrieves user's tour history
   * Will be implemented when user authentication and backend are ready
   */
  async getUserTours(userId: string): Promise<TourResponseDTO[]> {
    console.log('📚 TourService.getUserTours called for user:', userId);
    
    // TODO: Implement when backend is ready
    throw new Error('getUserTours not yet implemented');
  }

  /**
   * Saves a tour to user's favorites
   * Will be implemented when user authentication and backend are ready
   */
  async saveTour(tourId: string, userId: string): Promise<void> {
    console.log('💾 TourService.saveTour called:', { tourId, userId });
    
    // TODO: Implement when backend is ready
    throw new Error('saveTour not yet implemented');
  }
}

// Export singleton instance for easy importing
export const tourService = TourService.getInstance();

/**
 * Fetches all tours for a specific user from the database
 * @param userId - The ID of the user whose tours to fetch
 * @returns Promise resolving to array of TourResponse objects
 */
export async function fetchUserTours(userId: string): Promise<TourResponse[]> {
  try {
    console.log('🔍 Fetching tours for user:', userId);

    // Fetch tours from the database
    const { data: tours, error } = await supabase
      .from('tours')
      .select(`
        id,
        title,
        location,
        duration_minutes,
        interests,
        segments
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('❌ Error fetching tours:', error);
      throw new Error(`Failed to fetch tours: ${error.message}`);
    }

    if (!tours || tours.length === 0) {
      console.log('📭 No tours found for user');
      return [];
    }

    // Transform database tours into TourResponse objects
    const tourResponses: TourResponse[] = [];

    for (const tour of tours) {
      let segments: TourResponse['segments'] = [];

      // Check if segments exist in the tours table (JSONB)
      if (tour.segments && Array.isArray(tour.segments)) {
        segments = tour.segments.map(segment => ({
          title: segment.title,
          content: segment.content,
          audio_url: segment.audio_url,
          duration_seconds: segment.duration_seconds,
          order_index: segment.order_index,
        }));
      } else {
        // Fallback: fetch from tour_segments table
        const { data: tourSegments, error: segmentsError } = await supabase
          .from('tour_segments')
          .select('title, content, audio_url, duration_seconds, order_index')
          .eq('tour_id', tour.id)
          .order('order_index', { ascending: true });

        if (segmentsError) {
          console.error('❌ Error fetching tour segments:', segmentsError);
          // Continue with empty segments rather than failing
          segments = [];
        } else if (tourSegments) {
          segments = tourSegments;
        }
      }

      // Handle interests - check if it's already an array or needs parsing
      const interests = Array.isArray(tour.interests) 
        ? tour.interests 
        : tour.interests 
          ? tour.interests.split(',').map((interest: string) => interest.trim()).filter(Boolean)
          : [];

      tourResponses.push({
        title: tour.title,
        location: tour.location,
        duration_minutes: tour.duration_minutes,
        interests,
        segments,
      });
    }

    console.log(`✅ Successfully fetched ${tourResponses.length} tours`);
    return tourResponses;

  } catch (error) {
    console.error('❌ Error in fetchUserTours:', error);
    throw error;
  }
}

/**
 * Saves a generated tour to the database
 * @param userId - The ID of the user who created the tour
 * @param tour - The generated tour data to save
 * @returns Promise resolving to the saved tour ID
 */
export async function saveTourToDatabase(userId: string, tour: TourResponse): Promise<string> {
  try {
    console.log('💾 Saving tour to database:', { userId, title: tour.title });

    // Convert interests array to comma-separated string for database storage
    const interestsString = tour.interests.join(', ');

    // Prepare segments data for JSONB storage
    const segmentsData = tour.segments.map(segment => ({
      title: segment.title,
      content: segment.content,
      audio_url: segment.audio_url,
      duration_seconds: segment.duration_seconds,
      order_index: segment.order_index,
    }));

    // Insert tour into database
    const { data, error } = await supabase
      .from('tours')
      .insert([{
        user_id: userId,
        title: tour.title,
        location: tour.location,
        duration_minutes: tour.duration_minutes,
        interests: tour.interests, // This will be an array in the database
        segments: segmentsData,
      }])
      .select('id')
      .single();

    if (error) {
      console.error('❌ Error saving tour:', error);
      throw new Error(`Failed to save tour: ${error.message}`);
    }

    console.log('✅ Tour saved successfully with ID:', data.id);
    return data.id;

  } catch (error) {
    console.error('❌ Error in saveTourToDatabase:', error);
    throw error;
  }
} 