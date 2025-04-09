import { useContext, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { StudentContext } from '../../contexts/StudentContext';
import { api } from '../../services/api';
import { ApiResponse } from '../../types/ApiTypes';
import { RegistrationType } from '../../types/RegistrationTypes';
import StudentNavbar from '../../components/StudentNavbar';
import { ExamType } from '../../types/ExamTypes';
import { QuestionOptionType } from '../../types/QuestionsOptionsTypes';
import { StudentAnswerType } from '../../types/StudentAnswers';

export default function StudentExam() {
  const context = useContext(StudentContext);
  if (!context) throw new Error('Falta contexto');
  const { tokens } = context;

  const navigate = useNavigate();

  const { registrationId } = useParams();
  if (!registrationId) navigate('/student/perfil');

  const [exams, setExams] = useState<ExamType[]>([]);
  const [answers, setAnswers] = useState<{ [questionId: string]: string }>({});
  const [isValidated, setIsValidated] = useState<boolean>(false);

  useEffect(() => {
    async function getData() {
      try {
        const {
          data: { success, type, data },
        } = await api.post<ApiResponse>(
          '/registrations/getById',
          { registrationId },
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

        if (!data) {
          navigate('/student/perfil');
          return;
        }

        const registrationData: RegistrationType = JSON.parse(data);

        setExams(registrationData.course?.exams || []);
        return;
      } catch (error) {
        console.log(error);
        return;
      }
    }

    if (!registrationId) {
      navigate('/student/perfil');
      return;
    }

    getData();
    return;
  }, [tokens, registrationId, navigate]);

  async function saveExam(studentAnswers: StudentAnswerType[]) {
    try {
      const {
        data: { success, type, data },
      } = await api.post<ApiResponse>(
        '/registrations/createStudentAnswer',
        { studentAnswers },
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

      // const registrationData: RegistrationType = JSON.parse(data);

      // setExams(registrationData.course?.exams || []);
    } catch (error) {
      console.log(error);
    }
  }

  function validate(examIndex: number) {
    if (!registrationId) return navigate('/student/perfil');

    let score = 0;

    const studentAnswers: StudentAnswerType[] = [];

    exams[examIndex].questions?.forEach(({ questionOptions, ...question }) => {
      const correctly = questionOptions?.find(
        (option) => option.isAnswer === true,
      );
      if (!correctly) return 0;

      if (answers[question.id] === correctly.id) {
        score += 1;
      }
      studentAnswers.push({
        registrationId: registrationId,
        examId: exams[examIndex].id,
        questionId: question.id,
        questionOptionId: answers[question.id],
      });
    });

    console.log((score / exams[examIndex].questions?.length) * 10);

    saveExam(studentAnswers);
    setIsValidated(true);
  }

  function handleAnswerChange(questionId: string, optionId: string) {
    setAnswers((prev) => ({ ...prev, [questionId]: optionId }));
  }

  function selectColor(option: QuestionOptionType) {
    if (!isValidated) return '';
    if (option.isAnswer) return 'green';
    if (answers[option.questionId] === option.id) return 'red';
    // return 'white';
  }

  return (
    <div>
      <StudentNavbar />

      <div style={{ marginTop: '20vh' }}>
        {exams.map((exam, examIndex) => (
          <div key={exam.id}>
            <h2>{exam.title}</h2>
            <p>{exam.description}</p>
            {exam.questions &&
              exam.questions.map((question) => (
                <div key={question.id}>
                  <h3>{question.question}</h3>
                  {question.questionOptions &&
                    question.questionOptions.map((option) => (
                      <div
                        key={option.id}
                        style={{
                          display: 'flex',
                          backgroundColor: selectColor(option),
                        }}
                      >
                        <input
                          type="radio"
                          name={question.id}
                          value={option.id}
                          disabled={isValidated}
                          checked={answers[question.id] === option.id}
                          onChange={() => {
                            if (!isValidated) {
                              handleAnswerChange(question.id, option.id);
                            }
                          }}
                        />
                        <p>{option.answer}</p>
                      </div>
                    ))}
                </div>
              ))}
            <button onClick={() => validate(examIndex)}>validar</button>
          </div>
        ))}
      </div>
    </div>
  );
}
