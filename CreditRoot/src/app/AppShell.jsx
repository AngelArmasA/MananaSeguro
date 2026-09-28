// src/app/AppShell.jsx
import { useEffect, useState } from 'react'
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom'
import { AppHeader } from '../components/layout/AppHeader'
import { AppFooter } from '../components/layout/AppFooter'
import { LandingScreen } from '../screens/LandingScreen'
import { AuthScreen } from '../screens/AuthScreen'
import { SignInScreen } from '../screens/SignInScreen'
import { VerificacionScreen } from '../screens/VerificacionScreen'
import { MainScreen } from '../screens/MainScreen'
import { HomeScreen } from '../screens/HomeScreen'
import { DashboardScreen } from '../screens/DashboardScreen'
import { WithdrawalScreen } from '../screens/WithdrawalScreen'
import { ErrorBoundary } from '../components/ErrorBoundary'

function AppLayout({ usuario, onLogout }) {
  return (
    <div className="bg-surface dark:bg-[#0f0e0d] min-h-screen">
      <AppHeader usuario={usuario} onLogout={onLogout} />
      <main>
        <ErrorBoundary>
          <Routes>
            <Route path="/home"       element={<HomeScreen usuario={usuario} />} />
            <Route path="/dashboard"  element={<DashboardScreen />} />
            <Route path="/withdrawal" element={<WithdrawalScreen />} />
            <Route path="/planner"    element={<Navigate to="/dashboard" replace />} />
            <Route path="*"           element={<Navigate to="/home" replace />} />
          </Routes>
        </ErrorBoundary>
      </main>
      <AppFooter />
    </div>
  )
}

export function AppShell() {
  const navigate = useNavigate()

  const [usuario, setUsuario] = useState(() => {
    try {
      const stored = localStorage.getItem('ms_usuario')
      return stored ? JSON.parse(stored) : null
    } catch {
      return null
    }
  })

  // identificador (email) que viene de /signin hacia /verificacion
  const [identificador, setIdentificador] = useState(null)

  useEffect(() => {
    function onStorage(e) {
      if (e.key === 'ms_usuario') {
        setUsuario(e.newValue ? JSON.parse(e.newValue) : null)
      }
    }
    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
  }, [])

  function handleAuth(datos) {
    setUsuario(datos)
    localStorage.setItem('ms_usuario', JSON.stringify(datos))
    navigate('/main')
  }

  function handleLogout() {
    setUsuario(null)
    setIdentificador(null)
    localStorage.removeItem('ms_usuario')
    navigate('/')
  }

  const estaAutenticado = !!usuario

  return (
    <Routes>
      <Route path="/" element={
        <LandingScreen
          onLogin={() => navigate('/signin')}
          onRegister={() => navigate('/login')}
        />
      } />
      <Route path="/login" element={
        estaAutenticado
          ? <Navigate to="/main" replace />
          : <AuthScreen onAuth={handleAuth} onVolver={() => navigate('/')} />
      } />
      <Route path="/register" element={
        estaAutenticado
          ? <Navigate to="/main" replace />
          : <AuthScreen onAuth={handleAuth} onVolver={() => navigate('/')} />
      } />
      <Route path="/signin" element={
        estaAutenticado
          ? <Navigate to="/main" replace />
          : <SignInScreen
              onVerificar={(email) => { setIdentificador(email); navigate('/verificacion') }}
              onVolver={() => navigate('/')}
              onRegister={() => navigate('/login')}
            />
      } />
      <Route path="/verificacion" element={
        estaAutenticado
          ? <Navigate to="/main" replace />
          : identificador
            ? <VerificacionScreen
                identificador={identificador}
                onAuth={handleAuth}
                onVolver={() => navigate('/signin')}
              />
            : <Navigate to="/signin" replace />
      } />
      <Route path="/main" element={
        estaAutenticado
          ? <MainScreen usuario={usuario} onLogout={handleLogout} />
          : <Navigate to="/signin" replace />
      } />
      <Route path="/*" element={
        estaAutenticado
          ? <Navigate to="/main" replace />
          : <Navigate to="/signin" replace />
      } />
    </Routes>
  )
}
