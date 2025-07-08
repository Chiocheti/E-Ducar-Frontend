import { useContext, useEffect, useState } from 'react';
import { UserContext } from '../../contexts/UserContext';
import { ApiResponse } from '../../types/ApiTypes';
import { api } from '../../services/api';
import { CollaboratorType } from '../../types/CollaboratorTypes';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import * as XLSX from 'xlsx';
import AdmNavbar from '../../components/AdmNavbar';

const createTicketsSchema = yup.object({
  quantity: yup
    .number()
    .required('Campo obrigatório')
    .typeError('Digite um numero maior do que 0')
    .min(1, 'Digite um numero maior do que 0'),
  collaboratorId: yup.string().required('Selecione um colaborador'),
});

type CreateTicketsType = yup.InferType<typeof createTicketsSchema>;
type SaveTicketsArray = {
  collaboratorId: string | null;
  code: string;
  used: boolean;
}[];

export default function TicketCreate() {
  const context = useContext(UserContext);
  if (!context) throw new Error('Falta contexto');
  const { tokens } = context;

  const [collaborators, setCollaborators] = useState<CollaboratorType[]>([]);

  useEffect(() => {
    async function getData() {
      try {
        const {
          data: { success, type, data },
        } = await api.get<ApiResponse>('/collaborators/getAll', {
          headers: {
            'x-access-token': tokens?.accessToken,
          },
        });

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

        const parsedData: CollaboratorType[] = JSON.parse(data);

        setCollaborators(parsedData);
      } catch (error) {
        console.log(error);
      }
    }

    getData();
  }, [tokens]);

  const {
    reset,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(createTicketsSchema),
    defaultValues: {
      collaboratorId: '',
      quantity: 0,
    },
  });

  async function saveTickets(tickets: SaveTicketsArray) {
    try {
      const {
        data: { success, type, data },
      } = await api.post<ApiResponse>(
        '/tickets/create',
        { tickets },
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

      console.log(data);
    } catch (error) {
      console.log(error);
    }
  }

  async function createLimitArray(tickets: SaveTicketsArray) {
    const array: SaveTicketsArray[] = [];

    for (let index = 0; index < tickets.length; index += 100) {
      array.push(tickets.slice(index, index + 100));
    }

    array.forEach(async (ticketsArray) => {
      await saveTickets(ticketsArray);
    });
  }

  function createXlsx(aoa: string[][]) {
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.aoa_to_sheet(aoa);
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Cupons');
    XLSX.writeFile(workbook, 'Cupons.xlsx', {
      bookType: 'xlsx',
      type: 'binary',
    });
  }

  function formatTicket(ticket: string) {
    const result: string[] = [];

    for (let index = 0; index < ticket.length; index += 4) {
      result.push(ticket.slice(index, index + 4));
    }

    return result;
  }

  function createTicket(code: string) {
    let result = '';

    if (code !== '0') {
      result = code;
      while (result.length < 4) {
        result = '0' + result;
      }
    }

    while (result.length < 16) {
      result += Math.floor(Math.random() * 10).toString();
    }
    return result;
  }

  function createTickets(data: CreateTicketsType) {
    const { quantity, collaboratorId } = data;

    const collaborator = collaborators.find((e) => e.id === collaboratorId);

    const tickets: string[][] = [];
    const ticketsObj: SaveTicketsArray = [];
    const uniqueTickets = new Set<string>();

    for (let index = 1; index <= quantity; index++) {
      let ticket = createTicket(collaborator?.code.toString() || '');
      while (uniqueTickets.has(ticket)) {
        ticket = createTicket(collaboratorId || '');
      }
      tickets.push(formatTicket(ticket));
      ticketsObj.push({
        collaboratorId: collaboratorId || null,
        code: ticket,
        used: false,
      });
      uniqueTickets.add(ticket);
    }

    createXlsx(tickets);
    createLimitArray(ticketsObj);

    reset();
  }

  return (
    <div>
      <AdmNavbar />

      <h1>Criando Cupons</h1>

      <label>Colaborador</label>
      <select {...register('collaboratorId')}>
        <option value={''} disabled>
          Selecione um Colaborador
        </option>
        {collaborators.map((collaborator) => (
          <option key={collaborator.id} value={collaborator.id}>
            {collaborator.name}
          </option>
        ))}
      </select>
      <p style={{ color: 'red' }}>{errors.collaboratorId?.message}</p>

      <label>Quantidade</label>
      <input type="number" {...register('quantity')} />
      <p style={{ color: 'red' }}>{errors.quantity?.message}</p>

      <button onClick={handleSubmit(createTickets)}>Criar</button>
    </div>
  );
}
