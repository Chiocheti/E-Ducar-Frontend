import { useContext, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { StudentContext } from '../../contexts/StudentContext';
import { ApiResponse } from '../../types/ApiTypes';
import { api } from '../../services/api';
import StudentNavbar from '../../components/StudentNavbar';
import { RegistrationType } from '../../types/RegistrationTypes';
import ReactPlayer from 'react-player';
import { LessonProgressType } from '../../types/LessonProgressTypes';
import moment from 'moment';

export default function StudentCourse() {
  const context = useContext(StudentContext);
  if (!context) throw new Error('Falta contexto');
  const { tokens } = context;

  const navigate = useNavigate();

  const { registrationId } = useParams();
  if (!registrationId) navigate('/student/perfil');

  const [registration, setRegistration] = useState<RegistrationType | null>(
    null,
  );

  const [lessonProgress, setLessonProgress] =
    useState<LessonProgressType | null>(null);
  const [lessonNumber, setLessonNumber] = useState<number>(0);

  const [isPlayerReady, setIsPlayerReady] = useState<boolean>(false);

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

        const registrationData: RegistrationType = JSON.parse(data);

        if (!registrationData) return navigate('/student/perfil');
        if (!registrationData.lessonsProgress) return false;

        setRegistration(registrationData);

        const progress = registrationData.lessonsProgress.find(
          (progress) => progress.watchedAt === null,
        );

        if (progress) {
          const index = registrationData.lessonsProgress.indexOf(progress);
          setLessonNumber(index);
        }

        setLessonProgress(progress || registrationData.lessonsProgress[0]);
      } catch (error) {
        console.log(error);
      }
    }

    getData();
  }, [tokens, registrationId, navigate]);

  async function updateRegistration() {
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

      const parsedData: RegistrationType = JSON.parse(data);

      setRegistration(parsedData);
    } catch (error) {
      console.log(error);
    }
  }

  async function onEnd() {
    if (!lessonProgress) return false;

    if (!lessonProgress.watchedAt) {
      const newLessonProgress = {
        watchedAt: moment().format('YYYY-MM-DD HH:mm:ss'),
      };

      try {
        const {
          data: { success, type, data },
        } = await api.post<ApiResponse>(
          '/registrations/updateLessonProgress',
          { id: lessonProgress.id, lessonProgress: newLessonProgress },
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

        updateRegistration();
      } catch (error) {
        console.log(error);
      }
    }

    if (lessonNumber + 1 === registration?.lessonsProgress?.length) {
      return navigate(`/student/exam/${registrationId}`);
    }

    if (registration?.lessonsProgress) {
      const next = registration?.lessonsProgress[lessonNumber + 1];
      setLessonProgress(next);
    }

    setIsPlayerReady(false);
    setLessonNumber((prev) => prev + 1);
  }

  function changeLesson(newProgress: LessonProgressType | null, index: number) {
    console.log(newProgress);
    console.log(index);

    setLessonProgress(newProgress);
    setLessonNumber(index);
  }

  function onPlayerReady() {
    setIsPlayerReady(true);
  }

  return (
    <div>
      <StudentNavbar />

      {registration && lessonProgress && (
        <h2 style={{ margin: '0px', marginTop: '22vh' }}>
          {registration.course?.name} - {lessonNumber + 1}){' '}
          {lessonProgress.lesson?.title}
        </h2>
      )}

      <div style={{ display: 'flex', margin: '0px' }}>
        <div style={{ width: '70vw', height: '80vh' }}>
          <div style={{ display: isPlayerReady ? 'none' : 'inline' }}>
            <img
              width={'640px'}
              height={'360px'}
              src="https://placehold.co/640x360?text=VIDEO"
              alt=""
            />
          </div>

          <div style={{ display: isPlayerReady ? 'inline' : 'none' }}>
            <ReactPlayer
              url={`https://www.youtube.com/embed/${lessonProgress?.lesson?.videoLink}`}
              width={'640px'}
              height={'360px'}
              controls
              onEnded={onEnd}
              onReady={onPlayerReady}
              playing
            />
          </div>

          <div>
            <p>{lessonProgress?.lesson?.description}</p>
          </div>
        </div>

        <div style={{ width: '30vw' }}>
          {registration?.lessonsProgress &&
            registration?.lessonsProgress.map((progress, index) => (
              <button
                key={progress.id}
                disabled={
                  !progress.watchedAt &&
                  progress !==
                    registration.lessonsProgress?.find(
                      (e) => e.watchedAt === null,
                    )
                }
                onClick={() => changeLesson(progress || null, index)}
                style={{
                  width: index === lessonNumber ? '50%' : '100%',
                  backgroundColor:
                    !progress.watchedAt &&
                    progress !==
                      registration.lessonsProgress?.find(
                        (e) => e.watchedAt === null,
                      )
                      ? '#adadad'
                      : 'green',
                }}
              >
                <h5>{progress.lesson?.title}</h5>
              </button>
            ))}
        </div>
      </div>
    </div>
  );
}
