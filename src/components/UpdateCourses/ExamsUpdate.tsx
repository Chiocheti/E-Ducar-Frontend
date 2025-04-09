import {
  Control,
  FieldErrors,
  useFieldArray,
  UseFormRegister,
} from 'react-hook-form';
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
  const {
    fields: fieldsExams,
    append: appendExam,
    remove: removeExam,
  } = useFieldArray({
    control,
    name: 'exams',
  });

  function addNewExam() {
    appendExam({
      title: '',
      description: '',
      order: 0,
      questions: [
        {
          question: '',
          order: 0,
          questionOptions: [
            {
              answer: '',
              isAnswer: false,
              order: 0,
            },
          ],
        },
      ],
    });
  }

  return (
    <>
      {fieldsExams.map((field, index) => (
        <div
          key={field.id}
          style={{
            backgroundColor: index % 2 === 0 ? '#c2c2c2' : '#e8e8e8',
            borderRadius: '20px',
            padding: '10px',
            alignItems: 'center',
          }}
        >
          <div style={{ display: 'flex', gap: '1vw' }}>
            <div>
              <button
                onClick={() => removeExam(index)}
                style={{
                  backgroundColor: 'red',
                  color: 'white',
                }}
              >
                DELETAR
              </button>
            </div>

            <div style={{ width: '100%' }}>
              <p style={{ margin: 0 }}>Titulo da Prova</p>
              <input
                type="text"
                placeholder="Titulo"
                style={{ width: '100%' }}
                {...register(`exams.${index}.title`)}
              />
              <p style={{ color: 'red' }}>
                {errors.exams?.[index]?.title?.message}
              </p>
            </div>

            <div style={{ width: '100%' }}>
              <p style={{ margin: 0 }}>Descrição da Prova</p>
              <input
                type="text"
                placeholder="Descrição"
                style={{ width: '100%' }}
                {...register(`exams.${index}.description`)}
              />
              <p style={{ color: 'red' }}>
                {errors.exams?.[index]?.description?.message}
              </p>
            </div>
          </div>

          <div>
            <QuestionsUpdate
              examIndex={index}
              control={control}
              register={register}
              errors={errors}
            />
          </div>
        </div>
      ))}

      <button
        onClick={addNewExam}
        style={{
          width: '100%',
          backgroundColor: 'green',
          color: 'white',
        }}
      >
        Adicionar Prova
      </button>
    </>
  );
}
