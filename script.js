// --------------------------------------------------------
// MOBILE NAVIGATION
// --------------------------------------------------------
const navToggle = document.querySelector(".nav-toggle");
const nav = document.querySelector("nav");
const body = document.querySelector("body");

navToggle.addEventListener("click", () => {
  nav.classList.toggle("nav--visible");
  body.classList.toggle("nav-open");
});

document.querySelectorAll("nav a").forEach((link) => {
  link.addEventListener("click", () => {
    nav.classList.remove("nav--visible");
    body.classList.remove("nav-open");
  });
});

// --------------------------------------------------------
// TYPEWRITER EFFECT
// --------------------------------------------------------
document.addEventListener("DOMContentLoaded", () => {
  const heroTitleEl = document.getElementById("hero-title");
  const heroSubtitleEl = document.getElementById("hero-subtitle");

  const titleText = "The Lost Echo Studio";
  const subtitleText = "The Sound of Refinement";
  const typingSpeed = 100;
  const pauseAfterAnimation = 2000;

  const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  async function typeLine(element, text) {
    element.classList.add("typing-cursor");
    for (const char of text) {
      element.textContent += char;
      await sleep(typingSpeed);
    }
    element.classList.remove("typing-cursor");
  }

  async function typewriterLoop() {
    while (true) {
      heroTitleEl.textContent = "";
      heroSubtitleEl.textContent = "";

      await typeLine(heroTitleEl, titleText);
      await sleep(typingSpeed / 2);
      await typeLine(heroSubtitleEl, subtitleText);

      heroSubtitleEl.classList.add("typing-cursor");
      await sleep(pauseAfterAnimation);
      heroSubtitleEl.classList.remove("typing-cursor");
      heroTitleEl.textContent = "";
      heroSubtitleEl.textContent = "";
    }
  }

  typewriterLoop();
});

// --------------------------------------------------------
// SLIDERS (Testimonials + Tribe) – OPTIMIZED
// --------------------------------------------------------
function initializeSlider(
  sliderSelector,
  gridSelector,
  prevSelector,
  nextSelector,
  itemSelector
) {
  const slider = document.querySelector(sliderSelector);
  if (!slider) return;

  const grid = slider.querySelector(gridSelector);
  const prevButton = slider.querySelector(prevSelector);
  const nextButton = slider.querySelector(nextSelector);
  let items = Array.from(grid.querySelectorAll(itemSelector));

  if (items.length <= 1) {
    if (prevButton) prevButton.style.display = "none";
    if (nextButton) nextButton.style.display = "none";
    return;
  }

  let currentIndex = 1;
  let isTransitioning = false;

  // Clone first & last for infinite loop
  const firstClone = items[0].cloneNode(true);
  const lastClone = items[items.length - 1].cloneNode(true);
  firstClone.id = "first-clone";
  lastClone.id = "last-clone";

  grid.append(firstClone);
  grid.prepend(lastClone);

  items = Array.from(grid.querySelectorAll(itemSelector));

  function updatePosition(instant = false) {
    if (instant) grid.style.transition = "none";
    else grid.style.transition = "transform 0.6s ease";

    const selected = items[currentIndex];
    const itemLeft = selected.offsetLeft;
    const gridPaddingLeft = parseFloat(window.getComputedStyle(grid).paddingLeft); // Get computed padding-left

    // Calculate offset to bring the selected item to the start of the visible area,
    // accounting for the grid's left padding.
    const offset = itemLeft - gridPaddingLeft;

    grid.style.transform = `translateX(-${offset}px)`;

    items.forEach((item) => item.classList.remove("active"));
    selected.classList.add("active");

    if (instant) {
      setTimeout(() => (grid.style.transition = "transform 0.6s ease"), 50);
    }
  }

  grid.addEventListener("transitionend", () => {
    if (items[currentIndex].id === "last-clone") {
      currentIndex = items.length - 2;
      updatePosition(true);
    } else if (items[currentIndex].id === "first-clone") {
      currentIndex = 1;
      updatePosition(true);
    }
  });

  if (nextButton) {
    nextButton.addEventListener("click", () => {
      if (isTransitioning) return;
      currentIndex++;
      updatePosition();
    });
    nextButton.addEventListener("touchstart", (e) => {
      e.preventDefault();
      if (isTransitioning) return;
      currentIndex++;
      updatePosition();
    });
  }

  if (prevButton) {
    prevButton.addEventListener("click", () => {
      if (isTransitioning) return;
      currentIndex--;
      updatePosition();
    });
    prevButton.addEventListener("touchstart", (e) => {
      e.preventDefault();
      if (isTransitioning) return;
      currentIndex--;
      updatePosition();
    });
  }

  // Swipe gesture support for mobile
  let startX = 0;
  let startY = 0;
  let endX = 0;
  let endY = 0;

  // slider.addEventListener("touchstart", (e) => {
  //   startX = e.touches[0].clientX;
  //   startY = e.touches[0].clientY;
  // });

  // slider.addEventListener("touchmove", (e) => {
  //   endX = e.touches[0].clientX;
  //   endY = e.touches[0].clientY;
  // });

  // slider.addEventListener("touchend", () => {
  //   const diffX = startX - endX;
  //   const diffY = startY - endY;
  //   const threshold = 50; // Minimum swipe distance

  //   if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > threshold) {
  //     if (diffX > 0) {
  //       // Swipe left - next
  //       if (isTransitioning) return;
  //       currentIndex++;
  //       updatePosition();
  //     } else {
  //       // Swipe right - prev
  //       if (isTransitioning) return;
  //       currentIndex--;
  //       updatePosition();
  //     }
  //   }
  // });

  window.addEventListener("resize", () => updatePosition(true));

  // After initial positioning, reveal the grid to avoid transient overflow.
  // Keep the grid in the layout (so measurement works) but hidden via CSS
  // (`opacity: 0`) until we calculate positions — then fade it in.
  setTimeout(() => {
    updatePosition(true);
    if (grid && grid.style) {
      grid.style.transition =
        (grid.style.transition || "") + ", opacity 0.35s ease";
      grid.style.opacity = "1";
      grid.style.pointerEvents = "auto";
    }
  }, 200);
}

