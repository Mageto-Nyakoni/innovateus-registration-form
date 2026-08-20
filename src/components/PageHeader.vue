<script setup>
import { ref } from 'vue'

const isMenuOpen = ref(false)

function toggleMenu() {
  isMenuOpen.value = !isMenuOpen.value
}

function closeMenu() {
  isMenuOpen.value = false
}
</script>

<template>
  <header class="site-header">
    <div class="site-header__inner">
      <div class="site-header__brand">innovate<span>(us)</span></div>

      <button
        class="site-header__burger"
        type="button"
        :aria-expanded="isMenuOpen ? 'true' : 'false'"
        aria-controls="site-header-menu"
        aria-label="Toggle navigation menu"
        @click="toggleMenu"
      >
        <span></span>
        <span></span>
        <span></span>
      </button>

      <div
        id="site-header-menu"
        class="site-header__menu"
        :class="{ 'site-header__menu--open': isMenuOpen }"
      >
        <nav class="site-header__nav" aria-label="Primary">
          <a href="https://innovate-us.org/course" @click="closeMenu">Ways to Learn</a>
          <a href="https://innovate-us.org/series" @click="closeMenu">Featured Topics</a>
          <a href="https://innovate-us.org/comms" @click="closeMenu">News &amp; Perspectives</a>
          <a href="https://innovate-us.org/about" @click="closeMenu">About Us</a>
        </nav>

        <a class="site-header__cta" href="https://innovate-us.org/comms" @click="closeMenu">
          Sign Up for Updates
        </a>
      </div>
    </div>
  </header>
</template>
