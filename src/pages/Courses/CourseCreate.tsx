import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import imageCompression from 'browser-image-compression';
import { useContext, useEffect, useRef, useState } from 'react';
import { UserContext } from '../../contexts/UserContext';
import { ApiResponse } from '../../types/ApiTypes';
import { api } from '../../services/api';
import AdmNavbar from '../../components/AdmNavbar';
import Lessons from '../../components/CourseCreate/Lessons';
import Exam from '../../components/CourseCreate/Exam';

const createCourseSchema = yup.object({
  userId: yup.string().required('Campo Obrigatório'),
  name: yup.string().required('Campo Obrigatório'),
  description: yup.string().required('Campo Obrigatório'),
  text: yup.string().required('Campo Obrigatório'),
  required: yup.string(),
  duration: yup.string().required('Campo Obrigatório'),
  support: yup
    .number()
    .typeError('Por favor selecione uma opção')
    .required('Campo Obrigatório'),
  price: yup
    .number()
    .default(0)
    .typeError('O campo deve conter um numero valido')
    .positive('O preço deve ser um numero positivo')
    .required('Campo Obrigatório'),
  lessons: yup.array().of(
    yup.object().shape({
      title: yup.string().required('Campo Obrigatório'),
      description: yup.string().required('Campo Obrigatório'),
      videoLink: yup.string().required('Campo Obrigatório'),
      order: yup.number(),
    }),
  ),
  exam: yup.object().shape({
    title: yup.string().required('Campo Obrigatório'),
    description: yup.string().required('Campo Obrigatório'),
    questions: yup.array().of(
      yup.object().shape({
        question: yup.string().required('Campo Obrigatório'),
        order: yup.number(),
        questionOptions: yup.array().of(
          yup.object().shape({
            answer: yup.string().required('Campo Obrigatório'),
            isAnswer: yup.boolean().required('Campo Obrigatório'),
            order: yup.number(),
          }),
        ),
      }),
    ),
  }),
});

export type CreateCourseType = yup.InferType<typeof createCourseSchema>;

type TeacherList = {
  id: string;
  name: string;
  image: string;
};

