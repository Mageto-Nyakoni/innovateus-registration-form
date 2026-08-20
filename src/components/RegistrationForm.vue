<script setup>
import { computed, reactive, ref, watch } from 'vue'
import {
  countryOptions,
  governmentLevelOptions,
  governmentOrganizationOptions,
  usStateOptions,
  workshopSeries
} from '../data/registrationOptions'
import FormField from './FormField.vue'
import FormSelect from './FormSelect.vue'
import NewsletterOptIn from './NewsletterOptIn.vue'
import SectionHeading from './SectionHeading.vue'
import SeriesSelector from './SeriesSelector.vue'

const formRef = ref(null)
const seriesError = ref('')
const submissionNotice = ref('')

const form = reactive({
  email: '',
  first_name: '',
  last_name: '',
  country_mode: '',
  non_us_country: '',
  state: '',
  gov_org: '',
  gov_level: '',
  workshop_series: [],
  newsletter: false,
  website: ''
})

const requiresState = computed(() => form.country_mode === 'United States')
const requiresNonUsCountry = computed(() => form.country_mode === 'Outside the United States')
const requiresGovLevel = computed(() => form.gov_org.startsWith('Yes'))
const resolvedCountry = computed(() =>
  requiresState.value ? 'United States' : form.non_us_country.trim()
)

const selectedSeriesTitles = computed(() =>
  workshopSeries
    .filter((entry) => form.workshop_series.includes(entry.id))
    .map((entry) => entry.title)
)

watch(
  () => form.country_mode,
  (mode) => {
    if (mode === 'United States') {
      form.non_us_country = ''
      return
    }

    if (mode === 'Outside the United States') {
      form.state = ''
      return
    }

    form.state = ''
    form.non_us_country = ''
  }
)

watch(
  () => form.gov_org,
  (value) => {
    if (!value.startsWith('Yes')) {
      form.gov_level = ''
    }
  }
)

const localPayloadPreview = computed(() => ({
  first_name: form.first_name,
  last_name: form.last_name,
  email: form.email,
  country: resolvedCountry.value,
  state: requiresState.value ? form.state : '',
  gov_org: form.gov_org,
  gov_level: requiresGovLevel.value ? form.gov_level : '',
  workshop_series: selectedSeriesTitles.value.join(', '),
  newsletter: form.newsletter
}))

function handleSubmit() {
  submissionNotice.value = ''
  seriesError.value = ''

  if (!formRef.value?.reportValidity()) {
    return
  }

  if (form.workshop_series.length === 0) {
    seriesError.value = 'Select at least one event series before continuing.'
    return
  }

  submissionNotice.value =
    'Frontend intake captured locally. The Directus submission route will be connected next.'
}
</script>

<template>
  <section class="registration-wrap">
    <div class="registration-card">
      <SectionHeading label="Registration Details" compact />

      <form ref="formRef" class="registration-form" novalidate @submit.prevent="handleSubmit">
        <FormField
          id="email"
          v-model="form.email"
          label="Email *"
          type="email"
          placeholder="your.email@example.com"
          autocomplete="email"
          required
        />

        <div class="registration-form__row">
          <FormField
            id="first_name"
            v-model="form.first_name"
            label="First Name *"
            placeholder="John"
            autocomplete="given-name"
            required
          />
          <FormField
            id="last_name"
            v-model="form.last_name"
            label="Last Name *"
            placeholder="Doe"
            autocomplete="family-name"
            required
          />
        </div>

        <div class="registration-form__row">
          <FormSelect
            id="country"
            v-model="form.country_mode"
            label="Country *"
            :options="countryOptions"
            required
          />

          <FormSelect
            v-if="requiresState"
            id="state"
            v-model="form.state"
            label="State/Province *"
            :options="usStateOptions"
            required
          />
          <FormField
            v-else-if="requiresNonUsCountry"
            id="non_us_country"
            v-model="form.non_us_country"
            label="Country (Non US only)"
            placeholder="Enter your answer (optional)"
            autocomplete="country-name"
          />
          <div v-else class="form-control form-control--empty" aria-hidden="true"></div>
        </div>

        <div class="registration-form__row registration-form__row--narrow registration-form__row--aligned-selects">
          <FormSelect
            id="gov_org"
            v-model="form.gov_org"
            label="Do you work for or primarily support a government or government-affiliated organization? *"
            :options="governmentOrganizationOptions"
            required
          />

          <FormSelect
            v-if="requiresGovLevel"
            id="gov_level"
            v-model="form.gov_level"
            label="If a government employee or consultant: What level of government? *"
            :options="governmentLevelOptions"
            required
          />
          <div v-else class="form-control form-control--empty" aria-hidden="true"></div>
        </div>

        <SeriesSelector v-model="form.workshop_series" :series="workshopSeries" />
        <p v-if="seriesError" class="form-error" role="alert">{{ seriesError }}</p>

        <NewsletterOptIn v-model="form.newsletter" />

        <div class="honeypot" aria-hidden="true">
          <label for="website">Website (leave blank)</label>
          <input id="website" v-model="form.website" type="text" tabindex="-1" autocomplete="off" />
        </div>

        <div class="registration-form__actions">
          <button type="submit" class="button button--primary">Register</button>
        </div>

        <p class="registration-form__help">
          Having trouble registering? Contact us at hello [at] innovate-us.org
        </p>

        <div v-if="submissionNotice" class="submission-preview" aria-live="polite">
          <p class="submission-preview__title">{{ submissionNotice }}</p>
          <pre class="submission-preview__code">{{ JSON.stringify(localPayloadPreview, null, 2) }}</pre>
        </div>
      </form>
    </div>
  </section>
</template>
