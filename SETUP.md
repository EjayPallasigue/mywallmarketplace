# Setup Guide

## Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
```

## Getting Your Supabase Credentials

1. Go to [supabase.com](https://supabase.com) and create a new project
2. Once your project is ready, go to **Settings** → **API**
3. Copy the **Project URL** and **anon public** key
4. Paste them into your `.env.local` file

## Database Setup

Your database is already configured! The schema includes:
- `listings` table with location support
- `messages` table for buyer-seller communication
- Storage bucket for listing images
- Optimized indexes and RLS policies

## Running the Application

```bash
npm run dev
```

The application will be available at [http://localhost:3000](http://localhost:3000)

## Next Steps

1. Create your first listing by clicking "Create New Listing"
2. Test the search and filter functionality
3. Try messaging a seller from a listing detail page
4. Customize categories and styling as needed
