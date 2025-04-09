import {
  BrowserRouter as Router,
  Routes as Switch,
  Route,
} from 'react-router-dom';
import { UserProvider } from './contexts/UserContext';
import UserRoutes from './routes/UserRoutes';
import StudentRoutes from './routes/StudentRoutes';
import { StudentProvider } from './contexts/StudentContext';

function App() {
  return (
    <Router>
      <Switch>
        <Route
          path="/student/*"
          element={
            <StudentProvider>
              <StudentRoutes />
            </StudentProvider>
          }
        />

        <Route
          path="/adm/*"
          element={
            <UserProvider>
              <UserRoutes />
            </UserProvider>
          }
        />
      </Switch>
    </Router>
  );
}

export default App;
