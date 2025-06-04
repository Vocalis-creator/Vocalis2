import type { TourRequestDTO, TourResponse, TourSegment } from '../types';

/**
 * Mock tour generator for development and testing
 * This simulates the AI backend that will generate personalized tours
 */

/**
 * Sample audio URLs for testing
 * Using publicly available sample audio files
 */
const SAMPLE_AUDIO_URLS = [
  'https://www2.cs.uic.edu/~i101/SoundFiles/BabyElephantWalk60.wav',
  'https://www.soundjay.com/misc/sounds/bleep_4.mp3',
  'https://sample-videos.com/zip/10/mp3/mp3-files/SampleAudio_0.4mb_mp3.mp3',
];

/**
 * Template tour segments based on common interests
 */
const TOUR_TEMPLATES = {
  art: {
    segments: [
      {
        title: 'Renaissance Masterpieces',
        textTemplate: 'Welcome to one of the world\'s greatest collections of Renaissance art. Here at {location}, you\'ll discover masterpieces that have inspired artists for centuries.',
        duration: 180,
      },
      {
        title: 'Artistic Techniques',
        textTemplate: 'Notice the incredible detail and use of perspective in these works. The artists of {location} pioneered techniques that revolutionized art.',
        duration: 150,
      },
    ],
  },
  history: {
    segments: [
      {
        title: 'Historical Foundations',
        textTemplate: 'Step back in time as we explore the rich history of {location}. This place has witnessed centuries of human civilization.',
        duration: 200,
      },
      {
        title: 'Cultural Heritage',
        textTemplate: 'The stories embedded in these walls tell of triumph, struggle, and the enduring human spirit that defines {location}.',
        duration: 165,
      },
    ],
  },
  religion: {
    segments: [
      {
        title: 'Sacred Spaces',
        textTemplate: 'You\'re standing in one of the most sacred places on Earth. {location} has been a center of spiritual pilgrimage for generations.',
        duration: 190,
      },
      {
        title: 'Spiritual Significance',
        textTemplate: 'The architectural elements around you tell stories of faith, devotion, and the human quest for the divine at {location}.',
        duration: 170,
      },
    ],
  },
  architecture: {
    segments: [
      {
        title: 'Architectural Marvel',
        textTemplate: 'Marvel at the incredible architecture of {location}. Every stone, every arch tells a story of human ingenuity and artistic vision.',
        duration: 175,
      },
      {
        title: 'Engineering Wonder',
        textTemplate: 'The construction of {location} represents one of humanity\'s greatest architectural achievements, combining beauty with structural brilliance.',
        duration: 185,
      },
    ],
  },
  default: {
    segments: [
      {
        title: 'Welcome to Your Tour',
        textTemplate: 'Welcome to your personalized audio tour of {location}. Get ready to discover the fascinating stories behind this remarkable place.',
        duration: 120,
      },
      {
        title: 'Hidden Stories',
        textTemplate: 'As we explore {location} together, you\'ll uncover hidden stories and secrets that most visitors never learn about.',
        duration: 140,
      },
      {
        title: 'Cultural Impact',
        textTemplate: 'The influence of {location} extends far beyond its physical boundaries, shaping culture and inspiring people around the world.',
        duration: 160,
      },
    ],
  },
};

/**
 * Generates a mock tour based on user preferences
 * @param request - The tour request from the user
 * @returns Promise resolving to a generated tour
 */
export async function generateMockTour(request: TourRequestDTO): Promise<TourResponse> {
  console.log('🎭 MockTourGenerator: Starting tour generation for:', request.location);

  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 2000));

  // Select segments based on user interests
  const selectedSegments: TourSegment[] = [];
  const usedTemplates = new Set<string>();

  // Add segments based on user interests
  for (const interest of request.interests) {
    const template = TOUR_TEMPLATES[interest as keyof typeof TOUR_TEMPLATES];
    if (template && !usedTemplates.has(interest)) {
      // Add one segment from this interest category
      const segmentTemplate = template.segments[0]; // Use first segment for simplicity
      selectedSegments.push({
        title: segmentTemplate.title,
        text: segmentTemplate.textTemplate.replace(/{location}/g, request.location),
        audio_url: SAMPLE_AUDIO_URLS[selectedSegments.length % SAMPLE_AUDIO_URLS.length],
        duration: segmentTemplate.duration,
      });
      usedTemplates.add(interest);
    }
  }

  // If no interests selected or need more segments, add default segments
  if (selectedSegments.length === 0) {
    selectedSegments.push({
      title: TOUR_TEMPLATES.default.segments[0].title,
      text: TOUR_TEMPLATES.default.segments[0].textTemplate.replace(/{location}/g, request.location),
      audio_url: SAMPLE_AUDIO_URLS[0],
      duration: TOUR_TEMPLATES.default.segments[0].duration,
    });
  }

  // Add more segments to fill the requested duration
  const targetDuration = request.duration_minutes * 60; // Convert to seconds
  let currentDuration = selectedSegments.reduce((sum, segment) => sum + segment.duration, 0);

  // Add additional segments if needed to reach target duration
  const defaultSegments = TOUR_TEMPLATES.default.segments;
  let segmentIndex = 1;

  while (currentDuration < targetDuration - 60 && selectedSegments.length < 5) { // Max 5 segments
    const template = defaultSegments[segmentIndex % defaultSegments.length];
    selectedSegments.push({
      title: template.title,
      text: template.textTemplate.replace(/{location}/g, request.location),
      audio_url: SAMPLE_AUDIO_URLS[selectedSegments.length % SAMPLE_AUDIO_URLS.length],
      duration: template.duration,
    });
    currentDuration += template.duration;
    segmentIndex++;
  }

  // Add route guidance segment if requested
  if (request.include_directions) {
    selectedSegments.push({
      title: 'Navigation Guide',
      text: `Your tour of ${request.location} includes turn-by-turn directions to help you navigate between points of interest. Follow the audio cues to make the most of your visit.`,
      audio_url: SAMPLE_AUDIO_URLS[selectedSegments.length % SAMPLE_AUDIO_URLS.length],
      duration: 90,
    });
  }

  const tour: TourResponse = {
    title: `${request.location} Audio Tour`,
    location: request.location,
    duration_minutes: request.duration_minutes,
    segments: selectedSegments,
    interests: request.interests,
  };

  console.log('✅ MockTourGenerator: Tour generated successfully:', {
    title: tour.title,
    segments: tour.segments.length,
    totalDuration: tour.segments.reduce((sum, s) => sum + s.duration, 0),
  });

  return tour;
}

/**
 * Gets a preview of what a tour might contain without full generation
 * @param request - The tour request
 * @returns Quick preview of tour content
 */
export function getTourPreview(request: TourRequestDTO): {
  estimatedSegments: number;
  coverageAreas: string[];
  estimatedDuration: number;
} {
  const baseSegments = Math.max(1, request.interests.length);
  const additionalSegments = Math.ceil((request.duration_minutes * 60 - baseSegments * 180) / 180);
  const totalSegments = Math.min(5, baseSegments + Math.max(0, additionalSegments));

  return {
    estimatedSegments: totalSegments,
    coverageAreas: request.interests.length > 0 ? request.interests : ['general overview'],
    estimatedDuration: request.duration_minutes,
  };
} 