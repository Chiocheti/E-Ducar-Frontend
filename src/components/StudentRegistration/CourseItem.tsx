import { CourseType } from '../../types/CourseTypes';
import { returnImageLink } from '../../utils/ReturnImageLink';

export default function CourseItem({
  course,
  subscribe,
}: {
  course: CourseType;
  subscribe: (courseId: string, support: number) => void;
}) {
  return (
    <div
      style={{ border: '1px solid green' }}
      onClick={() => subscribe(course.id, course.support)}
    >
      <img
        width={'100px'}
        src={
          course.image
            ? returnImageLink(course.image)
            : 'https://placehold.co/130x130?text=FOTO'
        }
      />
      <p>Nome: {course.name}</p>
      <p>Descrição: {course.description}</p>
      <p>Valor: {course.price}</p>
      <p>Duração: {course.duration}</p>
    </div>
  );
}
