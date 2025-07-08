import { CollaboratorType } from './CollaboratorTypes';

export type TicketType = {
  id: string;
  collaboratorId: string;
  code: string;
  used: boolean;
  collaborator: CollaboratorType;
};
