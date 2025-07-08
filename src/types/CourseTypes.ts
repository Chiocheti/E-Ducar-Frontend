import { ExamType } from './ExamTypes';
import { LessonType } from './LessonsTypes';
import { UserType } from './UserTypes';

export type CourseType = {
  id: string;
  userId: string;
  name: string;
  isVisible: boolean;
  image: string;
  description: string;
  text: string;
  required: string;
  duration: string;
  support: number;
  price: number;
  user?: UserType;
  lessons?: LessonType[];
  exam: ExamType;
};
