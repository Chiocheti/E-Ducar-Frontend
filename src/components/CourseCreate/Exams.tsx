import {
  Control,
  FieldErrors,
  useFieldArray,
  UseFormRegister,
} from 'react-hook-form';
import { CreateCourseType } from '../../pages/Courses/CourseCreate';
import Questions from './Questions';

export default function Exams({
  control,
  register,
  errors,
}: {
  control: Control<CreateCourseType>;
  register: UseFormRegister<CreateCourseType>;
  errors: FieldErrors<CreateCourseType>;
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
    <div style={{ width: '100vw', justifyItems: 'center' }}>
      <div style={{ borderRadius: '20px', border: '1px solid', width: '50vw' }}>
        <div style={{ justifyItems: 'center' }}>
          <h2>PROVAS</h2>
        </div>
        {fieldsExams.map((field, index) => (
          <div
            key={field.id}
            style={{
              backgroundColor: index % 2 === 0 ? 'white' : '#e8e8e8',
            }}
          >
            <div style={{ display: 'flex', gap: '1vw', width: '50vw' }}>
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

            <div style={{ width: '50vw' }}>
              <Questions
                examIndex={index}
                control={control}
                register={register}
                errors={errors}
              />
            </div>
          </div>
        ))}
      </div>

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
    </div>
  );
}
