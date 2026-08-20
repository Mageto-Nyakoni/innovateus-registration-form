import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import RegistrationForm from '../RegistrationForm.vue'
import {
  governmentLevelOptions,
  governmentOrganizationOptions,
  workshopSeries
} from '../../data/registrationOptions'

const yesGovOrgValue = governmentOrganizationOptions.find((option) =>
  option.value.startsWith('Yes')
).value
const noGovOrgValue = governmentOrganizationOptions.find((option) =>
  option.value.startsWith('No')
).value
const governmentLevelValue = governmentLevelOptions[1].value

function flushPromises() {
  return new Promise((resolve) => setTimeout(resolve, 0))
}

async function submitForm(wrapper) {
  await wrapper.find('form').trigger('submit.prevent')
  await flushPromises()
  await nextTick()
}

async function fillValidForm(wrapper, options = {}) {
  const country = options.country ?? 'United States'
  const govOrg = options.govOrg ?? yesGovOrgValue

  await wrapper.find('#email').setValue(options.email ?? 'ada@example.com')
  await wrapper.find('#first_name').setValue(options.firstName ?? 'Ada')
  await wrapper.find('#last_name').setValue(options.lastName ?? 'Lovelace')
  await wrapper.find('#country').setValue(country)
  await nextTick()

  if (country === 'United States') {
    if (!options.skipState) {
      await wrapper.find('#state').setValue(options.state ?? 'IL')
    }
  } else if (!options.skipNonUsCountry) {
    await wrapper.find('#non_us_country').setValue(options.nonUsCountry ?? 'Canada')
  }

  await wrapper.find('#gov_org').setValue(govOrg)
  await nextTick()

  if (govOrg.startsWith('Yes') && !options.skipGovLevel) {
    await wrapper.find('#gov_level').setValue(options.govLevel ?? governmentLevelValue)
  }

  if (!options.skipWorkshopSeries) {
    await wrapper.find('.series-card__checkbox').setValue(true)
  }

  if (options.newsletter === true) {
    await wrapper.find('.newsletter-opt-in__checkbox').setValue(true)
  }
}

function fetchPayload() {
  const [, request] = global.fetch.mock.calls[0]
  return JSON.parse(request.body)
}

