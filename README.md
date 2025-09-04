# MyWall Marketplace

A modern marketplace application built with **React + Next.js** and **Supabase** for local buying and selling.

## 🚀 Features

- **📝 Create Listing** – Upload photos and enter item details (title, description, price, email, category)
- **🔍 Browse & Search** – View listings in a responsive grid with category filtering and search
- **📄 Listing Details** – Detailed view of each item with full information
- **💬 Message Seller** – Contact sellers directly through the platform

## 🛠️ Tech Stack

- **Frontend**: React 19 + Next.js 15 + TypeScript + Tailwind CSS
- **Backend**: Supabase (PostgreSQL + Storage + Real-time)
- **Deployment**: Vercel (recommended)

## 📋 Prerequisites

- Node.js 18+ 
- A Supabase account ([sign up here](https://supabase.com))

## 🚀 Quick Start

### 1. Clone and Install

```bash
git clone <your-repo-url>
cd mywallmarketplace
npm install
```

### 2. Set up Supabase

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to **Settings** → **API** to get your project URL and anon key
3. Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 3. Database Already Set Up

The database schema is already configured in your Supabase project with the following tables:
- `listings` - Stores marketplace listings with seller info and location
- `messages` - Handles buyer-seller communication
- Storage bucket for listing images with proper policies

### 4. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see your marketplace!

## 📁 Project Structure

```
src/
├── app/                    # Next.js app router pages
│   ├── create/            # Create listing page
│   ├── listing/[id]/      # Individual listing detail page
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page (browse listings)
├── components/            # Reusable components
│   └── Header.tsx         # Navigation header
└── lib/
    ├── supabase.ts        # Supabase client and types
    └── database.sql       # Database schema
```

## 🎨 Features Overview

### Browse Listings
- Responsive grid layout
- Category filtering (Electronics, Furniture, Clothing, Books, Sports, Other)
- Real-time search by title and description
- Price formatting and category badges

### Create Listing
- Image upload with preview
- Form validation
- Category selection
- Contact email for buyer communication

### Listing Details
- Full-size image display
- Complete item information
- Message seller functionality
- Responsive design

### Message System
- Contact form for buyers
- Message storage in Supabase
- Email notifications (ready for integration)

## 🔧 Customization

### Categories
Edit the `CATEGORIES` array in `src/app/page.tsx` and `src/app/create/page.tsx` to add or modify categories.

### Styling
The app uses Tailwind CSS. Modify `src/app/globals.css` for custom styles.

### Database Schema
The database is already set up with optimized tables, indexes, and RLS policies. The schema includes:
- Listings with location support
- Message system for buyer-seller communication  
- Image storage with proper access policies
- Performance indexes and automatic timestamp updates

## 🚀 Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Connect your repository to [Vercel](https://vercel.com)
3. Add your environment variables in Vercel's dashboard
4. Deploy!

### Environment Variables for Production

Make sure to set these in your deployment platform:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

## 📝 License

MIT License - feel free to use this project for your own marketplace!

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📞 Support

If you have any questions or need help setting up the project, please open an issue on GitHub.
