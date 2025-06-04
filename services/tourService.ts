import type { TourRequestDTO } from '../types';

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