<script setup>
import { computed } from 'vue'

const model = defineModel({ required: true })
const emit = defineEmits(['blur', 'change'])

const props = defineProps({
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
  },
  error: {
    type: String,
    default: ''
  }
})

const describedBy = computed(() => {
  const ids = []

  if (props.hint) {
    ids.push(`${props.id}-hint`)
  }

  if (props.error) {
    ids.push(`${props.id}-error`)
  }

  return ids.join(' ') || undefined
})
</script>

<template>
  <div class="form-control">
    <label class="form-label" :for="id">{{ label }}</label>
    <div class="form-select-wrap">
      <select
        :id="id"
        v-model="model"
        class="form-select"
        :required="required"
        :aria-invalid="error ? 'true' : 'false'"
        :aria-describedby="describedBy"
        @blur="emit('blur')"
        @change="emit('change')"
      >
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
    <p v-if="hint" :id="`${id}-hint`" class="form-hint">{{ hint }}</p>
    <p v-if="error" :id="`${id}-error`" class="form-error">
      <span class="form-error__prefix">Error: </span>{{ error }}
    </p>
  </div>
</template>
