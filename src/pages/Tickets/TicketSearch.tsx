import { useCallback, useContext, useEffect, useState } from 'react';
import * as XLSX from 'xlsx';

import { api } from '../../services/api';
import { UserContext } from '../../contexts/UserContext';

import AdmNavbar from '../../components/AdmNavbar';
import TicketList from '../../components/TicketSearch/TicketList';

import { ApiResponse } from '../../types/ApiTypes';
import { CollaboratorType } from '../../types/CollaboratorTypes';
import { StudentType } from '../../types/StudentTypes';

export default function TicketSearch() {
  const context = useContext(UserContext);
  if (!context) throw new Error('Falta contexto');
  const { tokens } = context;

  const [studentName, setStudentName] = useState<string>('');
  const [collaboratorId, setCollaboratorId] = useState<string>('');
  const [pageRange, setPageRange] = useState<number>(100);
  const [offset, setOffset] = useState<number>(0);

  const [offsetOptions, setOffsetOptions] = useState<
    { start: number; end: number }[]
  >([]);

  const [collaborators, setCollaborators] = useState<CollaboratorType[]>([]);

  const [students, setStudents] = useState<StudentType[]>([]);

  useEffect(() => {
    async function getCollaborators() {
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

    getCollaborators();
  }, [tokens]);

  const getRegistrations = useCallback(
    async (full: boolean) => {
      try {
        const obj: {
          studentName: string | null;
          collaboratorId: string | null;
          offset: number | null;
          pageRange: number | null;
        } = {
          studentName: studentName || null,
          collaboratorId: collaboratorId || null,
          offset: full ? null : offset || null,
          pageRange: full ? null : pageRange || null,
        };

        const {
          data: { success, type, data },
        } = await api.post<ApiResponse>('/tickets/search', obj, {
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

        const {
          students,
          total,
        }: {
          students: StudentType[];
          total: number;
        } = JSON.parse(data);

        console.log('Registros Encontrados !!!');
        return { students, total };
      } catch (error) {
        console.log(error);
      }
    },
    [tokens, studentName, collaboratorId, offset, pageRange],
  );

  const setRegistrations = useCallback(async () => {
    console.log('Buscando registros...');
    const findRegistrations = await getRegistrations(false);

    if (!findRegistrations) return;

    const { students, total } = findRegistrations;

    const options: { start: number; end: number }[] = [];

    for (let index = 1; index <= total; index += pageRange) {
      options.push({
        start: index,
        end: index + pageRange >= total ? total : index + pageRange,
      });
    }

    console.log('Setando registros...');
    setStudents(students);
    setOffsetOptions(options);
  }, [getRegistrations, pageRange]);

  useEffect(() => {
    setRegistrations();
  }, [setRegistrations]);

  async function getAllStudents() {
    try {
      const findRegistrations = await getRegistrations(true);

      if (!findRegistrations) return [];

      const { students } = findRegistrations;

      return students;
    } catch (error) {
      console.log(error);
    }
    return [];
  }

  async function stopRegister(registerId: string) {
    try {
      const {
        data: { success, data, type },
      } = await api.delete<ApiResponse>('/registrations/delete', {
        headers: {
          'x-access-token': tokens?.accessToken,
        },
        params: {
          id: registerId,
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

      setRegistrations();
    } catch (error) {
      console.log(error);
    }
  }

  async function createXlsx(aoa: string[][]) {
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.aoa_to_sheet(aoa);
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Cupons');
    XLSX.writeFile(workbook, 'Lista_De_Estudantes.xlsx', {
      bookType: 'xlsx',
      type: 'binary',
    });
  }

  function createAoA(students: StudentType[]) {
    const aoa: string[][] = [];

    students.forEach((student) => {
      let row: string[] = [];

      row.push(student.name);
      row.push(student.email);
      row.push(student.phone);
      row.push(student.lastLogin);

      aoa.push(row);
      row = [];

      student.registrations?.forEach((registration) => {
        row.push(registration.course?.name || '');
        row.push(registration.ticket?.code || 'SEM CÓDIGO');
        row.push(registration.registerDate);
        row.push(registration.supportDate);

        aoa.push(row);
        row = [];
      });

      aoa.push(row);
    });

    return aoa;
  }

  async function generateXlsx() {
    const students = await getAllStudents();

    const aoa = createAoA(students);
    await createXlsx(aoa);
  }

  return (
    <div>
      <AdmNavbar />

      <div style={{ marginTop: '120px' }}>
        <div>
          <button
            style={{ width: '100%', color: 'black', backgroundColor: 'white' }}
            onClick={generateXlsx}
          >
            Gerar XLSX
          </button>
        </div>

        <div>
          <input type="text" onChange={(e) => setStudentName(e.target.value)} />
        </div>

        <div>
          <label>QUANTIDADE POR PAGINA</label>
          <select
            value={pageRange}
            onChange={(e) => {
              setOffset(0);
              setPageRange(parseInt(e.target.value));
            }}
          >
            <option value={50}>50</option>
            <option value={100}>100</option>
            <option value={250}>250</option>
          </select>
        </div>

        <div>
          <label>CUPOM</label>
          <select
            value={collaboratorId}
            onChange={(e) => {
              setOffset(0);
              setCollaboratorId(e.target.value);
            }}
          >
            <option value={'off'}>Sem Filtro</option>
            <option value={''}>Pago com Cartão</option>
            {collaborators.map((collaborator) => (
              <option key={collaborator.id} value={collaborator.id}>
                {collaborator.name} = {collaborator.id}
              </option>
            ))}
          </select>
        </div>

        <div style={{ display: 'flex' }}>
          {offsetOptions.map((option) => (
            <button
              key={option.start}
              style={{
                fontSize: '12px',
                borderRadius: 20,
                backgroundColor: 'white',
                color: offset === option.start - 1 ? 'red' : 'black',
              }}
              onClick={() => setOffset(option.start - 1)}
            >
              {option.start} - {option.end}
            </button>
          ))}
        </div>
      </div>

      {students.map((student) => (
        <TicketList
          key={student.id}
          student={student}
          stopRegister={stopRegister}
        />
      ))}
    </div>
  );
}
