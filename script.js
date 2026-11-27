// Wedding date: 28 November 2026, 08:00 Malawi time (CAT, UTC+2)
const weddingDate = new Date("2026-11-28T08:00:00+02:00");
const pad = value => String(value).padStart(2, "0");

function updateCountdown() {
  const now = new Date();
  let diff = weddingDate - now;
  if (diff <= 0) {
    document.getElementById("countdown").innerHTML = '<p class="eyebrow">TODAY WE CELEBRATE LOVE</p>';
    return;
  }
  const days = Math.floor(diff / 86400000);
  diff %= 86400000;
  const hours = Math.floor(diff / 3600000);
  diff %= 3600000;
  const minutes = Math.floor(diff / 60000);
  const seconds = Math.floor((diff % 60000) / 1000);
  document.getElementById("days").textContent = days;
  document.getElementById("hours").textContent = pad(hours);
  document.getElementById("minutes").textContent = pad(minutes);
  document.getElementById("seconds").textContent = pad(seconds);
}
updateCountdown();
setInterval(updateCountdown, 1000);

// Slideshow: automatically advances every 5 seconds; arrows and dots also work.
const slides = [...document.querySelectorAll(".slide")];
const dots = [...document.querySelectorAll(".dot")];
let currentSlide = 0;
let slideTimer;

function showSlide(index) {
  currentSlide = (index + slides.length) % slides.length;
  slides.forEach((slide, i) => slide.classList.toggle("active", i === currentSlide));
  dots.forEach((dot, i) => dot.classList.toggle("active", i === currentSlide));
}
function restartSlideshow() {
  clearInterval(slideTimer);
  slideTimer = setInterval(() => showSlide(currentSlide + 1), 5000);
}
document.querySelector(".prev").addEventListener("click", () => { showSlide(currentSlide - 1); restartSlideshow(); });
document.querySelector(".next").addEventListener("click", () => { showSlide(currentSlide + 1); restartSlideshow(); });
dots.forEach((dot, i) => dot.addEventListener("click", () => { showSlide(i); restartSlideshow(); }));
restartSlideshow();

// Share button uses the phone/browser's native share sheet when available.
document.getElementById("shareButton").addEventListener("click", async () => {
  const shareData = {
    title: "Alexander & Tamandani's Wedding",
    text: "Join us to celebrate the wedding of Alexander Makanjira and Tamandani Simbeye on 28 November 2026.",
    url: window.location.href
  };
  try {
    if (navigator.share) await navigator.share(shareData);
    else {
      await navigator.clipboard.writeText(shareData.url);
      alert("Invitation link copied. You can now share it with friends and family.");
    }
  } catch (error) {
    if (error.name !== "AbortError") alert("Please copy the page link from your browser and share it.");
  }
});


// Open the invitation only after a visitor chooses to enter.
const invitationGate = document.getElementById("invitationGate");
document.getElementById("openInvitation").addEventListener("click", () => {
  invitationGate.classList.add("is-open");
  document.body.classList.remove("gate-active");
  window.setTimeout(() => invitationGate.remove(), 900);
});

// Background music starts only after an explicit visitor action (browser policy).
const weddingMusic = document.getElementById("weddingMusic");
const musicToggle = document.getElementById("musicToggle");
musicToggle.addEventListener("click", async () => {
  if (weddingMusic.paused) {
    try {
      await weddingMusic.play();
      musicToggle.classList.add("is-playing");
      musicToggle.querySelector(".music-label").textContent = "PAUSE MUSIC";
      musicToggle.setAttribute("aria-label", "Pause background music");
    } catch (err) {
      alert("Please try playing the music again. Your browser may have blocked playback.");
    }
  } else {
    weddingMusic.pause();
    musicToggle.classList.remove("is-playing");
    musicToggle.querySelector(".music-label").textContent = "PLAY MUSIC";
    musicToggle.setAttribute("aria-label", "Play background music");
  }
});

