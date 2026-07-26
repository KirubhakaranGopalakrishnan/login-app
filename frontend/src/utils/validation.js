const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

// Returns an object of field -> error message. An empty object means
// the form is valid. Kept separate from the component so the rules are
// easy to find, test, or reuse elsewhere (e.g. a future signup form).
export function validateLoginForm({ email, password }) {
  const errors = {}

  if (!email.trim()) {
    errors.email = 'Email is required.'
  } else if (!EMAIL_REGEX.test(email.trim())) {
    errors.email = 'Enter a valid email address.'
  }

  if (!password) {
    errors.password = 'Password is required.'
  } else if (password.length < 6) {
    errors.password = 'Password must be at least 6 characters.'
  }

  return errors
}
