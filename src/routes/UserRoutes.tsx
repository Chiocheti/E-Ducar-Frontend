import { Routes as Switch, Route } from 'react-router-dom';
import UserLogin from '../pages/Users/UserLogin';
import UserCreate from '../pages/Users/UserCreate';
import UserUpdate from '../pages/Users/UserUpdate';
import UserPerfil from '../pages/Users/UserPerfil';
import CourseCreate from '../pages/Courses/CourseCreate';
import CourseUpdate from '../pages/Courses/CourseUpdate';
import Private from './UserPrivate';
import CollaboratorsCreate from '../pages/Collaborators/CollaboratorsCreate';
import CollaboratorsUpdate from '../pages/Collaborators/CollaboratorsUpdate';
import TicketCreate from '../pages/Tickets/TicketCreate';

export default function UserRoutes() {
  return (
    <Switch>
      <Route path="/" element={<UserLogin />} />

      <Route
        path="/UserCreate"
        element={
          <Private>
            <UserCreate />
          </Private>
        }
      />

      <Route
        path="/UserUpdate"
        element={
          <Private>
            <UserUpdate />
          </Private>
        }
      />

      <Route
        path="/UserPerfil"
        element={
          <Private>
            <UserPerfil />
          </Private>
        }
      />

      <Route
        path="/CourseCreate"
        element={
          <Private>
            <CourseCreate />
          </Private>
        }
      />

      <Route
        path="/CourseUpdate"
        element={
          <Private>
            <CourseUpdate />
          </Private>
        }
      />

      <Route
        path="/CollaboratorCreate"
        element={
          <Private>
            <CollaboratorsCreate />
          </Private>
        }
      />

      <Route
        path="/CollaboratorUpdate"
        element={
          <Private>
            <CollaboratorsUpdate />
          </Private>
        }
      />

      <Route
        path="/TicketsCreate"
        element={
          <Private>
            <TicketCreate />
          </Private>
        }
      />
    </Switch>
  );
}