describe('RegistrationForm', () => {
  beforeEach(() => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: vi.fn().mockResolvedValue({ ok: true })
    })
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('prevents submission for an empty form', async () => {
    const wrapper = mount(RegistrationForm)

    await submitForm(wrapper)

    expect(global.fetch).not.toHaveBeenCalled()
  })

  it('shows required-field validation messages after submit', async () => {
    const wrapper = mount(RegistrationForm)

    await submitForm(wrapper)

    expect(wrapper.find('[role="alert"]').text()).toBe(
      'Please correct the fields with error messages before registering.'
    )
    expect(wrapper.find('#email-error').text()).toBe('Error: Email is required.')
    expect(wrapper.find('#first_name-error').text()).toBe('Error: First name is required.')
    expect(wrapper.find('#last_name-error').text()).toBe('Error: Last name is required.')
    expect(wrapper.find('#country-error').text()).toBe('Error: Select a country.')
    expect(wrapper.find('#gov_org-error').text()).toBe(
      'Error: Select whether you support a government organization.'
    )
    expect(wrapper.find('#workshop-series-error').text()).toBe(
      'Error: Select at least one event series before continuing.'
    )
    expect(wrapper.find('#state-error').exists()).toBe(false)
    expect(wrapper.find('#non_us_country-error').exists()).toBe(false)
    expect(wrapper.find('#gov_level-error').exists()).toBe(false)
  })

  it('associates visible labels with native form controls', async () => {
    const wrapper = mount(RegistrationForm)

    ;['email', 'first_name', 'last_name', 'country', 'gov_org'].forEach((id) => {
      expect(wrapper.find(`label[for="${id}"]`).exists()).toBe(true)
      expect(wrapper.find(`#${id}`).exists()).toBe(true)
    })

    await wrapper.find('#country').setValue('United States')
    await nextTick()
    expect(wrapper.find('label[for="state"]').text()).toContain('State')

    await wrapper.find('#country').setValue('Outside the United States')
    await nextTick()
    expect(wrapper.find('label[for="non_us_country"]').text()).toContain(
      'Country (Outside the United States)'
    )

    await wrapper.find('#gov_org').setValue(yesGovOrgValue)
    await nextTick()
    expect(wrapper.find('label[for="gov_level"]').text()).toContain('What level of government?')

    const newsletter = wrapper.find('#newsletter')
    expect(newsletter.exists()).toBe(true)
    expect(wrapper.find('label[for="newsletter"]').text()).toContain(
      'Sign me up for the InnovateUS weekly newsletter.'
    )
    expect(wrapper.find('legend#series-title').text()).toBe('Selected Event Series')
    expect(wrapper.find('.series-card').text()).toContain(workshopSeries[0].title)
  })

  it('associates invalid fields with their field-level error messages', async () => {
    const wrapper = mount(RegistrationForm)

    await submitForm(wrapper)

    expect(wrapper.find('#email').attributes('aria-invalid')).toBe('true')
    expect(wrapper.find('#email').attributes('aria-describedby')).toBe('email-error')
    expect(wrapper.find('#country').attributes('aria-invalid')).toBe('true')
    expect(wrapper.find('#country').attributes('aria-describedby')).toBe('country-error')

    const seriesGroup = wrapper.find('fieldset.series-selector')
    expect(seriesGroup.attributes('aria-invalid')).toBe('true')
    expect(seriesGroup.attributes('aria-describedby')).toBe(
      'workshop-series-help workshop-series-error'
    )

    const seriesCheckbox = wrapper.find('.series-card__checkbox')
    expect(seriesCheckbox.attributes('aria-invalid')).toBe('true')
    expect(seriesCheckbox.attributes('aria-describedby')).toBe(
      'workshop-series-help workshop-series-error'
    )
  })

  it('rejects whitespace-only required text fields', async () => {
    const wrapper = mount(RegistrationForm)

    await fillValidForm(wrapper, {
      firstName: '   ',
      lastName: '   '
    })

    await submitForm(wrapper)

    expect(global.fetch).not.toHaveBeenCalled()
    expect(wrapper.find('#first_name-error').text()).toBe('Error: First name is required.')
    expect(wrapper.find('#last_name-error').text()).toBe('Error: Last name is required.')
  })

  it('rejects invalid email input', async () => {
    const wrapper = mount(RegistrationForm)

    await fillValidForm(wrapper, {
      email: 'test@'
    })

    await submitForm(wrapper)

    expect(global.fetch).not.toHaveBeenCalled()
    expect(wrapper.find('#email-error').text()).toBe('Error: Enter a valid email address.')
  })

  it('accepts a valid email and submits', async () => {
    const wrapper = mount(RegistrationForm)

    await fillValidForm(wrapper, {
      email: '  valid.person@example.com  '
    })

    await submitForm(wrapper)

    expect(global.fetch).toHaveBeenCalledTimes(1)
    expect(fetchPayload().email).toBe('valid.person@example.com')
  })

  it('requires state only for United States registrations', async () => {
    const usWrapper = mount(RegistrationForm)

    await fillValidForm(usWrapper, {
      skipState: true
    })
    await submitForm(usWrapper)

    expect(global.fetch).not.toHaveBeenCalled()
    expect(usWrapper.find('#state-error').text()).toBe('Error: Select a state.')

    global.fetch.mockClear()

    const nonUsWrapper = mount(RegistrationForm)

    await fillValidForm(nonUsWrapper, {
      country: 'Outside the United States'
    })
    await submitForm(nonUsWrapper)

    expect(global.fetch).toHaveBeenCalledTimes(1)
    expect(nonUsWrapper.find('#state').exists()).toBe(false)
    expect(nonUsWrapper.find('#state-error').exists()).toBe(false)
  })

  it('requires government level only when a government organization answer makes it applicable', async () => {
    const yesWrapper = mount(RegistrationForm)

    await fillValidForm(yesWrapper, {
      skipGovLevel: true
    })
    await submitForm(yesWrapper)

    expect(global.fetch).not.toHaveBeenCalled()
    expect(yesWrapper.find('#gov_level-error').text()).toBe('Error: Select the government level.')

    global.fetch.mockClear()

    const noWrapper = mount(RegistrationForm)

    await fillValidForm(noWrapper, {
      govOrg: noGovOrgValue
    })
    await submitForm(noWrapper)

    expect(global.fetch).toHaveBeenCalledTimes(1)
    expect(noWrapper.find('#gov_level').exists()).toBe(false)
    expect(noWrapper.find('#gov_level-error').exists()).toBe(false)
  })

  it('prevents submission when no workshop series is selected', async () => {
    const wrapper = mount(RegistrationForm)

    await fillValidForm(wrapper, {
      skipWorkshopSeries: true
    })
    await submitForm(wrapper)

    expect(global.fetch).not.toHaveBeenCalled()
    expect(wrapper.find('#workshop-series-error').text()).toBe(
      'Error: Select at least one event series before continuing.'
    )
  })

  it('keeps conditional fields out of the tab order and validation until relevant', async () => {
    const wrapper = mount(RegistrationForm)

    await submitForm(wrapper)

    expect(wrapper.find('#state').exists()).toBe(false)
    expect(wrapper.find('#non_us_country').exists()).toBe(false)
    expect(wrapper.find('#gov_level').exists()).toBe(false)
    expect(wrapper.find('#state-error').exists()).toBe(false)
    expect(wrapper.find('#non_us_country-error').exists()).toBe(false)
    expect(wrapper.find('#gov_level-error').exists()).toBe(false)

    await wrapper.find('#country').setValue('Outside the United States')
    await submitForm(wrapper)

    expect(wrapper.find('#non_us_country').exists()).toBe(true)
    expect(wrapper.find('#non_us_country-error').text()).toBe('Error: Enter your country.')
    expect(wrapper.find('#state').exists()).toBe(false)
    expect(wrapper.find('#state-error').exists()).toBe(false)
  })

  it('submits newsletter as false when unchecked', async () => {
    const wrapper = mount(RegistrationForm)

    await fillValidForm(wrapper)
    await submitForm(wrapper)

    expect(global.fetch).toHaveBeenCalledTimes(1)
    expect(fetchPayload().newsletter).toBe(false)
  })

  it('uses a native labelled checkbox for newsletter preference', async () => {
    const wrapper = mount(RegistrationForm, { attachTo: document.body })
    const newsletter = wrapper.find('#newsletter')

    expect(newsletter.attributes('type')).toBe('checkbox')
    expect(newsletter.attributes('name')).toBe('newsletter')
    expect(newsletter.attributes('aria-labelledby')).toBe('newsletter-label')
    expect(newsletter.attributes('aria-describedby')).toBe('newsletter-description')
    expect(wrapper.find('#newsletter-label').text()).toBe(
      'Sign me up for the InnovateUS weekly newsletter.'
    )
    expect(wrapper.find('#newsletter-description').text()).toContain(
      'We will preserve this preference'
    )
    expect(newsletter.element.labels[0]).toBe(wrapper.find('label[for="newsletter"]').element)
    expect(newsletter.element.tabIndex).toBe(0)

    newsletter.element.focus()
    expect(document.activeElement).toBe(newsletter.element)

    await newsletter.setValue(true)
    expect(newsletter.element.checked).toBe(true)

    wrapper.unmount()
  })

  it('submits newsletter as true when checked', async () => {
    const wrapper = mount(RegistrationForm)

    await fillValidForm(wrapper, {
      newsletter: true
    })
    await submitForm(wrapper)

    expect(global.fetch).toHaveBeenCalledTimes(1)
    expect(fetchPayload().newsletter).toBe(true)
  })

  it('disables the submit button and prevents duplicate submissions while loading', async () => {
    let resolveFetch
    global.fetch.mockReturnValue(
      new Promise((resolve) => {
        resolveFetch = resolve
      })
    )
    const wrapper = mount(RegistrationForm)

    await fillValidForm(wrapper)
    await wrapper.find('form').trigger('submit.prevent')
    await nextTick()

    const submitButton = wrapper.find('button[type="submit"]')
    expect(submitButton.attributes('disabled')).toBeDefined()
    expect(submitButton.text()).toBe('Submitting...')

    await wrapper.find('form').trigger('submit.prevent')
    expect(global.fetch).toHaveBeenCalledTimes(1)

    resolveFetch({
      ok: true,
      json: vi.fn().mockResolvedValue({ ok: true })
    })
    await flushPromises()
    await nextTick()

    expect(submitButton.attributes('disabled')).toBeUndefined()
    expect(submitButton.text()).toBe('Register')
  })

  it('shows a success notice after a successful submission', async () => {
    const wrapper = mount(RegistrationForm)

    await fillValidForm(wrapper)
    await submitForm(wrapper)

    expect(wrapper.find('[role="status"] .submission-preview__title').text()).toBe(
      'Registration submitted successfully.'
    )
  })

  it('shows the server error and clears loading after a non-OK response', async () => {
    global.fetch.mockResolvedValue({
      ok: false,
      json: vi.fn().mockResolvedValue({ error: 'Registration is currently unavailable.' })
    })
    const wrapper = mount(RegistrationForm)

    await fillValidForm(wrapper)
    await submitForm(wrapper)

    expect(wrapper.find('[role="alert"]').text()).toContain(
      'Registration is currently unavailable.'
    )
    expect(wrapper.find('button[type="submit"]').attributes('disabled')).toBeUndefined()
    expect(wrapper.find('button[type="submit"]').text()).toBe('Register')
  })

  it('shows a network error and clears loading when the request rejects', async () => {
    global.fetch.mockRejectedValue(new Error('Network unavailable.'))
    const wrapper = mount(RegistrationForm)

    await fillValidForm(wrapper)
    await submitForm(wrapper)

    expect(wrapper.find('[role="alert"]').text()).toContain('Network unavailable.')
    expect(wrapper.find('button[type="submit"]').attributes('disabled')).toBeUndefined()
    expect(wrapper.find('button[type="submit"]').text()).toBe('Register')
  })

  it('clears an inline error after the invalid field is corrected', async () => {
    const wrapper = mount(RegistrationForm)

    await submitForm(wrapper)
    expect(wrapper.find('#email-error').text()).toBe('Error: Email is required.')

    await wrapper.find('#email').setValue('corrected@example.com')

    expect(wrapper.find('#email-error').exists()).toBe(false)
  })

  it('focuses the first invalid field after an invalid submission', async () => {
    const wrapper = mount(RegistrationForm, { attachTo: document.body })

    await submitForm(wrapper)

    expect(document.activeElement).toBe(wrapper.find('#email').element)
    wrapper.unmount()
  })

  it('clears stale state values and validation when country mode changes', async () => {
    const valueWrapper = mount(RegistrationForm)

    await valueWrapper.find('#country').setValue('United States')
    await nextTick()
    await valueWrapper.find('#state').setValue('IL')
    await valueWrapper.find('#country').setValue('Outside the United States')
    await nextTick()
    await valueWrapper.find('#country').setValue('United States')
    await nextTick()

    expect(valueWrapper.find('#state').element.value).toBe('')

    const errorWrapper = mount(RegistrationForm)
    await errorWrapper.find('#country').setValue('United States')
    await submitForm(errorWrapper)
    expect(errorWrapper.find('#state-error').text()).toBe('Error: Select a state.')

    await errorWrapper.find('#country').setValue('Outside the United States')
    await nextTick()

    expect(errorWrapper.find('#state').exists()).toBe(false)
    expect(errorWrapper.find('#state-error').exists()).toBe(false)
  })

  it('clears stale government-level values and validation when the answer changes', async () => {
    const valueWrapper = mount(RegistrationForm)

    await valueWrapper.find('#gov_org').setValue(yesGovOrgValue)
    await nextTick()
    await valueWrapper.find('#gov_level').setValue(governmentLevelValue)
    await valueWrapper.find('#gov_org').setValue(noGovOrgValue)
    await nextTick()
    await valueWrapper.find('#gov_org').setValue(yesGovOrgValue)
    await nextTick()

    expect(valueWrapper.find('#gov_level').element.value).toBe('')

    const errorWrapper = mount(RegistrationForm)
    await errorWrapper.find('#gov_org').setValue(yesGovOrgValue)
    await submitForm(errorWrapper)
    expect(errorWrapper.find('#gov_level-error').text()).toBe('Error: Select the government level.')

    await errorWrapper.find('#gov_org').setValue(noGovOrgValue)
    await nextTick()

    expect(errorWrapper.find('#gov_level').exists()).toBe(false)
    expect(errorWrapper.find('#gov_level-error').exists()).toBe(false)
  })

  it('sends selected workshop titles and applicable conditional fields', async () => {
    const wrapper = mount(RegistrationForm)

    await fillValidForm(wrapper)
    await wrapper.findAll('.series-card__checkbox')[1].setValue(true)
    await submitForm(wrapper)

    expect(fetchPayload()).toMatchObject({
      state: 'IL',
      gov_level: governmentLevelValue,
      workshop_series: `${workshopSeries[0].title}, ${workshopSeries[1].title}`
    })
  })

  it('omits state and government level when they are not applicable', async () => {
    const wrapper = mount(RegistrationForm)

    await fillValidForm(wrapper, {
      country: 'Outside the United States',
      govOrg: noGovOrgValue
    })
    await submitForm(wrapper)

    const payload = fetchPayload()
    expect(payload.country).toBe('Canada')
    expect(payload).not.toHaveProperty('state')
    expect(payload).not.toHaveProperty('gov_level')
  })
})
