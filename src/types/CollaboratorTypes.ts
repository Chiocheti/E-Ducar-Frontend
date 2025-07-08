import { TicketType } from './TicketTypes';

export type CollaboratorType = {
  id: string;
  name: string;
  code: number;
  tickets?: TicketType[];
};
