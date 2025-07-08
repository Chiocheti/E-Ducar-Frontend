import { useContext, useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import moment from 'moment';

import { api } from '../../services/api';

import { StudentContext } from '../../contexts/StudentContext';
import StudentNavbar from '../../components/StudentNavbar';
import shuffleArray from '../../utils/ShuffleArray';

import { RegistrationType } from '../../types/RegistrationTypes';
import { ApiResponse } from '../../types/ApiTypes';
import { ExamType } from '../../types/ExamTypes';

export default function StudentExam() {
  const context = useContext(StudentContext);
  if (!context) throw new Error('Falta contexto');
  const { tokens, student } = context;

  const navigate = useNavigate();

  const { registrationId } = useParams();
  if (!registrationId) navigate('/student/perfil');

  const [exam, setExam] = useState<ExamType | null>(null);

  const [answers, setAnswers] = useState<{ [questionId: string]: string }>({});
  const [isValidated, setIsValidated] = useState<boolean>(false);

  const courseRef = useRef<{
    name: string;
    duration: string;
  } | null>(null);

  useEffect(() => {
    async function getData() {
      try {
        const {
          data: { success, type, data },
        } = await api.post<ApiResponse>(
          '/registrations/getById',
          { registrationId, exam: true },
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

        const { course: courseData }: RegistrationType = JSON.parse(data);

        if (!courseData?.exam?.questions) {
          navigate('/student/perfil');
          return;
        }

        const {
          exam: { questions, ...exam },
        } = courseData;

        const shuffledQuestions = shuffleArray(questions);

        shuffledQuestions.forEach((question) => {
          question.questionOptions = shuffleArray(
            question.questionOptions || [],
          );
        });

        setExam({
          ...exam,
          questions: shuffledQuestions,
        });

        courseRef.current = {
          duration: courseData.duration,
          name: courseData.name,
        };
        return;
      } catch (error) {
        console.log(error);
        return;
      }
    }

    getData();
    return;
  }, [tokens, registrationId, navigate]);

  async function saveExam(examResult: number) {
    const courseData = courseRef.current;

    try {
      const finishData = {
        registerData: {
          id: registrationId,
          examResult,
          conclusionDate: moment().format('YYYY-MM-DD'),
          conclusionDateToPrint: moment().format('DD/MM/YYYY'),
        },
        degreeData: {
          studentName: student?.name,
          courseName: courseData?.name,
          duration: courseData?.duration,
        },
      };

      const {
        data: { success, type, data },
      } = await api.put<ApiResponse>(
        '/registrations/finishCourse',
        { finishData },
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

      console.log('Prova Salva com sucesso');

      // const registrationData: RegistrationType = JSON.parse(data);

      // setExams(registrationData.course?.exams || []);
    } catch (error) {
      console.log(error);
    }
  }

  function validate() {
    if (!exam?.questions) return;

    const { questions } = exam;

    let score = 0;

    questions.forEach(({ questionOptions, ...question }) => {
      const correctOption = questionOptions?.find((option) => option.isAnswer);
      if (!correctOption) return 0;

      if (answers[question.id] === correctOption.id) {
        score += 1;
      }
    });

    const examResult = (score / questions?.length) * 10;

    if (examResult >= 6) {
      saveExam(examResult);
    } else {
      console.log('Tente outra vez');
    }

    setIsValidated(true);
  }

  function handleAnswerChange(questionId: string, optionId: string) {
    setAnswers((prev) => ({ ...prev, [questionId]: optionId }));
  }

  return exam ? (
    <>
      <div>
        <StudentNavbar />

        <div style={{ marginTop: '20vh' }}>
          <div key={exam.id}>
            <h2>{exam.title}</h2>
            <p>{exam.description}</p>

            {exam.questions &&
              exam.questions.map(({ questionOptions, ...question }) => (
                <div key={question.id}>
                  <h3>{question.question}</h3>

                  {questionOptions &&
                    questionOptions.map((option) => (
                      <div key={option.id} style={{ display: 'flex' }}>
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

            <button onClick={validate}>validar</button>
          </div>
        </div>
      </div>
    </>
  ) : null;
}
