import { useState } from 'react'
import { ShieldCheck, X } from 'lucide-react'
import demoUsers from '../data/demo-users.json'
import {
  findUserByEmail,
  saveRegisteredUser,
} from '../utils/user-storage'

const inputClass =
  'mt-1.5 w-full rounded-lg border border-border bg-white px-3.5 py-3 text-text-main outline-none transition placeholder:text-text-muted focus:border-secondary focus:ring-2 focus:ring-secondary/25'

const AuthPage = ({ mode, onClose, onModeChange, onAuthenticate }) => {
  const isSignup = mode === 'signup'
  const [notice, setNotice] = useState('')
  const [noticeIsError, setNoticeIsError] = useState(false)

  const handleSubmit = (event) => {
    event.preventDefault()
    setNotice('')
    setNoticeIsError(false)
    const formData = new FormData(event.currentTarget)

    if (isSignup) {
      try {
        const user = saveRegisteredUser({
          name: formData.get('name'),
          email: formData.get('email'),
        })
        onAuthenticate(user)
      } catch (error) {
        setNotice(error.message)
        setNoticeIsError(true)
      }
      return
    }

    try {
      const user = findUserByEmail(formData.get('email'))
      if (!user) {
        setNotice(
          'No demo profile found for this email. Create a new profile or try an email from the demo list.',
        )
        setNoticeIsError(true)
        return
      }
      onAuthenticate(user)
    } catch (error) {
      setNotice(error.message)
      setNoticeIsError(true)
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/60 px-4 py-6 backdrop-blur-sm sm:px-6"
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose()
      }}
      onKeyDown={(event) => {
        if (event.key === 'Escape') onClose()
      }}
    >
      <section
        aria-labelledby="auth-heading"
        aria-modal="true"
        className="relative my-auto w-full max-w-md rounded-2xl border border-border bg-surface p-6 shadow-2xl sm:p-9"
        role="dialog"
      >
          <button
            aria-label="Close sign-in dialog"
            autoFocus
            className="absolute right-4 top-4 inline-flex h-10 w-10 items-center justify-center rounded-full text-text-muted transition hover:bg-surface-muted hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary"
            onClick={onClose}
            type="button"
          >
            <X aria-hidden="true" className="h-5 w-5" />
          </button>
          <div className="mb-6 inline-flex h-12 w-12 items-center justify-center rounded-full bg-surface-muted text-secondary">
            <ShieldCheck aria-hidden="true" className="h-6 w-6" />
          </div>
          <p className="text-sm font-semibold text-secondary">
            {isSignup ? 'Join our community' : 'Welcome back'}
          </p>
          <h1
            className="mt-1 font-serif text-3xl font-semibold text-text-main"
            id="auth-heading"
          >
            {isSignup ? 'Create your account' : 'Log in to SkillBridge'}
          </h1>
          <p className="mt-2 text-sm leading-6 text-text-secondary">
            {isSignup
              ? 'Create a local demo profile to join the SkillBridge community.'
              : 'Log in to your demo profile using its email address.'}
          </p>

          <form className="mt-7 space-y-4" onSubmit={handleSubmit}>
            {isSignup && (
              <>
                <label className="block text-sm font-medium text-text-main">
                  Full name
                  <input
                    autoComplete="name"
                    className={inputClass}
                    name="name"
                    placeholder="Your full name"
                    required
                  />
                </label>
              </>
            )}

            <label className="block text-sm font-medium text-text-main">
              Email address
              <input
                autoComplete="email"
                className={inputClass}
                id="auth-email"
                name="email"
                placeholder="you@example.com"
                required
                type="email"
              />
            </label>

            {!isSignup && (
              <div className="rounded-lg border border-border bg-background p-3">
                <p className="text-xs font-semibold text-text-main">
                  Demo profiles
                </p>
                <ul className="mt-2 space-y-1">
                  {demoUsers.users.map((user) => (
                    <li className="text-xs text-text-secondary" key={user.id}>
                      <button
                        className="text-left underline decoration-border underline-offset-2 hover:text-primary hover:decoration-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary"
                        onClick={() => {
                          const emailInput = document.getElementById('auth-email')
                          if (emailInput) emailInput.value = user.email
                        }}
                        type="button"
                      >
                        {user.name} · {user.email}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <p className="text-xs leading-5 text-text-muted">
              Demo-only email sign-in. No password is requested or stored.
              Profiles are stored only in this browser.
            </p>

            {notice && (
              <p
                aria-live="polite"
                className={`rounded-lg border px-3.5 py-3 text-sm leading-5 ${
                  noticeIsError
                    ? 'border-error/30 bg-red-50 text-error'
                    : 'border-border bg-background text-text-secondary'
                }`}
                role={noticeIsError ? 'alert' : 'status'}
              >
                {notice}
              </p>
            )}

            <button
              className="inline-flex min-h-12 w-full items-center justify-center rounded-lg bg-primary px-5 py-3 font-semibold text-white transition hover:bg-primary-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary focus-visible:ring-offset-2"
              type="submit"
            >
              {isSignup ? 'Create account' : 'Log in'}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-text-secondary">
            {isSignup ? 'Already have an account?' : 'New to SkillBridge?'}{' '}
            <button
              className="font-semibold text-primary underline decoration-border underline-offset-4 hover:decoration-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary"
              onClick={() => onModeChange(isSignup ? 'login' : 'signup')}
              type="button"
            >
              {isSignup ? 'Log in' : 'Create an account'}
            </button>
          </p>
          <p className="mt-4 text-center text-xs text-text-muted">
            {isSignup
            ? 'Profile creation does not require a password in this demo.'
            : 'This demo sign-in is not secure authentication.'}
          </p>
      </section>
    </div>
  )
}

export default AuthPage
