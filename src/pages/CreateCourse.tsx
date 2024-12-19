import { useForm } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import * as yup from 'yup'
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../contexts/AuthContext";
import { ApiResponse } from "../types/AuthContext.types";
import { api } from "../services/api";
import Navbar from "../components/Navbar";


const createCourseSchema = yup.object({
  userId: yup.string().required('Campo Obrigatório'),
  name: yup.string().required('Campo Obrigatório'),
  description: yup.string().required('Campo Obrigatório'),
  text: yup.string().required('Campo Obrigatório'),
  required: yup.string(),
  duration: yup.string().required('Campo Obrigatório'),
  price: yup.number().typeError('Campo Obrigatório').default(0).required('Campo Obrigatório'),
});

type CreateCourseType = yup.InferType<typeof createCourseSchema>;

type TeacherList = {
  id: string;
  name: string;
}

export default function CreateCourse() {
  const [teachers, setTeachers] = useState<TeacherList[]>([])
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('Falta contexto');
  };

  const { tokens } = context;

  useEffect(() => {
    async function getData() {
      try {
        const {
          data: { success, data, error } }: { data: ApiResponse<TeacherList[]> } = await api.get('/users/getTeachers', {
            headers: {
              'x-access-token': tokens?.accessToken,
            },
          });

        if (!success || error) {
          return console.log(error);
        }

        setTeachers(data);
      } catch (error) {
        console.log(error);
      }
    }

    getData();
  }, [tokens])

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(createCourseSchema),
    defaultValues: {
      userId: '',
      name: '',
      description: '',
      text: '',
      required: '',
      duration: '',
      price: 0,
    }
  });

  async function createCourse(data: CreateCourseType) {
    console.log(data);
  }

  return (
    <div>
      <Navbar />

      <h1>Cadastro de Usuario</h1>

      <form onSubmit={handleSubmit(createCourse)}>
        <label htmlFor="name">Digite o nome do curso:</label>
        <input type="text" {...register('name')} />
        <p style={{ color: "red" }}>{errors.name?.message}</p>

        <label htmlFor="username">Digite uma descrição curta:</label>
        <input type="text" {...register('description')} />
        <p style={{ color: "red" }}>{errors.description?.message}</p>

        <label htmlFor="password">Digite a descrição:</label>
        <input type="text" {...register('text')} />
        <p style={{ color: "red" }}>{errors.text?.message}</p>

        <label htmlFor="repeatPassword">Digite o custo do curso:</label>
        <input type="number" min={0} step="0.01" {...register('price')} />
        <p style={{ color: "red" }}>{errors.price?.message}</p>

        <label htmlFor="type">Duração:</label>
        <input type="text"  {...register("duration")} />
        <p style={{ color: "red" }}>{errors.duration?.message}</p>

        <label htmlFor="type">Requisitos:</label>
        <input type="text"  {...register("required")} />
        <p style={{ color: "red" }}>{errors.required?.message}</p>

        <label htmlFor="type">Professor:</label>
        <select {...register("userId")}>
          <option value="" disabled>Selecione</option>
          {
            teachers.map((teacher) => (
              <option key={teacher.name} value={teacher.id}>{teacher.name}</option>
            ))
          }
        </select>
        <p style={{ color: "red" }}>{errors.duration?.message}</p>

        <button type='submit'>
          CADASTRAR
        </button>
      </form>
    </div>
  )
}