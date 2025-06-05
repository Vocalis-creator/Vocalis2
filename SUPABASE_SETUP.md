# Supabase Setup Guide for Vocalis

This guide will help you set up Supabase authentication and database for the Vocalis project.

## 📋 Prerequisites

- A Supabase account (free tier is sufficient)
- Node.js and npm installed
- The Vocalis React Native project

## 🚀 Step 1: Create Supabase Project

1. Go to [https://supabase.com](https://supabase.com)
2. Sign in or create a new account
3. Click "New Project"
4. Choose your organization
5. Enter project details:
   - **Name**: `vocalis` (or your preferred name)
   - **Database Password**: Create a strong password (save this!)
   - **Region**: Choose closest to your location
6. Click "Create new project"
7. Wait for the project to be created (1-2 minutes)

## 🔑 Step 2: Get API Keys

1. In your Supabase dashboard, go to **Settings** → **API**
2. Copy the following values:
   - **Project URL** (looks like: `https://your-project-id.supabase.co`)
   - **Public anon key** (starts with `eyJ...`)

## 📝 Step 3: Configure Environment Variables

1. In your Vocalis project root, create a `.env` file:

```bash
# Copy from .env.example and fill in your actual values
EXPO_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

2. The app will use these environment variables through `app.config.js`

## 🗄️ Step 4: Set Up Database Schema

1. In your Supabase dashboard, go to **SQL Editor**
2. Click "New query"
3. Copy the entire contents of `supabase-schema.sql` from this project
4. Paste it into the SQL editor
5. Click "Run" to execute the schema
6. Verify tables are created by going to **Table Editor**

You should see these tables:
- `users` - User profiles and preferences
- `tours` - Generated tour data
- `tour_segments` - Individual tour segments (for future use)

## 🔐 Step 5: Configure Authentication

1. In Supabase dashboard, go to **Authentication** → **Settings**
2. Under **Site URL**, add your development URL:
   - For Expo Dev Client: `exp://localhost:8081` (or your actual IP)
   - For production: your actual app URL
3. Under **Redirect URLs**, add the same URLs
4. **Email confirmation**: 
   - For development: Disable "Confirm email" for easier testing
   - For production: Keep enabled for security

## 🧪 Step 6: Test Authentication

1. Start your Expo dev server: `npm run ios` or `npm run android`
2. Navigate to the Profile screen
3. Try signing up with a test email and password
4. Check the Supabase dashboard under **Authentication** → **Users** to see if the user was created
5. Check **Table Editor** → **users** to see if the profile was automatically created

## 🔧 Step 7: Verify Database Policies

The schema includes Row Level Security (RLS) policies that ensure:
- Users can only see their own data
- Automatic user profile creation on signup
- Proper data isolation between users

Test this by:
1. Creating multiple users
2. Ensuring each user only sees their own tours and data

## 🐛 Troubleshooting

### Common Issues:

1. **"Missing Supabase configuration" error**
   - Check that `.env` file exists and has correct values
   - Restart Expo dev server after adding environment variables

2. **Authentication not working**
   - Verify Site URL and Redirect URLs in Supabase dashboard
   - Check console for detailed error messages

3. **Database permission errors**
   - Ensure RLS policies were created correctly
   - Check SQL Editor for any schema errors

4. **User profile not created automatically**
   - Verify the `handle_new_user()` function and trigger were created
   - Check Supabase logs for any trigger errors

### Debug Commands:

```bash
# Check if environment variables are loaded
npx expo config --type introspect

# View detailed auth errors
# Enable debug mode in services/auth.ts by uncommenting console.log statements
```

## 📱 Development vs Production

### Development:
- Use `.env` file for configuration
- Disable email confirmation for easier testing
- Use localhost URLs for redirects

### Production:
- Use secure environment variable management
- Enable all security features
- Update redirect URLs to production domains

## 🔄 Next Steps

After completing this setup:
1. Test user registration and login
2. Test guest mode functionality
3. Verify tour data is saved to the database
4. Implement user interests saving
5. Add tour history functionality

## 📞 Support

If you encounter issues:
1. Check the Supabase documentation: [https://supabase.com/docs](https://supabase.com/docs)
2. Review the error logs in both Expo and Supabase dashboard
3. Ensure all dependencies are installed correctly

## 🎯 Success Checklist

- [ ] Supabase project created
- [ ] Environment variables configured
- [ ] Database schema applied
- [ ] Authentication settings configured
- [ ] User signup/login working
- [ ] Guest mode working
- [ ] User profiles created automatically
- [ ] Data isolation working (RLS policies)

Once all items are checked, Phase 3 Supabase integration is complete! 🎉 