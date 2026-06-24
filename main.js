/* ============================================================
   iBluhry — interactivity (vanilla JS)
   ============================================================ */

// ---------- 1. Mobile menu toggle ----------
const menuBtn    = document.getElementById('menuBtn');
const mobileMenu = document.getElementById('mobileMenu');

function closeMenu() {
  mobileMenu.classList.add('hidden');
  menuBtn.setAttribute('aria-expanded', 'false');
}
menuBtn.addEventListener('click', () => {
  const isOpen = !mobileMenu.classList.contains('hidden');
  mobileMenu.classList.toggle('hidden');
  menuBtn.setAttribute('aria-expanded', String(!isOpen));
});
// Close the menu when any link inside it is tapped
document.querySelectorAll('.mobile-link').forEach(a => a.addEventListener('click', closeMenu));

// ---------- 2. Navbar background on scroll ----------
const navbar = document.getElementById('navbar');
const onScroll = () => {
  if (window.scrollY > 24) {
    navbar.classList.add('bg-ink/80', 'backdrop-blur-md', 'border-slate-800');
  } else {
    navbar.classList.remove('bg-ink/80', 'backdrop-blur-md', 'border-slate-800');
  }
};
window.addEventListener('scroll', onScroll, { passive: true });
onScroll();

// ---------- 3. Reveal-on-scroll (IntersectionObserver) ----------
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      // Stagger items slightly for a nicer cascade
      entry.target.style.transitionDelay = (i % 6) * 60 + 'ms';
      entry.target.classList.add('in');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

// ---------- 4. Custom cursor (desktop / fine-pointer only) ----------
const dot  = document.getElementById('cursorDot');
const ring = document.getElementById('cursorRing');
const finePointer = window.matchMedia('(pointer: fine)').matches;

if (finePointer) {
  let mouseX = 0, mouseY = 0, ringX = 0, ringY = 0;

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX; mouseY = e.clientY;
    dot.style.left = mouseX + 'px';
    dot.style.top  = mouseY + 'px';
  });

  // Smooth trailing ring via requestAnimationFrame lerp
  const animate = () => {
    ringX += (mouseX - ringX) * 0.18;
    ringY += (mouseY - ringY) * 0.18;
    ring.style.left = ringX + 'px';
    ring.style.top  = ringY + 'px';
    requestAnimationFrame(animate);
  };
  animate();

  // Grow the ring over interactive elements
  document.querySelectorAll('[data-cursor], a, button, input, select, textarea').forEach(el => {
    el.addEventListener('mouseenter', () => ring.classList.add('hovering'));
    el.addEventListener('mouseleave', () => ring.classList.remove('hovering'));
  });
} else {
  // Touch device: drop the custom cursor and restore the native one
  dot.style.display = ring.style.display = 'none';
  document.body.style.cursor = 'auto';
}

// ---------- 5. Pricing plan → auto-fill project type ----------
const projectTypeSelect = document.getElementById('projectType');
document.querySelectorAll('a[data-plan]').forEach(link => {
  link.addEventListener('click', () => {
    projectTypeSelect.value = link.dataset.plan;
  });
});

// ---------- 6. Contact form (Formspree) ----------
const form   = document.getElementById('contactForm');
const status = document.getElementById('formStatus');

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  status.classList.remove('hidden');

  if (!form.checkValidity()) {
    status.textContent = 'Please fill out all fields before sending.';
    status.className = 'text-sm text-center text-red-400';
    form.reportValidity();
    return;
  }

  const submitBtn = form.querySelector('button[type="submit"]');
  submitBtn.disabled = true;
  submitBtn.textContent = 'Sending…';

  try {
    const res = await fetch('https://formspree.io/f/YOUR_FORM_ID', {
      method: 'POST',
      headers: { 'Accept': 'application/json' },
      body: new FormData(form),
    });

    if (res.ok) {
      status.textContent = "Ευχαριστώ για το μήνυμα! Θα απαντήσω όσο το δυνατόν γρηγορότερα.";
      status.className = 'text-sm text-center text-acid';
      form.reset();
    } else {
      const data = await res.json();
      status.textContent = data?.errors?.[0]?.message ?? 'Something went wrong. Please try again.';
      status.className = 'text-sm text-center text-red-400';
    }
  } catch {
    status.textContent = 'Network error — please check your connection and try again.';
    status.className = 'text-sm text-center text-red-400';
  } finally {
    submitBtn.disabled = false;
    submitBtn.textContent = 'Send It →';
  }
});

// ---------- 7. Footer year ----------
document.getElementById('year').textContent = new Date().getFullYear();

// ---------- 8. Video autoplay on scroll ----------
const videoObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    const video = entry.target;
    if (entry.isIntersecting) {
      video.play().catch(() => {});
    } else {
      video.pause();
    }
  });
}, { threshold: 0.25 });

document.querySelectorAll('.card-video').forEach(video => {
  // Hide the placeholder overlay once the video actually has data
  video.addEventListener('loadeddata', () => {
    const placeholder = video.closest('.relative')?.querySelector('.video-placeholder');
    if (placeholder) placeholder.style.display = 'none';
  });
  videoObserver.observe(video);
});
