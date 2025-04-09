import { CourseType } from './CourseTypes';
import { LessonProgressType } from './LessonProgressTypes';
import { StudentType } from './StudentTypes';

export type RegistrationType = {
  id: string;
  studentId: string;
  courseId: string;
  registerDate: string;
  conclusionDate: string;
  supportDate: string;
  student?: StudentType;
  course?: CourseType;
  lessonsProgress?: LessonProgressType[];
};
