document.addEventListener("DOMContentLoaded", () => {
  const $ = (id) => document.getElementById(id);

  const setText = (id, value) => {
    const el = $(id);
    if (el) el.textContent = value ?? "";
  };

  /* Theme */
  document.documentElement.style.setProperty("--primary", birthdayData.colors.primary);
  document.documentElement.style.setProperty("--secondary", birthdayData.colors.secondary);
  document.documentElement.style.setProperty("--background", birthdayData.colors.background);
  document.documentElement.style.setProperty("--text", birthdayData.colors.text);

  /* Opening */
  setText("openingSmallText", birthdayData.opening.smallText);
  setText("openingName", birthdayData.name);
  setText("openingDescription", birthdayData.opening.description);
  $("openGiftBtn").innerHTML = `${birthdayData.opening.buttonText} <span>→</span>`;

  /* Hero */
  setText("birthdayTitle", birthdayData.title);
  setText("birthdayName", birthdayData.name);
  setText("birthdaySubtitle", birthdayData.subtitle);
  setText("birthdayAge", birthdayData.age);
  document.title = `${birthdayData.name} — ${birthdayData.title} 🎂`;

  /* Section texts */
  setText("cakeLabel", birthdayData.sections.cakeLabel);
  setText("cakeTitle", birthdayData.sections.cakeTitle);
  setText("cakeDescription", birthdayData.sections.cakeDescription);
  setText("messagesLabel", birthdayData.sections.messagesLabel);
  setText("messagesTitle", birthdayData.sections.messagesTitle);
  setText("messagesDescription", birthdayData.sections.messagesDescription);
  setText("galleryLabel", birthdayData.sections.galleryLabel);
  setText("galleryTitle", birthdayData.sections.galleryTitle);
  setText("galleryDescription", birthdayData.sections.galleryDescription);
  setText("finalTitle", birthdayData.finalMessage.title);
  setText("finalMessage", birthdayData.finalMessage.text);
  setText("finalSignature", birthdayData.finalMessage.signature);

  /* Messages */
  const messagesContainer = $("messagesContainer");
  birthdayData.messages.forEach((item, index) => {
    const card = document.createElement("article");
    card.className = "message-card";
    card.style.transitionDelay = `${Math.min(index * 80, 500)}ms`;

    const name = document.createElement("div");
    name.className = "message-name";
    name.textContent = item.name || "Anonymous";

    const message = document.createElement("p");
    message.className = "message-text";
    message.textContent = item.message || "";

    card.append(name, message);
    messagesContainer.appendChild(card);
  });

  /* Gallery */
  const galleryContainer = $("galleryContainer");
  if (!birthdayData.photos.length) {
    galleryContainer.innerHTML = `<p style="color:rgba(255,255,255,.5);grid-column:1/-1;text-align:center">Add photos in data.js</p>`;
  } else {
    birthdayData.photos.forEach((src, index) => {
      const item = document.createElement("div");
      item.className = "gallery-item";
      item.style.transitionDelay = `${Math.min(index * 80, 500)}ms`;

      const img = document.createElement("img");
      img.src = src;
      img.alt = `Birthday memory ${index + 1}`;
      img.loading = "lazy";

      img.addEventListener("error", () => {
        item.classList.add("missing-photo");
        item.innerHTML = `<div style="height:100%;display:grid;place-items:center;color:rgba(255,255,255,.45);padding:20px;text-align:center">Photo not found<br><small>${src}</small></div>`;
      });

      item.addEventListener("click", () => {
        if (img.complete && img.naturalWidth) {
          $("lightboxImage").src = src;
          $("lightbox").classList.add("active");
        }
      });

      item.appendChild(img);
      galleryContainer.appendChild(item);
    });
  }

  /* Particles */
  const particles = $("particles");
  for (let i = 0; i < 45; i++) {
    const p = document.createElement("span");
    p.className = "particle";
    p.style.left = `${Math.random() * 100}%`;
    p.style.animationDuration = `${7 + Math.random() * 10}s`;
    p.style.animationDelay = `${Math.random() * 8}s`;
    p.style.opacity = `${0.25 + Math.random() * 0.7}`;
    particles.appendChild(p);
  }

  /* Confetti */
  function launchConfetti(count = 130) {
    const container = $("confettiContainer");
    const shapes = ["■", "●", "◆", "✦"];
    for (let i = 0; i < count; i++) {
      const piece = document.createElement("span");
      piece.className = "confetti";
      piece.textContent = shapes[Math.floor(Math.random() * shapes.length)];
      piece.style.left = `${Math.random() * 100}%`;
      piece.style.fontSize = `${8 + Math.random() * 10}px`;
      piece.style.color = [birthdayData.colors.primary, birthdayData.colors.secondary, "#FDE68A", "#93C5FD"][Math.floor(Math.random() * 4)];
      piece.style.animationDuration = `${2.5 + Math.random() * 3}s`;
      piece.style.animationDelay = `${Math.random() * .7}s`;
      container.appendChild(piece);
      setTimeout(() => piece.remove(), 6000);
    }
  }

  /* Opening */
  $("openGiftBtn").addEventListener("click", async () => {
    $("openingScreen").classList.add("hidden");
    $("mainContent").classList.add("visible");
    launchConfetti();

    if (birthdayData.music.enabled) {
      try {
        const audio = $("birthdayMusic");
        audio.src = birthdayData.music.file;
        await audio.play();
        $("musicButton").classList.add("playing");
      } catch (_) {
        /* Browser may reject playback or music file may be absent. */
      }
    }
  });

  /* Music */
  const audio = $("birthdayMusic");
  const musicButton = $("musicButton");

  musicButton.addEventListener("click", async () => {
    if (!birthdayData.music.enabled) return;

    if (!audio.src) audio.src = birthdayData.music.file;

    try {
      if (audio.paused) {
        await audio.play();
        musicButton.classList.add("playing");
        $("musicIcon").textContent = "🎵";
      } else {
        audio.pause();
        musicButton.classList.remove("playing");
        $("musicIcon").textContent = "🔇";
      }
    } catch (_) {
      alert("Add your MP3 file to assets/music.mp3 first.");
    }
  });

  if (!birthdayData.music.enabled) {
    musicButton.style.display = "none";
  }

  /* Wish */
  $("wishBtn").addEventListener("click", () => {
    document.querySelector(".cake-section").classList.add("wish-complete");
    launchConfetti(180);
    setTimeout(() => {
      document.querySelector(".cake-section").classList.remove("wish-complete");
    }, 1800);
  });

  /* Lightbox */
  $("closeLightbox").addEventListener("click", () => {
    $("lightbox").classList.remove("active");
    $("lightboxImage").src = "";
  });

  $("lightbox").addEventListener("click", (e) => {
    if (e.target === $("lightbox")) {
      $("lightbox").classList.remove("active");
      $("lightboxImage").src = "";
    }
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      $("lightbox").classList.remove("active");
      $("lightboxImage").src = "";
    }
  });

  /* Scroll reveal */
  const revealElements = document.querySelectorAll(".message-card, .gallery-item");

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  revealElements.forEach((el) => observer.observe(el));
});
