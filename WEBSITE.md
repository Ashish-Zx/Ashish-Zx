# Ashish Shah’s portfolio

This site uses Next.js (App Router), React, TypeScript, Zod, and Markdown. Fonts and the hero artwork are served locally.

## Run locally

Requires Node.js 22 or later.

```sh
npm ci
npm run dev
```

Open `http://localhost:3000`. The **Studio** link is in the site footer. Without a Studio password, you can create posts, preview Markdown, and import public GitHub repositories. This mode stores changes only in your current browser. **Export JSON** makes a portable copy. The two initial blog posts are labeled starter articles; edit or remove them before launch.

## Publish on a live site

1. Run the app on a Node.js host with HTTPS. Set `PORTFOLIO_ADMIN_PASSWORD` as a long, unique secret (at least 16 characters). For local development, copy `.env.example` to `.env.local` and set the value there.
2. Mount a persistent, writable volume and set `PORTFOLIO_DATA_FILE` to an absolute file path on it (for example, `/var/lib/portfolio/portfolio.json`). Locally it defaults to `data/portfolio.json`. If the file doesn't exist, the app starts with `data/seed.json`; to carry over edits from local preview, copy the exported file to the configured path. Keep backups of this file, especially if it contains unpublished drafts.
3. Run `npm ci && npm run build`, then `npm start`. Open `/studio` in a top-level browser tab and sign in with the configured password.

In Studio, choose **New post**, write in Markdown, and select **Publish on the public blog** when the post is ready. Leave that box unchecked to save a private draft or unpublish an existing article. To add a project, open **Projects**, paste a public GitHub URL or `owner/repository`, and choose **Import**. Review the fetched information, fill in anything missing, then save. Use **Feature on the homepage** to make it eligible for the homepage’s three project slots. You can also add projects manually if GitHub is rate-limited.

The JSON store is designed for a single Node instance and a single editor. Ephemeral serverless filesystems do not provide durable publishing; use a persistent volume or replace the store with a shared database before running multiple instances.

## Verify changes

```sh
npm test
npm run check
npm run build
```

If GitHub requests fail on a development network that installs its own trusted root CA, start Node with `NODE_OPTIONS=--use-system-ca` (or configure `NODE_EXTRA_CA_CERTS` with your network’s CA). Do not turn off TLS verification.
