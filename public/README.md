# Public Directory

This directory contains static assets that are served from the root URL path (`/`) of the application.

## What Goes Here

Place any static files that should be publicly accessible:

- **SEO files**: `robots.txt`, `sitemap.xml`
- **Icons**: `favicon.ico`, `apple-touch-icon.png`
- **Images**: Product images, logos, backgrounds
- **Fonts**: Custom web fonts
- **Other**: `manifest.json`, verification files

## How It Works

Files in this directory are served at the root path. For example:
- `public/robots.txt` → accessible at `/robots.txt`
- `public/images/logo.png` → accessible at `/images/logo.png`

## Important Notes

- Do NOT name files with underscores at the start (e.g., `_file.txt`)
- Do NOT create a `public/static` directory (use just `public/`)
- Assets are served as-is without processing

For more information, see [Next.js Static File Serving](https://nextjs.org/docs/app/building-your-application/optimizing/static-assets).
