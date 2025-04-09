import { Routes as Switch, Route } from 'react-router-dom';

import StudentPage from '../pages/Students/StudentPage';
import StudentRegistration from '../pages/Students/StudentRegistration';
import StudentPrivate from './StudentPrivate';
import StudentPerfil from '../pages/Students/StudentPerfil';
import CoursePage from '../pages/Courses/CoursePage';
import StudentCourse from '../pages/Students/StudentCourse';
import StudentExam from '../pages/Students/StudentExam';

export default function StudentRoutes() {
  return (
    <Switch>
      <Route path="/" element={<StudentPage />} />
      <Route
        path="/registration"
        element={
          <StudentPrivate>
            <StudentRegistration />
          </StudentPrivate>
        }
      />

      <Route
        path="/perfil"
        element={
          <StudentPrivate>
            <StudentPerfil />
          </StudentPrivate>
        }
      />

      <Route
        path="/cursos/:courseName"
        element={
          <StudentPrivate>
            <CoursePage />
          </StudentPrivate>
        }
      />

      <Route
        path="/class/:registrationId"
        element={
          <StudentPrivate>
            <StudentCourse />
          </StudentPrivate>
        }
      />

      <Route
        path="/exam/:registrationId"
        element={
          <StudentPrivate>
            <StudentExam />
          </StudentPrivate>
        }
      />
    </Switch>
  );
}
