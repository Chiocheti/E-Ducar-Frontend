import { useContext, useEffect, useState } from 'react';
import { UserContext } from '../../contexts/UserContext';
import { api } from '../../services/api';
import { ApiResponse } from '../../types/ApiTypes';
import { faker } from '@faker-js/faker';
import { CourseType } from '../../types/CourseTypes';
import AdmNavbar from '../../components/AdmNavbar';
import { TicketType } from '../../types/TicketTypes';
import moment from 'moment';

type CreateStudentType = {
  name: string;
  email: string;
  phone: string;
  password: string;
  repeatPassword: string;
  registrations: {
    courseId: string;
    ticketId: string | null;
    registerDate: string;
    conclusionDate: string | null;
    supportDate: string;
  }[];
};

export default function UserTrash() {
  const context = useContext(UserContext);
  if (!context) throw new Error('Falta contexto');
  const { tokens } = context;

  const [courses, setCourses] = useState<CourseType[]>([]);
  const [tickets, setTickets] = useState<TicketType[]>([]);

  useEffect(() => {
    async function getData() {
      try {
        const {
          data: { success, type, data },
        } = await api.get<ApiResponse>('/courses/getAll', {
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
        const parsedData: CourseType[] = JSON.parse(data);

        setCourses(parsedData);
      } catch (error) {
        console.log(error);
      }
    }

    getData();
  }, [tokens]);

  useEffect(() => {
    async function getData() {
      try {
        const {
          data: { success, type, data },
        } = await api.get<ApiResponse>('/tickets/findAll', {
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
        const parsedData: TicketType[] = JSON.parse(data);

        setTickets(parsedData);
      } catch (error) {
        console.log(error);
      }
    }

    getData();
  }, [tokens]);

  async function createStudent(newStudent: CreateStudentType) {
    try {
      const {
        data: { success, type, data },
      } = await api.post<ApiResponse>('/students/trashCreate', {
        student: newStudent,
      });

      if (!success) {
        switch (type) {
          case 1:
            console.log(JSON.parse(data));
            console.log('Houve um erro interno');
            return false;
          case 2:
            console.log(JSON.parse(data));
            console.log('Houve um erro interno');
            return false;
          case 3:
            console.log(data);
            return false;
        }
      }

      console.log(data);
      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  }

  function randomStudent(): CreateStudentType {
    const qtt = Math.floor(Math.random() * 5) + 1;

    const student = {
      name: faker.person.fullName(),
      email: faker.internet.email(),
      phone: faker.phone.number(),
      password: faker.internet.password(),
      repeatPassword: faker.internet.password(),
      registrations: Array.from({ length: qtt }, () => {
        const course = courses[Math.floor(Math.random() * courses.length)];

        const registerDate = faker.date.past().toISOString();
        const supportDate = moment(registerDate)
          .add(course.support, 'months')
          .format('YYYY-MM-DD');

        return {
          courseId: course.id,
          ticketId: null,
          conclusionDate:
            qtt % 2 === 0 ? faker.date.future().toISOString() : null,
          registerDate,
          supportDate,
        };
      }),
    };

    return student;
  }

  const ticketIndex: number = 0;

  async function generateStudents() {
    const studentArray: CreateStudentType[] = Array.from({ length: 100 }, () =>
      randomStudent(),
    );

    // studentArray.forEach((student) => {
    //   student.registrations.forEach((registration) => {
    //     registration.ticketId = tickets[ticketIndex]?.id;
    //     ticketIndex += 1;
    //   });
    // });

    for (let index = 0; index < studentArray.length; index++) {
      await createStudent(studentArray[index]);
    }
  }

  return (
    <div>
      <AdmNavbar />

      <button onClick={generateStudents}>
        GERA VARIOS USUARIOS EM CURSOS JA CADASTRADOS
      </button>
    </div>
  );
}
