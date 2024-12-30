import { useForm } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import * as yup from 'yup'
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../contexts/AuthContext";
import { ApiResponse } from "../types/AuthContext.types";
import { api } from "../services/api";
import Navbar from "../components/Navbar";
import CourseItem from "./CourseItem";
import { CourseItemType } from "../types/Courses.types";

const createCourseSchema = yup.object({
  userId: yup.string().required('Campo Obrigatório'),
  name: yup.string().required('Campo Obrigatório'),
  description: yup.string().required('Campo Obrigatório'),
  text: yup.string().required('Campo Obrigatório'),
  required: yup.string(),
  duration: yup.string().required('Campo Obrigatório'),
  price: yup.number().
    default(0).
    typeError('O campo deve conter um numero valido').
    positive('O preço deve ser um numero inteiro positivo').
    required('Campo Obrigatório'),
});

type CreateCourseType = yup.InferType<typeof createCourseSchema>;

type TeacherList = {
  id: string;
  name: string;
}

export default function CreateCourse() {
  const context = useContext(AuthContext);

  const [teachers, setTeachers] = useState<TeacherList[]>([])
  const [courses, setCourse] = useState<CourseItemType[]>([]);
  const [image, setImage] = useState<File | null>(null);

  if (!context) {
    throw new Error('Falta contexto');
  };

  const { tokens } = context;

  useEffect(() => {
    async function getData() {
      try {
        const {
          data: { success: teacherSuccess, data: teacherData, error: teacherError } } =
          await api.get<ApiResponse<TeacherList[]>>('/users/getTeachers', {
            headers: {
              'x-access-token': tokens?.accessToken,
            },
          });

        if (!teacherSuccess || teacherError) {
          return console.log(teacherError);
        }

        setTeachers(teacherData);

        const {
          data: { success: coursesSuccess, data: coursesData, error: coursesError } } =
          await api.get<ApiResponse<CourseItemType[]>>('/courses/getAll', {
            headers: {
              'x-access-token': tokens?.accessToken,
            },
          });

        if (!coursesSuccess || coursesError) {
          return console.log(coursesError);
        }

        console.log(coursesData);


        setCourse(coursesData);
      } catch (error) {
        console.log(error);
      }
    }

    getData();
  }, [tokens])

  const {
    reset,
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

  async function createCourse(course: CreateCourseType) {
    console.log(course);
    if (!tokens) {
      return console.log('Voce não tem permissão de cadastrar um Curso');
    }

    if (!image) {
      return console.log('Voce precisa escolher uma imagem');
    }

    const formData = new FormData();
    formData.append('course', JSON.stringify({ ...course, isVisible: false }));
    formData.append('image', image);

    console.log(image);


    try {
      const { data: { success, data, error } } = await api.post<ApiResponse<string | null>>
        ('/courses/create', formData, {
          headers: {
            'x-access-token': tokens?.accessToken,
            'Content-Type': 'multipart/form-data',
          },
        });

      if (success || !error) {
        reset();
        setImage(null);
        return console.log(data);
      }

      return console.log(JSON.parse(error));
    } catch (error) {
      return console.log(error);
    }
  }

  async function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0])
    }
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
        <input type="number" step="0.01" {...register('price')} />
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

        <input type="file" accept="image/*" onChange={handleImageChange} />

        <button type='submit'>
          CADASTRAR
        </button>

        {
          courses.length ? (
            <CourseItem course={courses[0]}></CourseItem>
          ) : null
        }

      </form>
    </div>
  )
}