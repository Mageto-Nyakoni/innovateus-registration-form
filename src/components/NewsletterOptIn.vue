<script setup>
const model = defineModel({ required: true })
</script>

<template>
  <div class="newsletter-opt-in">
    <label class="newsletter-opt-in__label" for="newsletter">
      <input
        id="newsletter"
        v-model="model"
        type="checkbox"
        name="newsletter"
        class="newsletter-opt-in__checkbox"
        aria-labelledby="newsletter-label"
        aria-describedby="newsletter-description"
      />
      <span class="newsletter-opt-in__icon" aria-hidden="true">
        <svg viewBox="0 0 24 24" class="newsletter-opt-in__icon-svg" focusable="false" aria-hidden="true">
          <path
            d="M4 6.5h16a1.5 1.5 0 0 1 1.5 1.5v8A1.5 1.5 0 0 1 20 17.5H4A1.5 1.5 0 0 1 2.5 16V8A1.5 1.5 0 0 1 4 6.5Zm0 1.5v.15L12 13.1l8-4.95V8H4Zm16 8v-6.1l-7.6 4.7a.75.75 0 0 1-.8 0L4 9.9V16h16Z"
            fill="currentColor"
          />
        </svg>
      </span>
      <span class="newsletter-opt-in__content">
        <span id="newsletter-label" class="newsletter-opt-in__headline">
          Sign me up for the InnovateUS weekly newsletter.
        </span>
        <span id="newsletter-description" class="newsletter-opt-in__copy">
          We will preserve this preference in the CMS as part of the registration intake.
        </span>
      </span>
    </label>
  </div>
</template>
