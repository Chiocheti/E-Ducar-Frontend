import { BrowserRouter as Router } from 'react-router-dom'
import Routes from './routes'
import { AuthProvider } from './contexts/AuthContext'

function App() {

  return (
    <Router>
      <AuthProvider>
        <Routes />
      </AuthProvider>
    </Router>
  )
}

export default App
