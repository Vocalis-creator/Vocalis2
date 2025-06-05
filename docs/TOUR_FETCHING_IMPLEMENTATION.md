# Tour Fetching Implementation

## Overview

This document describes the implementation of tour fetching functionality in Phase 3 of the Vocalis project. The system allows users to view their previously created tours from the Supabase database.

## Architecture

### Core Components

1. **`fetchUserTours()` Function** (`services/tourService.ts`)
   - Fetches tours from Supabase database for a specific user
   - Handles both JSONB segments and separate tour_segments table
   - Transforms database records into `TourResponse` objects

2. **Updated HomeScreen** (`screens/HomeScreen.tsx`)
   - Displays user's tours in a dedicated section
   - Handles loading states and error scenarios
   - Shows tour count and provides navigation to tour player

3. **Updated Types** (`types/tour.ts`)
   - Updated `TourSegment` interface to match database schema
   - Changed `text` → `content`, `duration` → `duration_seconds`
   - Added `order_index` field

## Database Schema

### Tours Table
```sql
tours {
  id: string (UUID)
  user_id: string (foreign key)
  title: string
  location: string
  duration_minutes: number
  interests: string (comma-separated text)
  segments: TourSegmentData[] | null (JSONB array)
  created_at: string
}
```

### Tour Segments Table (Fallback)
```sql
tour_segments {
  id: string (UUID)
  tour_id: string (foreign key)
  title: string
  content: string
  audio_url: string
  duration_seconds: number
  order_index: number
  created_at: string
}
```

## Implementation Details

### 1. fetchUserTours Function

```typescript
export async function fetchUserTours(userId: string): Promise<TourResponse[]>
```

**Features:**
- Fetches tours sorted by creation date (newest first)
- Handles both JSONB segments and separate tour_segments table
- Parses comma-separated interests into arrays
- Robust error handling and logging
- Returns empty array if no tours found

**Data Flow:**
1. Query tours table for user's tours
2. For each tour, check if segments exist in JSONB field
3. If not, fetch from tour_segments table as fallback
4. Transform database records into TourResponse format
5. Parse interests from text to array

### 2. HomeScreen Integration

**New Features:**
- **User Tours Section**: Shows authenticated user's tours
- **Loading State**: Activity indicator while fetching
- **Error Handling**: Retry button for failed requests
- **Empty State**: Friendly message when no tours exist
- **Tour Count**: Shows number of tours in header

**UI Components:**
- Tour list with title, location, duration, and interests
- Tap to play functionality
- Visual indicators for tour details
- Scrollable list with max height

### 3. Type Updates

Updated `TourSegment` interface:
```typescript
interface TourSegment {
  title: string;
  content: string;        // Changed from 'text'
  audio_url: string;
  duration_seconds: number; // Changed from 'duration'
  order_index: number;     // Added
}
```

## Error Handling

### Network Errors
- Displays error message with retry option
- Logs detailed error information for debugging
- Graceful fallback for missing segments

### Authentication
- Only shows tour section for authenticated users
- Handles guest users appropriately
- No data fetching for unauthenticated states

### Database Errors
- Continues with empty segments if segment fetch fails
- Validates data structure before processing
- Comprehensive error logging

## Testing

### Manual Testing Scenarios

1. **Authenticated User with Tours**
   - Log in as authenticated user
   - Verify tours are displayed
   - Check tour details and navigation

2. **Authenticated User without Tours**
   - Log in as new user
   - Verify empty state is shown
   - Check "Start a Tour" button works

3. **Guest User**
   - Use guest mode
   - Verify tours section is hidden
   - Check only sample tours are shown

4. **Network Error Handling**
   - Disconnect network during tour fetch
   - Verify error message and retry button
   - Reconnect and test retry functionality

### Sample Data

Use the `scripts/add-sample-tours.ts` script to add test data:

```bash
# Update user_id in script to match test user
npx ts-node scripts/add-sample-tours.ts
```

## Performance Considerations

### Database Queries
- Single query to fetch tours with segments
- Fallback query only when JSONB segments are missing
- Indexed queries for optimal performance

### UI Optimization
- Lazy loading of tour details
- Efficient re-rendering with proper keys
- Minimal state updates during loading

## Future Enhancements

1. **Pagination**: For users with many tours
2. **Search/Filter**: By location, interests, or date
3. **Sort Options**: By date, duration, or alphabetical
4. **Tour Categories**: Group tours by type or location
5. **Offline Caching**: Store tours locally for offline access

## Dependencies

- `@supabase/supabase-js`: Database operations
- `@react-native-async-storage/async-storage`: Session persistence
- `@expo/vector-icons`: UI icons
- React Navigation: Screen navigation
- React Native: Core mobile functionality

## Related Files

- `services/tourService.ts`: Core fetching logic
- `services/supabase.ts`: Database configuration
- `screens/HomeScreen.tsx`: UI implementation
- `types/tour.ts`: Type definitions
- `contexts/AuthContext.tsx`: Authentication state
- `scripts/add-sample-tours.ts`: Test data utility 