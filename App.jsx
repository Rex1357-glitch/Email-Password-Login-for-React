import Login from './Login'
import Reset from './Reset'
import { useStytch, useStytchUser } from '@stytch/react'
import { useEffect, useState } from 'react'

export default function App() {
  const [passwordResetToken, setPasswordResetToken] = useState('')
  const [error, setError] = useState('')
  const { user } = useStytchUser()
  const stytch = useStytch()

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');
    const tokenType = params.get('stytch_token_type');

    const authenticateMagicLink = async () => {
      try {
        await stytch.magicLinks.authenticate(token, { session_duration_minutes: 60 })
      } catch (err) {
        setError(err.error_message)
      }
    }

    if (token && tokenType === 'reset_password') {
      setPasswordResetToken(token);
    }

    if (token && tokenType === 'login') {
      authenticateMagicLink()
    }
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');
    if (user && token) {
      window.location.replace('/')
    }
  }, [user])

  if (user) {
    return (
      <div>
        <p>Welcome, {user.user_id}</p>
        <button onClick={() => stytch.session.revoke()}>Log out</button>
      </div>
    )
  } else if (passwordResetToken) {
    return <Reset passwordResetToken={passwordResetToken} />
  } else {
    return (
      <>
        {error && <h3>{error}</h3>}
        <Login />
      </>
    )
  }
}
