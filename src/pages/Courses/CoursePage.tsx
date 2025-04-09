import { useContext, useEffect, useState } from 'react';
import { UserContext } from '../../contexts/UserContext';
import AdmNavbar from '../../components/AdmNavbar';
import CourseItem from '../../components/UpdateCourses/CourseItem';
import CourseUpdateComp from '../../components/UpdateCourses/CourseUpdateComp';
import { api } from '../../services/api';
import { ApiResponse } from '../../types/ApiTypes';
import { CourseType } from '../../types/CourseTypes';
import { useParams } from 'react-router-dom';
import { StudentContext } from '../../contexts/StudentContext';

export default function CoursePage() {
  const context = useContext(StudentContext);

  if (!context) throw new Error('Falta contexto');
  const { tokens } = context;

  const { courseName } = useParams();

  const [courses, setCourses] = useState<CourseType[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<CourseType | null>(null);

  useEffect(() => {
    async function getData() {
      try {
        const {
          data: { success, type, data },
        } = await api.post<ApiResponse>(
          '/courses/getByName',
          { courseName },
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

        const parsedCourse: CourseType = JSON.parse(data);

        console.log(parsedCourse);

        // setCourses(parsedCourses);
      } catch (error) {
        console.log(error);
      }
    }

    getData();
  }, [tokens, courseName]);

  async function actualizeList() {
    try {
      const {
        data: { success, type, data },
      } = await api.get<ApiResponse>('/courses/getAll', {
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

      setSelectedCourse(null);
      setCourses(parsedData);
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <>
      {/* <AdmNavbar />

      <div style={{
        display: 'flex',
        width: '100vw',
        marginTop: '21vh',
      }}>
        <div style={{ width: '15%', justifyItems: 'center' }}>
          {
            courses.map((course) => (
              <CourseItem
                key={course.id}
                course={course}
                setSelectedCourse={setSelectedCourse}
                actualizeList={actualizeList}
              />
            ))
          }
        </div>

        {
          selectedCourse && (
            <div style={{ width: '85%' }}>
              <CourseUpdateComp course={selectedCourse} actualizeList={actualizeList} />
            </div>
          )
        }
      </div> */}
    </>
  );
}
