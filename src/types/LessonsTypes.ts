import { CourseType } from './CourseTypes';

export type LessonType = {
  id: string;
  courseId: string;
  title: string;
  description: string;
  order: number;
  videoLink: string;
  course?: CourseType;
};
