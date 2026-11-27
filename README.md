# Alexander & Tamandani — Wedding Invitation

A static, mobile-friendly wedding invitation website for GitHub Pages.

## Files
- `index.html` — page content
- `style.css` — burgundy, cream, beige and olive-green styling
- `script.js` — countdown, slideshow and share button
- `images/photo1.jpg`, `images/photo2.jpg`, `images/photo3.jpg`, `images/photo4.jpg` — replace these with the couple's photographs

## Add the couple's photographs
1. Open the `images` folder.
2. Replace `photo1.jpg`, `photo2.jpg`, `photo3.jpg`, and `photo4.jpg` with the couple's photos.
3. Keep the exact filenames and `.jpg` extensions. The slideshow is portrait-shaped and displays the complete image without cutting off the edges. If your originals are PNG, convert them to JPG or update the image paths in `index.html`.

The site includes four photo slides until you add the real photographs.

## Publish using GitHub Pages
1. Create a new GitHub repository, for example `alexander-tamandani-wedding`.
2. Upload `index.html`, `style.css`, `script.js`, the `images` folder, and this README to the repository root.
3. In the repository, open **Settings → Pages**.
4. Under **Build and deployment**, choose **Deploy from a branch**.
5. Select **main** and **/(root)**, then click **Save**.
6. Wait a minute or two. GitHub will show your public website URL under Settings → Pages.

## Wedding details currently included
- Alexander Makanjira & Tamandani Simbeye
- Saturday, 28 November 2026
- Officiation: Christ Embassy Excel Centre, Area 49 near PLFM — 08:00 AM
- Reception: Elian and Evelyn Events Centre, Area 49 — 01:30 PM
- Reception directions: supplied Google Maps share link

All times use Malawi local time (CAT, UTC+2).

## Wedding highlights video
The wedding highlights video is integrated in its own cinematic section between the photo gallery and the countdown. The video is stored at `video/alexander-tamandani-highlights-github.mp4`; keep this folder and filename unchanged when publishing so the player can find it. Visitors can play, pause, and control playback using the built-in video controls.


## Premium interactive additions
- Opening invitation envelope: visitors select **Open Your Invitation** before viewing the site.
- Background music: an original, locally generated instrumental loop is included at `audio/original-wedding-instrumental.wav`. Visitors must tap the music control; browsers generally block autoplay.
- Wedding programme: currently lists the confirmed officiation (08:00 AM) and reception (01:30 PM). Additional timings are marked as to be announced rather than guessed.
- Guestbook: messages are saved in the visitor's browser using local storage. This is a front-end demonstration; messages are NOT shared with the couple or other visitors.
- Guest photo picker: selected images are previewed on the visitor's device only. They are NOT uploaded to the website.
- Celebration animations: a short confetti effect plays when visitors send a local guestbook wish or press the celebration button.

## Important: enabling shared guest submissions
This is a static GitHub Pages website. To receive guestbook messages and photos from all visitors, connect a backend such as Supabase or Firebase (including database rules, image storage, moderation and spam protection), or a trusted form/upload service. Do not publish private credentials in the HTML or JavaScript. The current guestbook and photo picker intentionally do not pretend to upload or share guest content.

## Music
The included instrumental is original audio created for this website. The player requires a visitor click because modern browsers restrict autoplay. Keep the `audio` folder and its filename unchanged when publishing.


## Permanent online guest photo uploads
See `SUPABASE_SETUP.md` for the full setup guide. Run `supabase-setup.sql` in your Supabase SQL Editor, then enter your Project URL and publishable/anon key in `supabase-config.js`. Guest uploads are public and displayed immediately. Never use a service_role/secret key in the website.
