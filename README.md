# Winnie's Flowers

A Vite + React website for Winnie's Flowers in Bulawayo, featuring bouquet categories, priced ready packages, a floral gallery, and WhatsApp ordering.

## Run Locally

**Prerequisites:** Node.js

1. Install dependencies:
   `npm install`
2. Run the app:
   `npm run dev`

## Updating Packages

The public package list lives in `public/packages.json`.

1. Open the site and log in to the Admin panel.
2. Add, edit, delete, or reorder packages there.
3. Click **Export packages.json**.
4. Replace `public/packages.json` with the exported file before deploying.

The browser also keeps a local draft copy so edits survive refreshes on the same device. The exported `packages.json` is the deployable source of truth.
