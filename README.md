# InnovateUS Registration Form

A Vue-based registration form prototype for InnovateUS. The app recreates the registration experience, adds a newsletter opt-in, validates entries on the client, and submits registrations through a Netlify Function to Directus.

## Tech Stack

- Vue 3
- Vite
- Netlify Functions
- Directus
- Vitest

## Implemented

- Recreated InnovateUS registration form
- Newsletter opt-in stored with the registration payload
- Client-side validation for required and conditional fields
- Practical accessibility improvements for labels, validation messages, error associations, conditional fields, focus handling, and submission feedback
- Vue -> Netlify Function -> Directus submission flow
- Honeypot field for basic spam mitigation
- Tests for the Vue form and Netlify submission function

## Architecture

```text
Vue registration form
        ↓
Netlify Function
        ↓
Directus API
        ↓
cw_intake
```

The Vue app posts registration data to `/.netlify/functions/submit-registration`. The Netlify Function validates and normalizes the payload, then sends it to the Directus `cw_intake` collection.

The Directus token is only read by the Netlify Function and should remain server-side. It is not exposed to the browser bundle.

## Local Setup

Install dependencies:

```bash
npm install
```

Create a local `.env` file for Netlify/function development:

```bash
DIRECTUS_TOKEN=your_directus_token_here
DIRECTUS_URL=https://your-directus-instance.example
```

`DIRECTUS_TOKEN` is required for real submissions. `DIRECTUS_URL` is optional in code because the function has a default URL, but setting it explicitly is recommended for local and deployed environments.

## Run Locally

Start the Vite dev server:

```bash
npm run dev
```

For end-to-end local testing of the Netlify Function path, use Netlify's local dev server if available:

```bash
netlify dev
```

## Tests

Run the test suite:

```bash
npm test
```

The tests cover client-side form validation, conditional field behavior, newsletter payload handling, accessibility-related form attributes, submission states, and the Netlify Function's request handling.

Current result: 2 test files, 31 tests passing.

## Production Build

Build the Vite app:

```bash
npm run build
```

The production output is written to `dist`.

## Netlify Deployment

Netlify is configured with:

- Build command: `npm run build`
- Publish directory: `dist`
- Functions directory: `netlify/functions`

Set these environment variables in Netlify before using live submissions:

```bash
DIRECTUS_TOKEN=your_directus_token_here
DIRECTUS_URL=https://your-directus-instance.example
```

Do not commit real credentials or expose the Directus token in client-side code.
