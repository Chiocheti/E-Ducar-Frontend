import {
  Control,
  FieldErrors,
  useFieldArray,
  UseFormRegister,
} from 'react-hook-form';
import { UpdateCourseType } from './CourseUpdateComp';

export default function LessonsUpdate({
  control,
  register,
  errors,
}: {
  control: Control<UpdateCourseType>;
  register: UseFormRegister<UpdateCourseType>;
  errors: FieldErrors<UpdateCourseType>;
}) {
  const {
    fields: fieldsLessons,
    append: appendLesson,
    remove: removeLesson,
  } = useFieldArray({
    control,
    name: 'lessons',
  });

  function addNewLesson() {
    appendLesson({
      title: '',
      description: '',
      videoLink: '',
    });
  }

  return (
    <>
      {fieldsLessons.map((field, index) => (
        <div
          key={field.id}
          style={{
            display: 'flex',
            gap: '1vw',
            backgroundColor: index % 2 === 0 ? '#c2c2c2' : '#e8e8e8',
            borderRadius: '20px',
            padding: '10px',
            alignItems: 'center',
          }}
        >
          <div>
            <button
              onClick={() => removeLesson(index)}
              style={{
                backgroundColor: 'red',
                color: 'white',
              }}
            >
              DELETAR
            </button>
          </div>

          <div style={{ width: '100%' }}>
            <p style={{ margin: 0 }}>Nome da Aula</p>
            <input
              type="text"
              placeholder="Nome da Aula"
              style={{ width: '100%' }}
              {...register(`lessons.${index}.title`)}
            />
            <p style={{ color: 'red' }}>
              {errors.lessons?.[index]?.title?.message}
            </p>
          </div>

          <div style={{ width: '100%' }}>
            <p style={{ margin: 0 }}>Details</p>
            <input
              type="text"
              placeholder="Detalhes"
              style={{ width: '100%' }}
              {...register(`lessons.${index}.description`)}
            />
            <p style={{ color: 'red' }}>
              {errors.lessons?.[index]?.description?.message}
            </p>
          </div>

          <div style={{ width: '100%' }}>
            <p style={{ margin: 0 }}>URL do Video</p>
            <input
              type="text"
              placeholder="URL"
              style={{ width: '100%' }}
              {...register(`lessons.${index}.videoLink`)}
            />
            <p style={{ color: 'red' }}>
              {errors.lessons?.[index]?.videoLink?.message}
            </p>
          </div>
        </div>
      ))}

      <button
        onClick={addNewLesson}
        style={{
          width: '100%',
          backgroundColor: 'green',
          color: 'white',
        }}
      >
        Adicionar Aula
      </button>
    </>
  );
}
