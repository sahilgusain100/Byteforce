import { useCallback, useMemo, useState } from 'react'
import AuthPage from '../pages/AuthPage'
import {
  clearSessionUser,
  readSessionUser,
  saveSessionUser,
} from '../utils/user-storage'
import { AuthDialogContext } from './auth-dialog-context'

const AuthDialogProvider = ({ children }) => {
  const [mode, setMode] = useState(null)
  const [currentUser, setCurrentUser] = useState(() => readSessionUser())
  const openAuth = useCallback((authMode) => setMode(authMode), [])
  const closeAuth = useCallback(() => setMode(null), [])
  const authenticate = useCallback((user) => {
    saveSessionUser(user)
    setCurrentUser(user)
    setMode(null)
  }, [])
  const logout = useCallback(() => {
    clearSessionUser()
    setCurrentUser(null)
  }, [])
  const value = useMemo(
    () => ({ openAuth, currentUser, authenticate, logout }),
    [openAuth, currentUser, authenticate, logout],
  )

  return (
    <AuthDialogContext.Provider value={value}>
      {children}
      {mode && (
        <AuthPage
          key={mode}
          mode={mode}
          onAuthenticate={authenticate}
          onClose={closeAuth}
          onModeChange={setMode}
        />
      )}
    </AuthDialogContext.Provider>
  )
}

export default AuthDialogProvider