// Guestbook demo: saved in this browser only. Use a backend for a shared public guestbook.
const guestbookForm = document.getElementById("guestbookForm");
const guestMessages = document.getElementById("guestMessages");
const guestbookStorageKey = "alexanderTamandaniGuestbookV1";
function readGuestMessages() {
  try { return JSON.parse(localStorage.getItem(guestbookStorageKey) || "[]"); }
  catch (_) { return []; }
}
function renderGuestMessages() {
  const entries = readGuestMessages();
  guestMessages.replaceChildren();
  if (!entries.length) {
    const empty = document.createElement("p");
    empty.className = "empty-wall";
    empty.textContent = "Be the first to leave a blessing.";
    guestMessages.appendChild(empty);
    return;
  }
  entries.slice().reverse().forEach(entry => {
    const article = document.createElement("article");
    article.className = "guest-message";
    const name = document.createElement("strong");
    name.textContent = entry.name;
    const message = document.createElement("p");
    message.textContent = entry.message;
    article.append(name, message);
    guestMessages.appendChild(article);
  });
}
guestbookForm.addEventListener("submit", event => {
  event.preventDefault();
  const name = document.getElementById("guestName").value.trim();
  const message = document.getElementById("guestMessage").value.trim();
  if (!name || !message) return;
  const entries = readGuestMessages();
  entries.push({name, message, createdAt: new Date().toISOString()});
  try {
    localStorage.setItem(guestbookStorageKey, JSON.stringify(entries.slice(-100)));
    renderGuestMessages();
    guestbookForm.reset();
    launchCelebration();
  } catch (_) {
    alert("This browser could not save the message. Please try another browser or device.");
  }
});
renderGuestMessages();

// Shared wedding photo gallery powered by Supabase Storage.
// Only the project's publishable/anon key belongs in this public website.
const guestPhotoInput = document.getElementById("guestPhotoInput");
const uploadPreview = document.getElementById("uploadPreview");
const sharedGallery = document.getElementById("sharedGallery");
const galleryUploadStatus = document.getElementById("galleryUploadStatus");
const galleryBucket = "wedding-gallery";
const maxPhotoBytes = 10 * 1024 * 1024;
const allowedPhotoTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
let weddingSupabase = null;

function setGalleryStatus(message, state = "info") {
  galleryUploadStatus.textContent = message;
  galleryUploadStatus.dataset.state = state;
}

function getSupabaseClient() {
  const config = window.WEDDING_SUPABASE_CONFIG || {};
  if (!config.url || !config.anonKey || config.url.includes("YOUR-PROJECT") || config.anonKey.includes("YOUR-SUPABASE")) return null;
  if (!window.supabase?.createClient) return null;
  if (!weddingSupabase) weddingSupabase = window.supabase.createClient(config.url, config.anonKey);
  return weddingSupabase;
}

function makePhotoCard(url, name) {
  const figure = document.createElement("figure");
  const link = document.createElement("a");
  const img = document.createElement("img");
  const caption = document.createElement("figcaption");
  link.href = url;
  link.target = "_blank";
  link.rel = "noopener noreferrer";
  img.src = url;
  img.alt = "A shared wedding memory";
  img.loading = "lazy";
  img.decoding = "async";
  caption.textContent = name || "A wedding memory";
  link.appendChild(img);
  figure.append(link, caption);
  return figure;
}

