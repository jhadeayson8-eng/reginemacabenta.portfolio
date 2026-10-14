(function () {
        const root = document.body;
        const toggle = document.querySelector('.theme-toggle');
        const savedTheme = localStorage.getItem('regine-theme');
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        const initialTheme = savedTheme || (prefersDark ? 'dark' : 'light');

        root.setAttribute('data-theme', initialTheme);
        toggle.textContent = initialTheme === 'dark' ? '☀' : '☾';

        const topbar = document.querySelector('.topbar');

        function updateTopbar() {
          topbar.classList.toggle('is-scrolled', window.scrollY > 12);
        }

        updateTopbar();
        window.addEventListener('scroll', updateTopbar, { passive: true });

        const canvas = document.querySelector('.background-particles');
        const context = canvas.getContext('2d');
        const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        let particles = [];
        let width = 0;
        let height = 0;
        let animationFrame;

        function resizeCanvas() {
          const pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
          width = window.innerWidth;
          height = window.innerHeight;
          canvas.width = width * pixelRatio;
          canvas.height = height * pixelRatio;
          context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);

          const count = Math.min(100, Math.max(24, Math.floor((width * height) / 18000)));
          particles = Array.from({ length: count }, function () {
            return {
              x: Math.random() * width,
              y: Math.random() * height,
              vx: (Math.random() - 0.5) * 0.45,
              vy: (Math.random() - 0.5) * 0.45,
              radius: Math.random() * 1.5 + 1
            };
          });
        }

        function drawParticles() {
          context.clearRect(0, 0, width, height);
          const color = getComputedStyle(root).getPropertyValue('--particle-rgb').trim();

          particles.forEach(function (particle, index) {
            if (!reduceMotion) {
              particle.x += particle.vx;
              particle.y += particle.vy;
              if (particle.x < 0 || particle.x > width) particle.vx *= -1;
              if (particle.y < 0 || particle.y > height) particle.vy *= -1;
            }

            context.beginPath();
            context.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
            context.fillStyle = 'rgba(' + color + ', 0.75)';
            context.fill();

            for (let otherIndex = index + 1; otherIndex < particles.length; otherIndex += 1) {
              const other = particles[otherIndex];
              const dx = particle.x - other.x;
              const dy = particle.y - other.y;
              const distance = Math.sqrt(dx * dx + dy * dy);

              if (distance < 125) {
                context.beginPath();
                context.moveTo(particle.x, particle.y);
                context.lineTo(other.x, other.y);
                context.strokeStyle = 'rgba(' + color + ', ' + (1 - distance / 125) * 0.24 + ')';
                context.lineWidth = 1;
                context.stroke();
              }
            }
          });

          if (!reduceMotion) {
            animationFrame = window.requestAnimationFrame(drawParticles);
          }
        }

        resizeCanvas();
        drawParticles();
        window.addEventListener('resize', function () {
          window.cancelAnimationFrame(animationFrame);
          resizeCanvas();
          drawParticles();
        });

        const emailLink = document.querySelector('#email-link');
        const isMobile = /Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent);
        const mobileNav = document.querySelector('.mobile-nav');

        if (!isMobile) {
          emailLink.href = 'https://mail.google.com/mail/?view=cm&fs=1&to=macabentaregines%40gmail.com';
          emailLink.target = '_blank';
          emailLink.rel = 'noopener noreferrer';
        }

        mobileNav.querySelectorAll('a').forEach(function (link) {
          link.addEventListener('click', function () {
            mobileNav.open = false;
          });
        });

        toggle.addEventListener('click', function () {
          const current = root.getAttribute('data-theme');
          const next = current === 'dark' ? 'light' : 'dark';
          root.setAttribute('data-theme', next);
          toggle.textContent = next === 'dark' ? '☀' : '☾';
          localStorage.setItem('regine-theme', next);
        });
      })();
