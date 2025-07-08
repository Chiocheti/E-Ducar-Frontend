import { CourseType } from './CourseTypes';
import { LessonProgressType } from './LessonProgressTypes';
import { StudentType } from './StudentTypes';
import { TicketType } from './TicketTypes';

export type RegistrationType = {
  id: string;
  studentId: string;
  courseId: string;
  ticketId: string;
  registerDate: string;
  conclusionDate: string;
  supportDate: string;
  examResult: number | null;
  degreeLink: string | null;
  student?: StudentType;
  course?: CourseType;
  ticket?: TicketType;
  lessonsProgress?: LessonProgressType[];
};
