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
import { PerfilMetaScreen } from '../screens/PerfilMetaScreen'
import { GoalEstablishedScreen } from '../screens/GoalEstablishedScreen'
import { IncentivesScreen } from '../screens/IncentivesScreen'
import { ProfileInfoScreen } from '../screens/ProfileInfoScreen'
import { QuickConnectScreen } from '../screens/QuickConnectScreen'
import { ChangePasswordScreen } from '../screens/ChangePasswordScreen'
import { EmergencyWithdrawalScreen } from '../screens/EmergencyWithdrawalScreen'
import { SettingsScreen } from '../screens/SettingsScreen'
import { DataProfile } from '../screens/DataProfile'
import { DataAccount } from '../screens/DataAccount'
import { DepositsScreen } from '../screens/DepositsScreen'
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
        <AuthScreen
          onVolver={() => navigate('/')}
          onIrADatosPersonales={() => navigate('/datos-personales')}
        />
      } />
      <Route path="/register" element={
        <AuthScreen
          onVolver={() => navigate('/')}
          onIrADatosPersonales={() => navigate('/datos-personales')}
        />
      } />
      <Route path="/datos-personales" element={
        <DataProfile />
      } />
      <Route path="/verificacion-registro" element={
        <VerificacionScreen
          identificador="registro"
          guardarSesion={false}
          onAuth={() => navigate('/perfil-meta')}
          onVolver={() => navigate('/datos-personales')}
        />
      } />
      <Route path="/perfil-meta" element={
        <PerfilMetaScreen />
      } />
      <Route path="/datos-cuenta" element={
        <DataAccount />
      } />
      <Route path="/conexion-rapida" element={
        <QuickConnectScreen />
      } />
      <Route path="/signin-registro" element={
        <SignInScreen
          onVerificar={(email) => { setIdentificador(email); navigate('/verificacion') }}
          onVolver={() => navigate('/')}
          onRegister={() => navigate('/login')}
        />
      } />
      <Route path="/change-password" element={<ChangePasswordScreen />} />
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
      <Route path="/deposits" element={
        estaAutenticado
          ? <DepositsScreen usuario={usuario} onLogout={handleLogout} />
          : <Navigate to="/signin" replace />
      } />
      <Route path="/profile-info" element={
        estaAutenticado
          ? <ProfileInfoScreen />
          : <Navigate to="/signin" replace />
      } />
      <Route path="/settings" element={
        estaAutenticado
          ? <SettingsScreen usuario={usuario} onLogout={handleLogout} />
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
