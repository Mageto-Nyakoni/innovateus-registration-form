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
  required: {
    type: Boolean,
    default: false
  },
  options: {
    type: Array,
    required: true
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
    <div class="form-select-wrap">
      <select :id="id" v-model="model" class="form-select" :required="required">
        <option
          v-for="option in options"
          :key="`${id}-${option.value}`"
          :value="option.value"
          :disabled="option.disabled"
        >
          {{ option.label }}
        </option>
      </select>
    </div>
    <p v-if="hint" class="form-hint">{{ hint }}</p>
  </div>
</template>
