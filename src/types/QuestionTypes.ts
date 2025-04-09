import { QuestionOptionType } from './QuestionsOptionsTypes';

export type QuestionType = {
  id: string;
  examId: string;
  question: string;
  order: number;
  questionOptions?: QuestionOptionType[];
};