// Initialize Sliders
initializeSlider(
  ".testimonial-slider",
  ".testimonial-grid",
  ".testimonial-arrow.prev",
  ".testimonial-arrow.next",
  ".testimonial-card"
);
initializeSlider(
  ".tribe-slider",
  ".tribe-grid",
  ".tribe-arrow.prev",
  ".tribe-arrow.next",
  ".tribe-card"
);

// --------------------------------------------------------
// VIDEO POPUP LOGIC
// --------------------------------------------------------
const popupOverlay = document.getElementById("video-popup-overlay");
const popupVideoPlayer = document.getElementById("popup-video-player");
const closePopupBtn = document.getElementById("close-popup-btn");

document
  .querySelectorAll(".tribe-thumbnail[data-video-id]")
  .forEach((thumb) => {
    thumb.addEventListener("click", () => {
      const videoId = thumb.dataset.videoId;
      popupOverlay.classList.add("visible");
      document.body.style.overflow = "hidden";

      setTimeout(() => {
        popupVideoPlayer.src = `https://drive.google.com/file/d/${videoId}/preview`;
      }, 300);
    });
  });

function closePopup() {
  popupOverlay.classList.remove("visible");
  popupVideoPlayer.src = "";
  document.body.style.overflow = "";
}

closePopupBtn.addEventListener("click", closePopup);
popupOverlay.addEventListener("click", (e) => {
  if (e.target === popupOverlay) closePopup();
});

// --------------------------------------------------------
// READ-MORE TOGGLE (Optimized)
// --------------------------------------------------------
document.querySelectorAll(".read-more").forEach((button) => {
  const content = button.parentElement.querySelector("blockquote");
  const preview = content.querySelector(".preview-text");
  const full = content.querySelector(".full-text");

  const maxLength = 200;

  if (full.textContent.length > maxLength) {
    preview.textContent = full.textContent.substring(0, maxLength) + "...";
  } else {
    preview.textContent = full.textContent;
    full.style.display = "none";
    button.style.display = "none";
  }

  button.addEventListener("click", () => {
    const expanded = button.dataset.expanded === "true";

    if (expanded) {
      preview.style.display = "block";
      full.style.display = "none";
      button.textContent = "Read More";
      button.dataset.expanded = "false";
    } else {
      preview.style.display = "none";
      full.style.display = "block";
      button.textContent = "Read Less";
      button.dataset.expanded = "true";
    }
  });
});

// --------------------------------------------------------
// GLOBAL FADE-UP ON SCROLL
// --------------------------------------------------------
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) entry.target.classList.add("visible");
    });
  },
  { threshold: 0.2 }
);

document
  .querySelectorAll("section, .feature-card, .testimonial-card")
  .forEach((el) => {
    el.classList.add("fade-up"); // Re-enabling fade-up class
    observer.observe(el);
  });

// --------------------------------------------------------
// PARALLAX SPOTLIGHT EFFECT FOR BIG IMAGE
// --------------------------------------------------------
document.addEventListener("mousemove", (e) => {
  const photos = document.querySelectorAll(".emphasized-photo");

  photos.forEach((photo) => {
    const speed = 25;
    const x = (window.innerWidth / 2 - e.clientX) / speed;
    const y = (window.innerHeight / 2 - e.clientY) / speed;
    photo.style.transform = `translate(${x}px, ${y}px) scale(1.06)`;
  });
});

document.addEventListener("mouseleave", () => {
  document.querySelectorAll(".emphasized-photo").forEach((photo) => {
    photo.style.transform = "translate(0,0) scale(1.02)";
  });
});

// --------------------------------------------------------
// HEADER SCROLL FADE
// --------------------------------------------------------
let lastScroll = 0;
const header = document.querySelector("header");

window.addEventListener("scroll", () => {
  const scrolled = window.pageYOffset;

  if (scrolled > lastScroll) header.style.opacity = "0.65";
  else header.style.opacity = "1";

  lastScroll = scrolled;
});
