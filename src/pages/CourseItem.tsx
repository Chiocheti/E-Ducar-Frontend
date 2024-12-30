import { CourseItemType } from "../types/Courses.types";

export default function CourseItem({ course }: { course: CourseItemType }) {
  return (
    <div style={{ display: 'grid' }}>
      <div>
        <p>Id: {course.id}</p>
      </div>

      <div>
        <p>Professor: {course.userId}</p>
      </div>

      <div>
        <p>Nome: {course.name}</p>
      </div>

      <div>
        <p>Descrição: {course.description}</p>
      </div>

      <div>
        <p>Texto: {course.text}</p>
      </div>

      <div>
        <p>Requisitos: {course.required}</p>
      </div>

      <div>
        <p>Duração: {course.duration}</p>
      </div>

      <div>
        <p>Preço: {course.price}</p>
      </div>

      <div>
        <p>Preço: {course.image}</p>
      </div>

      <img width={'300px'} src={course.image} />
    </div>
  )
}