async function loadSharedWeddingPhotos() {
  const client = getSupabaseClient();
  if (!client) {
    sharedGallery.replaceChildren();
    const message = document.createElement("p");
    message.className = "empty-wall";
    message.textContent = "The shared gallery is ready to connect. Add your Supabase project details in supabase-config.js.";
    sharedGallery.appendChild(message);
    setGalleryStatus("Gallery setup required: add your Supabase URL and publishable key.", "warning");
    return;
  }
  const { data, error } = await client.storage.from(galleryBucket).list("uploads", {
    limit: 200, offset: 0, sortBy: { column: "created_at", order: "desc" }
  });
  if (error) {
    sharedGallery.replaceChildren();
    const message = document.createElement("p");
    message.className = "empty-wall";
    message.textContent = "We couldn't load the shared gallery. Please check the Supabase setup and try again.";
    sharedGallery.appendChild(message);
    setGalleryStatus(`Gallery could not load: ${error.message}`, "error");
    return;
  }
  sharedGallery.replaceChildren();
  const photos = (data || []).filter(item => item.name && !item.name.startsWith("."));
  if (!photos.length) {
    const message = document.createElement("p");
    message.className = "empty-wall";
    message.textContent = "No guest photos yet. Be the first to share a wedding memory!";
    sharedGallery.appendChild(message);
  } else {
    photos.forEach(item => {
      const { data: publicData } = client.storage.from(galleryBucket).getPublicUrl(`uploads/${item.name}`);
      sharedGallery.appendChild(makePhotoCard(publicData.publicUrl, item.name));
    });
  }
  setGalleryStatus(`${photos.length} shared ${photos.length === 1 ? "photo" : "photos"} in the wedding gallery. New uploads appear here automatically.`, "success");
}

guestPhotoInput.addEventListener("change", async () => {
  uploadPreview.replaceChildren();
  const files = [...guestPhotoInput.files];
  if (!files.length) return;
  const client = getSupabaseClient();
  if (!client) {
    setGalleryStatus("Uploads are not active yet. Add the Supabase project details first.", "warning");
    guestPhotoInput.value = "";
    return;
  }
  const validFiles = files.filter(file => {
    if (!allowedPhotoTypes.includes(file.type)) {
      setGalleryStatus(`${file.name}: unsupported image type. Use JPG, PNG, WEBP or GIF.`, "error");
      return false;
    }
    if (file.size > maxPhotoBytes) {
      setGalleryStatus(`${file.name}: larger than the 10 MB limit.`, "error");
      return false;
    }
    return true;
  });
  if (!validFiles.length) { guestPhotoInput.value = ""; return; }
  for (const file of validFiles) {
    const figure = document.createElement("figure");
    const img = document.createElement("img");
    const caption = document.createElement("figcaption");
    img.src = URL.createObjectURL(file);
    img.alt = "Photo selected for upload";
    caption.textContent = `Ready to upload: ${file.name}`;
    figure.append(img, caption);
    uploadPreview.appendChild(figure);
  }
  let uploaded = 0;
  for (const file of validFiles) {
    setGalleryStatus(`Uploading ${uploaded + 1} of ${validFiles.length}: ${file.name}`, "info");
    const extension = file.type === "image/jpeg" ? "jpg" : file.type.split("/")[1];
    const safeName = `${Date.now()}-${crypto.randomUUID()}.${extension}`;
    const { error } = await client.storage.from(galleryBucket).upload(`uploads/${safeName}`, file, {
      cacheControl: "3600", contentType: file.type, upsert: false
    });
    if (error) {
      setGalleryStatus(`Could not upload ${file.name}: ${error.message}. Please try again.`, "error");
      continue;
    }
    uploaded++;
  }
  guestPhotoInput.value = "";
  if (uploaded) {
    setGalleryStatus(`${uploaded} ${uploaded === 1 ? "photo" : "photos"} uploaded successfully and published to the shared gallery.`, "success");
    await loadSharedWeddingPhotos();
    launchCelebration();
  }
});

loadSharedWeddingPhotos();
window.setInterval(loadSharedWeddingPhotos, 60000);

// Small, short-lived champagne confetti celebration.
function launchCelebration() {
  const layer = document.getElementById("confettiLayer");
  layer.replaceChildren();
  for (let i = 0; i < 90; i++) {
    const piece = document.createElement("i");
    piece.className = "confetti-piece";
    piece.style.left = `${Math.random() * 100}%`;
    piece.style.animationDelay = `${Math.random() * 0.65}s`;
    piece.style.setProperty("--drift", `${(Math.random() - 0.5) * 220}px`);
    layer.appendChild(piece);
  }
  window.setTimeout(() => layer.replaceChildren(), 3800);
}
document.getElementById("celebrateButton").addEventListener("click", launchCelebration);
