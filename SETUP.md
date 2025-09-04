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
- Optimized indexes and RLS policies

## Storage Setup (Required for Photo Uploads)

To enable photo uploads, you need to create a storage bucket in Supabase:

1. Go to your Supabase project dashboard
2. Navigate to **Storage** in the left sidebar
3. Click **Create a new bucket**
4. Name it: `listing-images`
5. Make it **Public** (so images can be viewed by everyone)
6. Click **Create bucket**

### Storage Policies

After creating the bucket, you need to set up policies:

1. Go to **Storage** → **Policies** → **listing-images**
2. Click **New Policy**
3. Create an **INSERT** policy:
   - Policy name: `Allow public uploads`
   - Policy definition: `true`
   - This allows anyone to upload images
4. Create a **SELECT** policy:
   - Policy name: `Allow public access`
   - Policy definition: `true`
   - This allows anyone to view images

## Running the Application

```bash
npm run dev
```

The application will be available at [http://localhost:3000](http://localhost:3000)

## Vercel Deployment

To deploy to Vercel:

1. **Set up Supabase Storage first** (see Storage Setup section above)
2. Push your code to GitHub
3. Connect your repository to Vercel
4. In Vercel dashboard, go to **Settings** → **Environment Variables**
5. Add the following environment variables:
   - `NEXT_PUBLIC_SUPABASE_URL` = your_supabase_project_url_here
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` = your_supabase_anon_key_here
6. Redeploy your application

**Important**: 
- Make sure to add these environment variables in Vercel before deploying, otherwise the build will fail
- Make sure to set up the `listing-images` storage bucket in Supabase for photo uploads to work

## Next Steps

1. Create your first listing by clicking "Create New Listing"
2. Test the search and filter functionality
3. Try messaging a seller from a listing detail page
4. Customize categories and styling as needed
