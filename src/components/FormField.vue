<script setup>
import { computed } from 'vue'

const model = defineModel({ required: true })
const emit = defineEmits(['blur', 'input'])

const props = defineProps({
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
    <input
      :id="id"
      v-model="model"
      class="form-input"
      :type="type"
      :placeholder="placeholder"
      :required="required"
      :autocomplete="autocomplete"
      :aria-invalid="error ? 'true' : 'false'"
      :aria-describedby="describedBy"
      @blur="emit('blur')"
      @input="emit('input')"
    />
    <p v-if="hint" :id="`${id}-hint`" class="form-hint">{{ hint }}</p>
    <p v-if="error" :id="`${id}-error`" class="form-error">
      <span class="form-error__prefix">Error: </span>{{ error }}
    </p>
  </div>
</template>
