(function () {
        const root = document.body;
        const toggle = document.querySelector('.theme-toggle');
        const savedTheme = localStorage.getItem('regine-theme');
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        const initialTheme = savedTheme || (prefersDark ? 'dark' : 'light');

        root.setAttribute('data-theme', initialTheme);
        toggle.textContent = initialTheme === 'dark' ? '☀' : '☾';

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
