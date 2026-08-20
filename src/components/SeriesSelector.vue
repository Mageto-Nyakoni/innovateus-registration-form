<script setup>
import { computed } from 'vue'

const model = defineModel({ required: true })

const props = defineProps({
  series: {
    type: Array,
    required: true
  },
  error: {
    type: String,
    default: ''
  }
})

const selectedCount = computed(() => model.value.length)
const describedBy = computed(() => {
  const ids = ['workshop-series-help']

  if (props.error) {
    ids.push('workshop-series-error')
  }

  return ids.join(' ')
})

function toggleSeries(id) {
  if (model.value.includes(id)) {
    model.value = model.value.filter((entry) => entry !== id)
    return
  }

  model.value = [...model.value, id]
}

function selectAll() {
  model.value = props.series.map((entry) => entry.id)
}

function clearAll() {
  model.value = []
}

function isChecked(id) {
  return model.value.includes(id)
}
</script>

<template>
  <fieldset
    class="series-selector"
    :class="{ 'series-selector--invalid': error }"
    :aria-invalid="error ? 'true' : undefined"
    :aria-describedby="describedBy"
  >
    <legend id="series-title" class="series-selector__title">Selected Event Series</legend>
    <div class="series-selector__header">
      <div>
        <p class="series-selector__summary">
          You are registering for {{ selectedCount }} event
          {{ selectedCount === 1 ? 'series' : 'series entries' }}.
        </p>
      </div>
    </div>

    <div class="series-selector__toolbar">
      <button type="button" class="button button--secondary button--small" @click="selectAll">
        Select All Series
      </button>
      <p id="workshop-series-help" class="series-selector__toolbar-copy">
        Select at least one series to continue.
      </p>
      <button
        v-if="selectedCount"
        type="button"
        class="series-selector__clear"
        @click="clearAll"
      >
        Clear
      </button>
    </div>

    <ul class="series-selector__list">
      <li v-for="entry in series" :key="entry.id" class="series-selector__item">
        <label class="series-card">
          <input
            class="series-card__checkbox"
            type="checkbox"
            name="workshop_series"
            :value="entry.id"
            :checked="isChecked(entry.id)"
            :aria-invalid="error ? 'true' : 'false'"
            :aria-describedby="describedBy"
            @change="toggleSeries(entry.id)"
          />
          <span class="series-card__badge" aria-hidden="true">{{ entry.badge }}</span>
          <span class="series-card__title">{{ entry.title }}</span>
        </label>
      </li>
    </ul>

    <p v-if="error" id="workshop-series-error" class="form-error">
      <span class="form-error__prefix">Error: </span>{{ error }}
    </p>
  </fieldset>
</template>
