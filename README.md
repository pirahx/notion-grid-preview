# Notion Grid Preview Widget

An Instagram-style image gallery widget that displays images from your Notion database. Perfect for embedding as a dashboard or widget on your Notion board.

## Features

✨ **Gallery Features:**
- 📸 Instagram-style 3×5 grid layout
- 📌 Pin images to keep favorites at the top
- 🔄 Refresh button to reload images
- 🖼️ Click-to-enlarge lightbox preview
- 🌙 Dark mode support
- ⚡ Fast image loading with Next.js optimization

## Setup

### Prerequisites
- Node.js 18+ installed
- Notion API token
- Notion database with images/files

### Step 1: Get Notion Credentials

1. **Create a Notion Integration:**
   - Go to [Notion Integrations](https://www.notion.so/my-integrations)
   - Click "Create new integration"
   - Name it "Image Gallery Widget"
   - Copy your **Internal Integration Token**

2. **Get your Database ID:**
   - Open your Notion database
   - Copy the ID from the URL: `https://notion.so/{DATABASE_ID}?v=...`

3. **Share database with integration:**
   - Open your database
   - Click "Share" → Find your integration → Grant access

### Step 2: Clone & Setup

```bash
git clone https://github.com/pirahx/notion-grid-preview.git
cd notion-grid-preview
npm install
```

### Step 3: Configure Environment Variables

Create a `.env.local` file:

```env
NOTION_API_TOKEN=ntn_xxxxxxxxxxxxxxxxxxxx
NOTION_DATABASE_ID=xxxxxxxxxxxxxxxxxxxxx
```

### Step 4: Run Locally

```bash
npm run dev
```

Visit `http://localhost:3000`

### Step 5: Deploy to Vercel (Recommended)

1. Push code to GitHub (done!)
2. Go to [Vercel](https://vercel.com)
3. Click "New Project" → Import your GitHub repo
4. Add environment variables in Settings
5. Deploy! 🚀

**Your public URL:** `https://notion-grid-preview-xxxxx.vercel.app`

## Embed on Notion

### Option 1: Embed Block (Easiest)
1. Open your Notion page
2. Type `/embed` and create an Embed block
3. Paste your Vercel URL
4. Done!

### Option 2: Web Clipper
- Use Notion Web Clipper to save the widget

## How It Works

1. **Fetch Images:** The app queries your Notion database for all pages with file properties
2. **Display Grid:** Shows up to 15 images (3×5) in a beautiful grid
3. **Pin Feature:** Click the pin icon to keep favorite images at the top
4. **Lightbox:** Click any image to view full-size with metadata
5. **Refresh:** Click the Refresh button to reload from Notion

## Notion Database Requirements

Your Notion database should have:
- A **Files** property where you upload images to tasks
- Optional: A **Name** property for image titles

### Example Database Schema:
| Name | Files | Date |
|------|-------|------|
| Panda Photo | [image] | June 8 |
| City View | [image] | June 7 |

## API Route

- `GET /api/images` - Returns array of images from Notion database
  ```json
  [
    {
      "id": "page-id-filename",
      "src": "https://...",
      "alt": "filename",
      "title": "Page Name",
      "date": "2024-06-08T..."
    }
  ]
  ```

## Technologies

- **Next.js 16** - React framework with API routes
- **Tailwind CSS** - Utility-first CSS framework
- **Notion API** - Database integration
- **TypeScript** - Type safety

## Troubleshooting

### Images not loading?
- ✅ Check Notion token is valid
- ✅ Verify database ID is correct
- ✅ Ensure integration has database access
- ✅ Check environment variables in `.env.local`

### "Unconfigured hostname" error?
- This is already handled in `next.config.ts`
- Allows AWS S3 domains from Notion

### Pin state not persisting?
- Pins are saved in browser localStorage
- Clear localStorage if having issues: `localStorage.clear()`

## License

MIT

## Contributing

Feel free to fork and improve!

---

Made with ❤️ for Notion power users