export default function CourseCreate() {
  const context = useContext(UserContext);
  if (!context) throw new Error('Falta contexto');
  const { tokens } = context;

  const [teachers, setTeachers] = useState<TeacherList[]>([]);

  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    async function getData() {
      try {
        const {
          data: { success, type, data },
        } = await api.get<ApiResponse>('/users/getTeachers', {
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
        const parsedData: TeacherList[] = JSON.parse(data);

        setTeachers(parsedData);
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
    control,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(createCourseSchema),
    defaultValues: {
      userId: '',
      name: '',
      description: '',
      text: '',
      required: '',
      duration: '',
      support: 3,
      price: 0,
    },
  });

  async function createCourse(course: CreateCourseType) {
    const newCourse = course;
    newCourse.lessons?.forEach((lesson, index) => {
      lesson.order = index;
    });

    newCourse.exam.questions?.forEach((question, index2) => {
      question.order = index2;
      question.questionOptions?.forEach((option, index3) => {
        option.order = index3;
      });
    });

    if (!image) {
      console.log('Voce precisa escolher uma imagem');
      return;
    }

    const formData = new FormData();
    formData.append('course', JSON.stringify(course));
    formData.append('image', image);

    try {
      const {
        data: { success, type, data },
      } = await api.post<ApiResponse>('/courses/create', formData, {
        headers: {
          'x-access-token': tokens?.accessToken,
          'Content-Type': 'multipart/form-data',
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

      reset();
      setImage(null);
      setPreview(null);
      console.log(data);
      return;
    } catch (error) {
      console.log(error);
      return;
    }
  }

  async function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const options = {
      maxSizeMB: 1,
      maxWidthOrHeight: 1920,
      useWebWorker: true,
    };

    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];

      console.log(`originalFile size ${file.size / 1024 / 1024} MB`);

      const compressedFile = await imageCompression(file, options);

      console.log(
        `compressedFile size ${compressedFile.size / 1024 / 1024} MB`,
      );

      setImage(compressedFile);

      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(compressedFile);
    }
  }

  return (
    <div>
      <AdmNavbar />

      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginTop: '21vh',
        }}
      >
        <div style={{ width: '100%', textAlign: 'center' }}>
          <h2>Cadastro de Curso</h2>
        </div>

        <div style={{ width: '100%', textAlign: 'right' }}>
          <button onClick={handleSubmit(createCourse)}>CADASTRAR</button>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '1vw', width: '100vw' }}>
        <div style={{ width: '10%' }}>
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            style={{ display: 'none' }}
            onChange={handleImageChange}
          />

          <img
            src={preview || 'https://placehold.co/130x130?text=FOTO'}
            alt="Preview"
            width={'100px'}
            onClick={() => fileInputRef?.current?.click()}
            style={{ cursor: 'pointer' }}
          />
        </div>

        <div style={{ width: '100%' }}>
          <div style={{ display: 'flex', gap: '1vw' }}>
            <div style={{ width: '100%' }}>
              <p style={{ margin: 0 }}>Nome do Curso</p>
              <input
                type="text"
                placeholder="Nome do curso"
                style={{ width: '100%' }}
                {...register('name')}
              />
              <p style={{ color: 'red' }}>{errors.name?.message}</p>
            </div>

            <div style={{ width: '100%' }}>
              <p style={{ margin: 0 }}>Descrição Curta</p>
              <input
                type="text"
                placeholder="Descrição Curta"
                style={{ width: '100%' }}
                {...register('description')}
              />
              <p style={{ color: 'red' }}>{errors.description?.message}</p>
            </div>

            <div style={{ width: '100%' }}>
              <p style={{ margin: 0 }}>Descrição Longa</p>
              <input
                type="text"
                placeholder="Descrição Longa"
                style={{ width: '100%' }}
                {...register('text')}
              />
              <p style={{ color: 'red' }}>{errors.text?.message}</p>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '1vw' }}>
            <div style={{ width: '100%' }}>
              <p style={{ margin: 0 }}>Custo</p>
              <input
                type="number"
                step="0.01"
                placeholder="R$100,00"
                style={{ width: '100%' }}
                {...register('price')}
              />
              <p style={{ color: 'red' }}>{errors.price?.message}</p>
            </div>

            <div style={{ width: '100%' }}>
              <p style={{ margin: 0 }}>Duração</p>
              <input
                type="text"
                placeholder="Duração"
                style={{ width: '100%' }}
                {...register('duration')}
              />
              <p style={{ color: 'red' }}>{errors.duration?.message}</p>
            </div>

            <div style={{ width: '100%' }}>
              <p style={{ margin: 0 }}>Requisitos</p>
              <input
                type="text"
                placeholder="Requisitos"
                style={{ width: '100%' }}
                {...register('required')}
              />
              <p style={{ color: 'red' }}>{errors.required?.message}</p>
            </div>

            <div style={{ width: '100%' }}>
              <p style={{ margin: 0 }}>Suporte</p>
              <select {...register('support')} style={{ width: '100%' }}>
                <option value="" disabled>
                  Selecione
                </option>
                <option value={3}> 3 MESES </option>
                <option value={6}> 6 MESES </option>
              </select>
              <p style={{ color: 'red' }}>{errors.support?.message}</p>
            </div>

            <div style={{ width: '100%' }}>
              <p style={{ margin: 0 }}>Professor</p>
              <select {...register('userId')} style={{ width: '100%' }}>
                <option value="" disabled>
                  Selecione
                </option>
                {teachers.map((teacher) => (
                  <option key={teacher.name} value={teacher.id}>
                    {teacher.name}
                  </option>
                ))}
              </select>
              <p style={{ color: 'red' }}>{errors.userId?.message}</p>
            </div>
          </div>
        </div>
      </div>

      <div style={{ width: '100%', justifyItems: 'center' }}>
        <div>
          <h2>AULAS</h2>
        </div>

        <div style={{ width: '50vw' }}>
          {<Lessons control={control} register={register} errors={errors} />}
        </div>
      </div>

      <div style={{ width: '100%' }}>
        <div>
          {<Exam control={control} register={register} errors={errors} />}
        </div>
      </div>
    </div>
  );
}
