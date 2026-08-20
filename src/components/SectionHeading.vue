<script setup>
defineProps({
  label: {
    type: String,
    default: ''
  },
  title: {
    type: String,
    default: ''
  },
  description: {
    type: String,
    default: ''
  },
  compact: {
    type: Boolean,
    default: false
  }
})
</script>

<template>
  <div class="section-heading" :class="{ 'section-heading--compact': compact }">
    <p v-if="label" class="section-heading__label">{{ label }}</p>
    <h2 v-if="title" class="section-heading__title">{{ title }}</h2>
    <p v-if="description" class="section-heading__description">{{ description }}</p>
  </div>
</template>
