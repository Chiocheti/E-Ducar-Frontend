import { QuestionType } from './QuestionTypes';

export type ExamType = {
  id: string;
  courseId: string;
  title: string;
  description: string;
  order: number;
  questions?: QuestionType[];
};
