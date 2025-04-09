import {
  Control,
  FieldErrors,
  useFieldArray,
  UseFormRegister,
} from 'react-hook-form';
import { UpdateCourseType } from './CourseUpdateComp';
import QuestionOptionsUpdate from './QuestionOptionsUpdate';

export default function QuestionsUpdate({
  examIndex,
  control,
  register,
  errors,
}: {
  examIndex: number;
  control: Control<UpdateCourseType>;
  register: UseFormRegister<UpdateCourseType>;
  errors: FieldErrors<UpdateCourseType>;
}) {
  const {
    fields: fieldsQuestions,
    append: appendQuestion,
    remove: removeQuestion,
  } = useFieldArray({
    control,
    name: `exams.${examIndex}.questions`,
  });

  function addNewQuestion() {
    appendQuestion({
      question: '',
      order: 0,
      questionOptions: [
        {
          answer: '',
          isAnswer: false,
          order: 0,
        },
      ],
    });
  }

  return (
    <>
      {fieldsQuestions.map((field, index) => (
        <div key={field.id} style={{ width: '100%' }}>
          <div style={{ display: 'flex', gap: '1vw' }}>
            <div>
              <button
                onClick={() => removeQuestion(index)}
                style={{
                  backgroundColor: 'red',
                  color: 'white',
                }}
              >
                DELETAR
              </button>
            </div>

            <div style={{ width: '100%' }}>
              <p style={{ margin: 0 }}>Pergunta {index + 1}:</p>
              <input
                type="text"
                placeholder="Pergunta"
                style={{ width: '100%' }}
                {...register(`exams.${examIndex}.questions.${index}.question`)}
              />
              <p style={{ color: 'red' }}>
                {
                  errors.exams?.[examIndex]?.questions?.[index]?.question
                    ?.message
                }
              </p>
            </div>
          </div>

          <div>
            <QuestionOptionsUpdate
              examIndex={examIndex}
              questionIndex={index}
              control={control}
              register={register}
              errors={errors}
            />
          </div>
        </div>
      ))}

      <button
        onClick={addNewQuestion}
        style={{
          width: '100%',
          backgroundColor: 'green',
          color: 'white',
        }}
      >
        Adicionar Pergunta
      </button>
    </>
  );
}
