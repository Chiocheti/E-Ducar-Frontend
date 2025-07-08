import { useContext, useEffect, useState } from 'react';
import { api } from '../../services/api';
import moment from 'moment';
import CourseItem from '../../components/StudentRegistration/CourseItem';
import StudentNavbar from '../../components/StudentNavbar';
import { StudentContext } from '../../contexts/StudentContext';
import { CourseType } from '../../types/CourseTypes';
import { ApiResponse } from '../../types/ApiTypes';

export default function StudentRegistration() {
  const context = useContext(StudentContext);
  if (!context) throw new Error('Falta contexto');
  const { tokens, student, updateStudent } = context;

  const [courses, setCourses] = useState<CourseType[]>([]);

  useEffect(() => {
    async function getData() {
      try {
        const {
          data: { success, type, data },
        } = await api.get<ApiResponse>('/courses/getOpen', {
          headers: {
            'x-access-token': tokens?.accessToken,
          },
        });

        if (!success) {
          switch (type) {
            case 1:
              console.log(JSON.parse(data));
              return console.log('Houve um erro interno');
            case 2:
              console.log(JSON.parse(data));
              return console.log('Houve um erro interno');
            case 3:
              return console.log(data);
          }
        }

        const parsedData: CourseType[] = JSON.parse(data);

        setCourses(parsedData);
      } catch (error) {
        console.log(error);
      }
    }

    getData();
  }, [tokens]);

  async function subscribe(
    courseId: string,
    ticket: string | null,
    support: number,
  ) {
    try {
      const registration = {
        studentId: student?.id,
        courseId,
        registerDate: moment().format('YYYY-MM-DD'),
        supportDate: moment().add(support, 'months').format('YYYY-MM-DD'),
      };

      const {
        data: { success, type, data },
      } = await api.post<ApiResponse>(
        '/registrations/create',
        { registration, ticket },
        {
          headers: {
            'x-access-token': tokens?.accessToken,
          },
        },
      );

      if (!success) {
        switch (type) {
          case 1:
            console.log(JSON.parse(data));
            return console.log('Houve um erro interno');
          case 2:
            console.log(JSON.parse(data));
            return console.log('Houve um erro interno');
          case 3:
            return console.log(data);
        }
      }

      updateStudent();

      return console.log(data);
    } catch (error) {
      return console.log(error);
    }
  }

  return (
    <>
      <StudentNavbar />

      <div style={{ display: 'flex' }}>
        {courses.map((course) => (
          <CourseItem key={course.id} course={course} subscribe={subscribe} />
        ))}
      </div>
    </>
  );
}
