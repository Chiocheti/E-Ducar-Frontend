import { LessonType } from './LessonsTypes';
import { RegistrationType } from './RegistrationTypes';

export type LessonProgressType = {
  id: string;
  registrationId: string;
  lessonId: string;
  watchedAt: string;
  registration?: RegistrationType;
  lesson?: LessonType;
};
