<script setup>
const model = defineModel({ required: true })

defineProps({
  id: {
    type: String,
    required: true
  },
  label: {
    type: String,
    required: true
  },
  type: {
    type: String,
    default: 'text'
  },
  placeholder: {
    type: String,
    default: ''
  },
  required: {
    type: Boolean,
    default: false
  },
  autocomplete: {
    type: String,
    default: ''
  },
  hint: {
    type: String,
    default: ''
  }
})
</script>

<template>
  <div class="form-control">
    <label class="form-label" :for="id">{{ label }}</label>
    <input
      :id="id"
      v-model="model"
      class="form-input"
      :type="type"
      :placeholder="placeholder"
      :required="required"
      :autocomplete="autocomplete"
    />
    <p v-if="hint" class="form-hint">{{ hint }}</p>
  </div>
</template>
