import { Control, FieldErrors, UseFormRegister } from 'react-hook-form';
import { CreateCourseType } from '../../pages/Courses/CourseCreate';
import Questions from './Questions';

export default function Exam({
  control,
  register,
  errors,
}: {
  control: Control<CreateCourseType>;
  register: UseFormRegister<CreateCourseType>;
  errors: FieldErrors<CreateCourseType>;
}) {
  return (
    <div style={{ width: '100vw', justifyItems: 'center' }}>
      <div style={{ borderRadius: '20px', border: '1px solid', width: '50vw' }}>
        <div style={{ justifyItems: 'center' }}>
          <h2>PROVAS</h2>
        </div>
        <div>
          <div style={{ display: 'flex', gap: '1vw', width: '50vw' }}>
            <div style={{ width: '100%' }}>
              <p style={{ margin: 0 }}>Titulo da Prova</p>
              <input
                type="text"
                placeholder="Titulo"
                style={{ width: '100%' }}
                {...register(`exam.title`)}
              />
              <p style={{ color: 'red' }}>{errors.exam?.title?.message}</p>
            </div>

            <div style={{ width: '100%' }}>
              <p style={{ margin: 0 }}>Descrição da Prova</p>
              <input
                type="text"
                placeholder="Descrição"
                style={{ width: '100%' }}
                {...register(`exam.description`)}
              />
              <p style={{ color: 'red' }}>
                {errors.exam?.description?.message}
              </p>
            </div>
          </div>

          <div style={{ width: '50vw' }}>
            <Questions control={control} register={register} errors={errors} />
          </div>
        </div>
      </div>
    </div>
  );
}
