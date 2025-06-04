/**
 * Data Transfer Object for tour generation requests
 * This interface defines the structure of data sent to the AI backend
 * to generate personalized audio tours.
 */
export interface TourRequestDTO {
  /** The location/destination for the tour */
  location: string;
  
  /** Duration of the tour in minutes */
  duration_minutes: number;
  
  /** Array of interest categories selected by the user */
  interests: string[];
  
  /** Whether to include walking directions/route guidance */
  include_directions: boolean;
  
  /** Language for the tour content (optional, defaults to English) */
  language?: string;
  
  /** User identifier for personalization (optional for anonymous users) */
  user_id?: string | null;
}

/**
 * Factory function to create a TourRequestDTO from form data
 * @param formData - The form data from CustomizeTourScreen
 * @returns TourRequestDTO object ready for API submission
 */
export function createTourRequest(formData: {
  location: string;
  durationIndex: number;
  selectedTopics: string[];
  includeRoute: boolean;
  userId?: string | null;
  language?: string;
}): TourRequestDTO {
  // Duration mapping from index to minutes
  const durationOptions = [15, 30, 45, 60, 90, 120];
  
  return {
    location: formData.location.trim(),
    duration_minutes: durationOptions[formData.durationIndex] || 45,
    interests: formData.selectedTopics,
    include_directions: formData.includeRoute,
    language: formData.language || 'en',
    user_id: formData.userId || null,
  };
}

/**
 * Validates a TourRequestDTO to ensure all required fields are present
 * @param dto - The TourRequestDTO to validate
 * @returns true if valid, throws error if invalid
 */
export function validateTourRequest(dto: TourRequestDTO): boolean {
  if (!dto.location || dto.location.trim().length === 0) {
    throw new Error('Location is required');
  }
  
  if (!dto.duration_minutes || dto.duration_minutes < 15 || dto.duration_minutes > 120) {
    throw new Error('Duration must be between 15 and 120 minutes');
  }
  
  if (!Array.isArray(dto.interests)) {
    throw new Error('Interests must be an array');
  }
  
  if (typeof dto.include_directions !== 'boolean') {
    throw new Error('Include directions must be a boolean');
  }
  
  return true;
} 