document.addEventListener('DOMContentLoaded', () => {
  // 1. Reveal on Scroll
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        el.classList.add('show');
        if (el.dataset.percent) animateBar(el);
        observer.unobserve(el);
      }
    });
  }, { threshold: 0.25 });

  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

  // 2. Skill Bars Animation
  function animateBar(container) {
    const bar = container.querySelector('span');
    bar.style.width = container.dataset.percent;
  }

  // 3. Smooth Scroll for CTA button
  const cta = document.getElementById('cta');
  if (cta) {
    cta.addEventListener('click', () => {
      const contactSection = document.getElementById('contact');
      if (contactSection) {
        contactSection.scrollIntoView({ behavior: 'smooth' });
      }
    });
  }

  // 4. Contact Form Handling
  const form = document.getElementById('contactForm');
  const toast = document.getElementById('successToast');
  let toastTimer;

  if (form && toast) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      clearTimeout(toastTimer);

      // Feld-Validierung
      const fields = ['name', 'email', 'subject', 'message'];
      let hasError = false;

      fields.forEach(id => {
        const input = form[id];
        const errorMsg = document.getElementById(id + 'Error');
        errorMsg.classList.add('hidden');

        const value = input.value.trim();
        if (!value || (id === 'email' && !/.+@.+\..+/.test(value))) {
          errorMsg.classList.remove('hidden');
          hasError = true;
        }
      });

      if (hasError) {
        return;
      }

      // Daten absenden
      try {
        const response = await fetch(form.action, {
          method: 'POST',
          body: new FormData(form),
          headers: { 'Accept': 'application/json' }
        });

        if (!response.ok) throw new Error('Network response was not OK');

        // Alles ok → Reset & Toast anzeigen
        form.reset();
        showToast();
      } catch (err) {
        console.error('Submit error:', err);
        alert('Fehler beim Senden — bitte später erneut versuchen.');
      }
    });

    // Toast-Funktion
    function showToast() {
      toast.classList.remove('opacity-0', 'pointer-events-none');
      toastTimer = setTimeout(() => {
        toast.classList.add('opacity-0', 'pointer-events-none');
      }, 4000);

      // Klick auf Toast versteckt es sofort
      toast.addEventListener('click', () => {
        clearTimeout(toastTimer);
        toast.classList.add('opacity-0', 'pointer-events-none');
      }, { once: true });
    }
  }
});
