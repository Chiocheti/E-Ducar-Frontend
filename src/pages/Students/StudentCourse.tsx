import moment from 'moment';
import ReactPlayer from 'react-player';
import { useNavigate, useParams } from 'react-router-dom';
import { useCallback, useContext, useEffect, useState } from 'react';

import { api } from '../../services/api';
import { StudentContext } from '../../contexts/StudentContext';

import StudentNavbar from '../../components/StudentNavbar';

import { ApiResponse } from '../../types/ApiTypes';
import { RegistrationType } from '../../types/RegistrationTypes';
import { LessonProgressType } from '../../types/LessonProgressTypes';

export default function StudentCourse() {
  const context = useContext(StudentContext);
  if (!context) throw new Error('Falta contexto');
  const { tokens } = context;

  const navigate = useNavigate();

  const { registrationId } = useParams();
  if (!registrationId) navigate('/student/perfil');

  const [courseName, setCourseName] = useState<string>('');

  const [currentLesson, setCurrentLesson] = useState<LessonProgressType | null>(
    null,
  );
  const [lessonList, setLessonList] = useState<LessonProgressType[]>([]);

  const [isPlayerReady, setIsPlayerReady] = useState<boolean>(false);

  const concludeLesson = useCallback(
    async (id: string, watchedAt: string) => {
      const lessonProgress = { watchedAt };

      try {
        const {
          data: { success, type, data },
        } = await api.put<ApiResponse>(
          '/registrations/updateLessonProgress',
          { id, lessonProgress },
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
      } catch (error) {
        console.log(error);
      }
    },
    [tokens],
  );

  const getRegistration = useCallback(async () => {
    try {
      const {
        data: { success, type, data },
      } = await api.post<ApiResponse>(
        '/registrations/getById',
        { registrationId, lessonProgress: true },
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
            console.log('Houve um erro interno');
            return null;
          case 2:
            console.log(JSON.parse(data));
            console.log('Houve um erro interno');
            return null;
          case 3:
            console.log(data);
            return null;
        }
      }

      const registrationData: RegistrationType = JSON.parse(data);

      if (!registrationData || !registrationData?.lessonsProgress) {
        navigate('/student/perfil');
        return null;
      }

      return registrationData;
    } catch (error) {
      console.log(error);
      return null;
    }
  }, [navigate, registrationId, tokens]);

  useEffect(() => {
    async function setData() {
      const registration = await getRegistration();

      if (!registration?.lessonsProgress || !registration?.course) {
        navigate('/student/perfil');
        return null;
      }

      const { lessonsProgress, course } = registration;

      let lastWatched = lessonsProgress.findLast((p) => p.watchedAt);

      if (!lastWatched) {
        const now = moment().format('YYYY-MM-DD HH:mm:ss');

        lastWatched = { ...lessonsProgress[0], watchedAt: now };

        await concludeLesson(lastWatched.id, now);

        lessonsProgress[0] = lastWatched;
      }

      setCourseName(course.name);
      setLessonList(lessonsProgress);
      setCurrentLesson(lastWatched);
    }

    setData();
  }, [getRegistration, navigate, concludeLesson]);

  async function goTo(newLesson: LessonProgressType) {
    setIsPlayerReady(false);

    let updateLesson = newLesson;

    if (!newLesson.watchedAt) {
      const now = moment().format('YYYY-MM-DD HH:mm:ss');
      await concludeLesson(newLesson.id, now);

      updateLesson = { ...newLesson, watchedAt: now };

      setLessonList((prevList) =>
        prevList.map((lesson) =>
          lesson.id === updateLesson.id ? updateLesson : lesson,
        ),
      );
    }

    setCurrentLesson(updateLesson);
  }

  function onVideoEnd() {
    if (!currentLesson) return false;

    const currentIndex = lessonList.findIndex(
      (lesson) => lesson.id === currentLesson.id,
    );

    const nextLesson = lessonList[currentIndex + 1];

    if (nextLesson) {
      goTo(nextLesson);
    }
  }

  function onPlayerReady() {
    setIsPlayerReady(true);
  }

  return currentLesson && lessonList ? (
    <div>
      <StudentNavbar />

      <h2 style={{ margin: '0px', marginTop: '22vh' }}>
        {courseName} - {currentLesson.lesson?.title}
      </h2>

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
              url={`https://www.youtube.com/embed/${currentLesson?.lesson?.videoLink}`}
              width={'640px'}
              height={'360px'}
              controls
              onEnded={onVideoEnd}
              onReady={onPlayerReady}
              playing
            />
          </div>

          <div>
            <p>{currentLesson?.lesson?.description}</p>
          </div>
        </div>

        <div style={{ width: '30vw' }}>
          {lessonList.map((progress) => (
            <button
              key={progress.id}
              style={{
                width: '100%',
                backgroundColor: !progress.watchedAt ? '#adadad' : 'green',
              }}
              onClick={() => {
                if (progress.id !== currentLesson.id) {
                  goTo(progress);
                }
              }}
            >
              <h5>{progress.lesson?.title}</h5>
            </button>
          ))}
        </div>
      </div>

      {lessonList.every((lesson) => lesson.watchedAt !== null) ? (
        <button onClick={() => navigate(`/student/exam/${registrationId}`)}>
          Fazer Prova
        </button>
      ) : null}
    </div>
  ) : null;
}
