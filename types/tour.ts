/**
 * Tour response interface for generated audio tours
 * This defines the structure of tour data returned from the backend
 */
export interface TourResponse {
  /** The title of the generated tour */
  title: string;
  
  /** The location/destination of the tour */
  location: string;
  
  /** Duration of the tour in minutes */
  duration_minutes: number;
  
  /** Array of tour segments with audio content */
  segments: TourSegment[];
  
  /** Array of interest categories covered in this tour */
  interests: string[];
}

/**
 * Individual segment of a tour
 * Each segment represents a point of interest or story
 */
export interface TourSegment {
  /** Title of this segment/point of interest */
  title: string;
  
  /** Text content/transcript for this segment */
  content: string;
  
  /** URL to the audio file for this segment */
  audio_url: string;
  
  /** Duration of this segment in seconds */
  duration_seconds: number;
  
  /** Order of this segment in the tour */
  order_index: number;
} 