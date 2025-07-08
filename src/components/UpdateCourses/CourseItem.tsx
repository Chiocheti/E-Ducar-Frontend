import { useContext } from 'react';

import { UserContext } from '../../contexts/UserContext';
import { api } from '../../services/api';
import { CourseType } from '../../types/CourseTypes';
import { ApiResponse } from '../../types/ApiTypes';

export default function CourseItem({
  course,
  setSelectedCourse,
  actualizeList,
}: {
  course: CourseType;
  setSelectedCourse: (course: CourseType) => void;
  actualizeList: () => void;
}) {
  const context = useContext(UserContext);
  if (!context) throw new Error('Falta contexto');
  const { tokens } = context;

  async function updateIsVisible(isVisible: boolean) {
    try {
      const {
        data: { success, type, data },
      } = await api.put<ApiResponse>(
        '/courses/update',
        { course: { id: course.id, isVisible: !isVisible } },
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

      actualizeList();
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div>
      <img
        src={course.image}
        style={{
          height: '200px',
          width: '200px',
          objectFit: 'cover',
          borderRadius: '20px',
          cursor: 'pointer',
        }}
        onClick={() => setSelectedCourse(course)}
      />
      <div style={{ width: '100%' }}>
        <button
          onClick={() => updateIsVisible(course.isVisible)}
          style={{
            color: course.isVisible ? 'green' : 'red',
            width: '100%',
          }}
        >
          {course.isVisible ? 'ATIVO' : 'NÃO ATIVO'}
        </button>
      </div>
    </div>
  );
}
