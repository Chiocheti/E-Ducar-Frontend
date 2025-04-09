import {
  Control,
  FieldErrors,
  useFieldArray,
  UseFormRegister,
} from 'react-hook-form';
import { UpdateCourseType } from './CourseUpdateComp';

export default function QuestionOptionsUpdate({
  examIndex,
  questionIndex,
  control,
  register,
  errors,
}: {
  examIndex: number;
  questionIndex: number;
  control: Control<UpdateCourseType>;
  register: UseFormRegister<UpdateCourseType>;
  errors: FieldErrors<UpdateCourseType>;
}) {
  const {
    fields: fieldsQuestionOptions,
    append: appendQuestionOption,
    remove: removeQuestionOption,
  } = useFieldArray({
    control,
    name: `exams.${examIndex}.questions.${questionIndex}.questionOptions`,
  });

  function addNewExam() {
    appendQuestionOption({
      answer: '',
      isAnswer: false,
      order: 0,
    });
  }

  const abc = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

  return (
    <>
      {fieldsQuestionOptions.map((field, index) => (
        <div
          key={field.id}
          style={{ display: 'flex', gap: '1vw', alignItems: 'center' }}
        >
          <div>
            <button
              onClick={() => removeQuestionOption(index)}
              style={{
                backgroundColor: 'red',
                color: 'white',
              }}
            >
              DELETAR
            </button>
          </div>

          <div style={{ width: '100%' }}>
            <p style={{ margin: 0 }}>Resposta {abc[index]})</p>
            <input
              type="text"
              placeholder="Titulo"
              style={{ width: '100%' }}
              {...register(
                `exams.${examIndex}.questions.${questionIndex}.questionOptions.${index}.answer`,
              )}
            />
            <p style={{ color: 'red' }}>
              {errors.exams?.[examIndex]?.questions?.[index]?.question?.message}
            </p>
          </div>

          <div>
            <input
              type="checkbox"
              {...register(
                `exams.${examIndex}.questions.${questionIndex}.questionOptions.${index}.isAnswer`,
              )}
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
        Adicionar Resposta
      </button>
    </>
  );
}
