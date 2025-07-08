import { Control, FieldErrors, UseFormRegister } from 'react-hook-form';
import { UpdateCourseType } from './CourseUpdateComp';
import QuestionsUpdate from './QuestionsUpdate';

export default function ExamsUpdate({
  control,
  register,
  errors,
}: {
  control: Control<UpdateCourseType>;
  register: UseFormRegister<UpdateCourseType>;
  errors: FieldErrors<UpdateCourseType>;
}) {
  return (
    <div
      style={{
        borderRadius: '20px',
        padding: '10px',
        alignItems: 'center',
      }}
    >
      <div style={{ display: 'flex', gap: '1vw' }}>
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
          <p style={{ color: 'red' }}>{errors.exam?.description?.message}</p>
        </div>
      </div>

      <div>
        <QuestionsUpdate
          control={control}
          register={register}
          errors={errors}
        />
      </div>
    </div>
  );
}
