
import React, { useState, useEffect } from 'react'
import { Home, FileText, Heart, BarChart3, User, Wind, Sparkles } from 'lucide-react'
import HomeScreen from './pages/HomeScreen'
import LogScreen from './pages/LogScreen'
import SymptomsScreen from './pages/SymptomsScreen'
import SummaryScreen from './pages/SummaryScreen'
import ProfileScreen from './pages/ProfileScreen'
import ExtrasScreen from './pages/ExtrasScreen'
import LoginScreen from './pages/LoginScreen'
import OnboardingScreen from './pages/OnboardingScreen'

export default function App() {
  const [tab, setTab] = useState('home')
  const [sidebarExpanded, setSidebarExpanded] = useState(false)
  const [currentUser, setCurrentUser] = useState(null)
  const [showOnboarding, setShowOnboarding] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  // Verificar si hay un usuario guardado al cargar la app
  useEffect(() => {
    const savedUser = localStorage.getItem('airaUser')
    if (savedUser) {
      try {
        const user = JSON.parse(savedUser)
        setCurrentUser(user)
        setIsAuthenticated(true)
      } catch (error) {
        console.error('Error al cargar usuario guardado:', error)
        localStorage.removeItem('airaUser')
      }
    }
  }, [])

  const handleLoginSuccess = (userData) => {
    setCurrentUser(userData)
    // Si es un nuevo usuario, mostrar onboarding
    if (userData.isNewUser) {
      setShowOnboarding(true)
    } else {
      // Si es login, ir directo al panel principal
      setIsAuthenticated(true)
    }
  }

  const handleOnboardingComplete = (completeData) => {
    setCurrentUser(completeData)
    setShowOnboarding(false)
    setIsAuthenticated(true)
  }

  const handleLogout = () => {
    localStorage.removeItem('airaUser')
    setCurrentUser(null)
    setIsAuthenticated(false)
    setShowOnboarding(false)
    setTab('home')
  }

  // Si no está autenticado, mostrar login
  if (!isAuthenticated && !showOnboarding) {
    return <LoginScreen onLoginSuccess={handleLoginSuccess} />
  }

  // Si está en proceso de onboarding
  if (showOnboarding) {
    return <OnboardingScreen userData={currentUser} onComplete={handleOnboardingComplete} />
  }

  const renderScreen = () => {
    switch (tab) {
      case 'home':
        return <HomeScreen user={currentUser} />
      case 'log':
        return <LogScreen user={currentUser} />
      case 'symptoms':
        return <SymptomsScreen user={currentUser} />
      case 'summary':
        return <SummaryScreen user={currentUser} />
      case 'extras':
        return <ExtrasScreen user={currentUser} />
      case 'profile':
        return <ProfileScreen user={currentUser} onLogout={handleLogout} />
      default:
        return <HomeScreen user={currentUser} />
    }
  }

  return (
    <div className="app-container">
      {/* Sidebar para desktop/notebook */}
      <aside 
        className={`sidebar ${sidebarExpanded ? 'expanded' : 'collapsed'}`}
        onMouseEnter={() => setSidebarExpanded(true)}
        onMouseLeave={() => setSidebarExpanded(false)}
      >
        <div className="sidebar-header">
          <div className="sidebar-logo">
            <img 
              src={sidebarExpanded ? "/logo_aira.png" : "/log_aira.png"}
              alt="Aira" 
              style={{ 
                width: sidebarExpanded ? '110px' : '36px',
                height: 'auto',
                transition: 'all 300ms ease'
              }}
              className="logo-icon"
            />
          </div>
        </div>

        <nav className="sidebar-nav">
          <button
            className={tab === 'home' ? 'sidebar-btn active' : 'sidebar-btn'}
            onClick={() => setTab('home')}
            title="Inicio"
          >
            <Home className="sidebar-icon" size={22} strokeWidth={2} />
            {sidebarExpanded && <span className="sidebar-text">Inicio</span>}
          </button>
          <button
            className={tab === 'log' ? 'sidebar-btn active' : 'sidebar-btn'}
            onClick={() => setTab('log')}
            title="Registro"
          >
            <FileText className="sidebar-icon" size={22} strokeWidth={2} />
            {sidebarExpanded && <span className="sidebar-text">Registro</span>}
          </button>
          <button
            className={tab === 'symptoms' ? 'sidebar-btn active' : 'sidebar-btn'}
            onClick={() => setTab('symptoms')}
            title="Síntomas"
          >
            <Heart className="sidebar-icon" size={22} strokeWidth={2} />
            {sidebarExpanded && <span className="sidebar-text">Síntomas</span>}
          </button>
          <button
            className={tab === 'summary' ? 'sidebar-btn active' : 'sidebar-btn'}
            onClick={() => setTab('summary')}
            title="Estadísticas"
          >
            <BarChart3 className="sidebar-icon" size={22} strokeWidth={2} />
            {sidebarExpanded && <span className="sidebar-text">Estadísticas</span>}
          </button>
          <button
            className={tab === 'extras' ? 'sidebar-btn active' : 'sidebar-btn'}
            onClick={() => setTab('extras')}
            title="Extras"
          >
            <Sparkles className="sidebar-icon" size={22} strokeWidth={2} />
            {sidebarExpanded && <span className="sidebar-text">Extras</span>}
          </button>
          <button
            className={tab === 'profile' ? 'sidebar-btn active' : 'sidebar-btn'}
            onClick={() => setTab('profile')}
            title="Perfil"
          >
            <User className="sidebar-icon" size={22} strokeWidth={2} />
            {sidebarExpanded && <span className="sidebar-text">Perfil</span>}
          </button>
        </nav>

        <div className="sidebar-footer">
          {sidebarExpanded && (
            <div className="sidebar-footer-content">
              <p className="sidebar-footer-text">Versión 1.0.0</p>
            </div>
          )}
        </div>
      </aside>

      {/* Contenido principal */}
      <div className="main-content">
        <div className="screen-container">
          {renderScreen()}
        </div>

        {/* Navegación inferior para móvil */}
        <nav className="bottom-nav">
          <button
            className={tab === 'home' ? 'nav-btn active' : 'nav-btn'}
            onClick={() => setTab('home')}
            aria-label="Inicio"
          >
            <Home className="nav-icon" size={24} strokeWidth={2} />
            <span className="nav-text">Inicio</span>
          </button>
          <button
            className={tab === 'log' ? 'nav-btn active' : 'nav-btn'}
            onClick={() => setTab('log')}
            aria-label="Registro"
          >
            <FileText className="nav-icon" size={24} strokeWidth={2} />
            <span className="nav-text">Registro</span>
          </button>
          <button
            className={tab === 'symptoms' ? 'nav-btn active' : 'nav-btn'}
            onClick={() => setTab('symptoms')}
            aria-label="Síntomas"
          >
            <Heart className="nav-icon" size={24} strokeWidth={2} />
            <span className="nav-text">Síntomas</span>
          </button>
          <button
            className={tab === 'summary' ? 'nav-btn active' : 'nav-btn'}
            onClick={() => setTab('summary')}
            aria-label="Estadísticas"
          >
            <BarChart3 className="nav-icon" size={24} strokeWidth={2} />
            <span className="nav-text">Estadísticas</span>
          </button>
          <button
            className={tab === 'extras' ? 'nav-btn active' : 'nav-btn'}
            onClick={() => setTab('extras')}
            aria-label="Extras"
          >
            <Sparkles className="nav-icon" size={24} strokeWidth={2} />
            <span className="nav-text">Extras</span>
          </button>
          <button
            className={tab === 'profile' ? 'nav-btn active' : 'nav-btn'}
            onClick={() => setTab('profile')}
            aria-label="Perfil"
          >
            <User className="nav-icon" size={24} strokeWidth={2} />
            <span className="nav-text">Perfil</span>
          </button>
        </nav>
      </div>
    </div>
  )
}
