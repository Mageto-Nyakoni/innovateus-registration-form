<script setup>
import PartnerRibbon from './components/PartnerRibbon.vue'
import PageHeader from './components/PageHeader.vue'
import RegistrationForm from './components/RegistrationForm.vue'
import PageFooter from './components/PageFooter.vue'
</script>

<template>
  <div class="site-shell">
    <PartnerRibbon />
    <PageHeader />

    <main class="site-main">
      <section class="hero">
        <div class="hero__copy">
          <p class="hero__eyebrow">Mageto's Registration Prototype</p>
          <h1 class="hero__title">Looking For More (us)?</h1>
          <p class="hero__lede">
            You're in the right place. 
          </p>
          <p class="hero__lede">
            This is a Vue prototype which is aligned with the current site's framework. 
            I recreated the InnovateUS registration experience, and added the newsletter 
            opt-in as per the assignment. Ensured the form payload is structured for a later 
            Directus integration!
          </p>
        </div>
      </section>

      <RegistrationForm />
    </main>

    <PageFooter />
  </div>
</template>
