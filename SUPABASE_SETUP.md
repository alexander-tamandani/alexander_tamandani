# Permanent online wedding photo gallery (Supabase)

Anyone with the wedding website link can upload photos without an account. Uploads are saved in Supabase Storage and appear in the shared gallery for all visitors immediately.

## 1. Create a Supabase project
1. Visit https://supabase.com/ and create a project.
2. Name it (for example) `alexander-tamandani-wedding` and set a strong database password.
3. Wait for provisioning to finish.

## 2. Create the storage bucket and permissions
1. Open the project dashboard and go to **SQL Editor**.
2. Open `supabase-setup.sql` from this package, copy all its contents into a new SQL query and click **Run**.
3. In **Storage**, confirm the `wedding-gallery` bucket exists and is public.

The SQL limits files to 10 MB and image/jpeg, image/png, image/webp or image/gif. Anonymous visitors can list and upload only within `uploads/`. There is no public delete or replace permission. Public bucket images are visible to anyone who has their URL; this matches the requested immediate-publication setting.

## 3. Add your public Supabase credentials
1. In Supabase, open **Project Settings → API** (dashboard wording may vary).
2. Copy the **Project URL** and the **publishable key** (or legacy public `anon` key).
3. Open `supabase-config.js` in the website folder and replace the placeholders:

```js
window.WEDDING_SUPABASE_CONFIG = {
  url: "https://YOUR-PROJECT-REF.supabase.co",
  anonKey: "YOUR-SUPABASE-PUBLISHABLE-OR-ANON-KEY"
};
```

Save the file. **Never put a `service_role` or secret key in the website.** The browser key is public; the Storage policies are what limit its permissions.

## 4. Publish the updated website
Upload the complete contents of the `alexander-tamandani-wedding` folder to your hosting provider, preserving the folder structure. For GitHub Pages, commit and push the folder contents to the repository/branch used by Pages. Keep `supabase-config.js` beside `index.html`, `script.js` and `style.css`.

If the website is already hosted, replace the old website files with these updated files. Existing photos, video, music, invitation, map and programme are retained.

## 5. Test
1. Open the published site over HTTPS.
2. Scroll to **Share your moments** and select one or more supported image files (up to 10 MB each).
3. Wait for the success message and confirm the photo appears under **Shared Wedding Gallery**.
4. Open the site on another phone/browser; the same uploaded photo should appear there as well.

## Important
- Internet access is required for cloud uploads and gallery display.
- There is no login or approval queue: anyone with the link can upload and photos publish immediately.
- The gallery refreshes after uploads and every 60 seconds. It currently displays the newest 200 uploads.
- Until you add your own Supabase URL and publishable key, the page displays a setup reminder and does not upload.
- Anonymous public uploads can be abused by anyone who obtains the link. The package enforces image MIME types and a 10 MB bucket limit, and public visitors cannot delete or replace files. Monitor Supabase Storage usage. For stronger spam/abuse protection, add CAPTCHA and a server-side rate-limited upload function before widely distributing the link.
- Supabase quotas and pricing may change; check the current limits shown in your project dashboard.
