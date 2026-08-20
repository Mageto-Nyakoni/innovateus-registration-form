<template>
  <footer class="site-footer">
    <div class="site-footer__panel">
      <section class="site-footer__cta">
        <h2 class="site-footer__headline">
          Want to be a part of our community of innovators?
          <em>We'd love to keep in touch.</em>
        </h2>
        <a class="site-footer__button" href="https://innovate-us.org/mailinglist">
          Join Our Mailing List
        </a>
      </section>

      <div class="site-footer__brand-row">
        <a class="site-footer__brand" href="https://innovate-us.org/">
          innovate<span>(us)</span>
        </a>
      </div>

      <div class="site-footer__meta">
        <div class="site-footer__column">
          <ul class="site-footer__links">
            <li><a href="https://innovate-us.org/contact-us">Contact Us</a></li>
            <li><a href="https://innovate-us.org/privacy-policy">Privacy Policy</a></li>
            <li><a href="https://innovate-us.org/accessibility-policy">Accessibility Policy</a></li>
          </ul>
        </div>

        <div class="site-footer__column">
          <p class="site-footer__column-label">Follow Us On</p>
          <div class="site-footer__socials">
            <a
              class="site-footer__social-link"
              href="https://www.linkedin.com/company/innovateus-govlab"
              aria-label="Follow InnovateUS on LinkedIn"
            >
              <svg viewBox="0 0 60 60" aria-hidden="true">
                <path
                  d="M15 10h30c2.76 0 5 2.24 5 5v30c0 2.76-2.24 5-5 5H15c-2.76 0-5-2.24-5-5V15c0-2.76 2.24-5 5-5Zm3.9 14.7a3.6 3.6 0 1 0 0-7.2 3.6 3.6 0 0 0 0 7.2Zm-3 19.8h6V28.2h-6v16.3Zm10.4-16.3v16.3h6v-8.1c0-4.4 5.7-4.8 5.7 0v8.1h6v-10.2c0-7.9-8.7-7.6-11.7-3.7v-2.4h-6Z"
                  fill="currentColor"
                />
              </svg>
            </a>
            <a
              class="site-footer__social-link site-footer__social-link--bluesky"
              href="https://bsky.app/profile/innovateus.bsky.social"
              aria-label="Follow InnovateUS on Bluesky"
            >
              <svg viewBox="0 0 44 38" aria-hidden="true">
                <path
                  d="M9.3 2.7C13 5.5 17 11.2 22 17.8 27 11.2 31 5.5 34.7 2.7 37.4.7 41-.8 41 4.8c0 1.1-.7 9.3-1.1 10.7-1.4 5-5.7 6.2-9.5 5.5 6.5 1.1 8.1 4.7 4.5 8.2-6.8 6.7-9.8-1.7-10.6-3.8-.1-.3-.2-.4-.3-.4-.1 0-.2.1-.3.4-.8 2.1-3.8 10.5-10.6 3.8-3.6-3.5-2-7.1 4.5-8.2-3.8.7-8.1-.5-9.5-5.5C3.7 14.1 3 5.9 3 4.8 3-.8 6.6.7 9.3 2.7Z"
                  fill="none"
                  stroke="currentColor"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2.4"
                />
              </svg>
            </a>
          </div>
        </div>

        <form class="site-footer__subscribe" @submit.prevent>
          <label for="footer-email">Subscribe for Updates</label>
          <div class="site-footer__subscribe-row">
            <input id="footer-email" type="email" placeholder="Your Email" />
            <button type="submit">Subscribe</button>
          </div>
        </form>
      </div>

      <p class="site-footer__license">
        This work is licensed under a
        <a href="https://creativecommons.org/licenses/by-sa/4.0/">
          Creative Commons Attribution-ShareAlike 4.0 International License
        </a>
        .
      </p>
      <p class="site-footer__footnote">
        * This site is a practice project created for a take-home web developer assignment and is
        not an official InnovateUS registration experience.
      </p>
    </div>

    <div class="site-footer__partner-bar">
      <div class="site-footer__partner-inner">
        <span>This is a partner project of :</span>
        <a href="https://ai4impact.ai/">AI for Impact</a>
        <a href="https://burnescenter.northeastern.edu/">The Burnes Center for Social Change</a>
        <a href="https://rebootdemocracy.ai/">Reboot Democracy</a>
        <a href="https://thegovlab.org/">The GovLab</a>
      </div>
    </div>
  </footer>
</template>
