import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useContext, useEffect, useRef, useState } from 'react';
import { UserContext } from '../../contexts/UserContext';
import { api } from '../../services/api';
import { ApiResponse } from '../../types/ApiTypes';
import { CourseType } from '../../types/CourseTypes';
import { returnImageLink } from '../../utils/ReturnImageLink';
import LessonsUpdate from './LessonsUpdate';
import ExamsUpdate from './ExamsUpdate';

const updateCourseSchema = yup.object({
  id: yup.string().required('Campo Obrigatório'),
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
    .positive('O preço deve ser um numero inteiro positivo')
    .required('Campo Obrigatório'),
  lessons: yup.array().of(
    yup.object().shape({
      id: yup.string(),
      courseId: yup.string(),
      title: yup.string().required('Campo Obrigatório'),
      description: yup.string().required('Campo Obrigatório'),
      order: yup.number(),
      videoLink: yup.string().required('Campo Obrigatório'),
    }),
  ),
  exams: yup.array().of(
    yup.object().shape({
      id: yup.string(),
      courseId: yup.string(),
      title: yup.string().required('Campo Obrigatório'),
      description: yup.string().required('Campo Obrigatório'),
      order: yup.number(),
      questions: yup.array().of(
        yup.object().shape({
          id: yup.string(),
          examId: yup.string(),
          question: yup.string().required('Campo Obrigatório'),
          order: yup.number(),
          questionOptions: yup.array().of(
            yup.object().shape({
              id: yup.string(),
              questionId: yup.string(),
              answer: yup.string().required('Campo Obrigatório'),
              isAnswer: yup.boolean().required('Campo Obrigatório'),
              order: yup.number(),
            }),
          ),
        }),
      ),
    }),
  ),
});

export type UpdateCourseType = yup.InferType<typeof updateCourseSchema>;

type TeacherList = {
  id: string;
  name: string;
};

export default function CourseUpdateComp({
  course,
  actualizeList,
}: {
  course: CourseType;
  actualizeList: () => void;
}) {
  const context = useContext(UserContext);
  if (!context) throw new Error('Falta contexto');
  const { tokens } = context;

  const [teachers, setTeachers] = useState<TeacherList[]>([]);
  const [preview, setPreview] = useState<string | null>(null);

  const imageLink = useRef<string | null>(null);
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

        const parsedTeacher: TeacherList[] = JSON.parse(data);

        setTeachers(parsedTeacher);
      } catch (error) {
        console.log(error);
      }
    }

    getData();
  }, [tokens]);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    getValues,
    control,
    formState: { errors },
  } = useForm<UpdateCourseType>({
    resolver: yupResolver(updateCourseSchema),
    defaultValues: {
      userId: '',
      name: '',
      description: '',
      text: '',
      required: '',
      duration: '',
      support: 3,
      price: 0,
      lessons: [
        {
          title: '',
          description: '',
          videoLink: '',
          order: 0,
        },
      ],
      exams: [
        {
          title: '',
          description: '',
          order: 0,
          questions: [
            {
              question: '',
              order: 0,
              questionOptions: [
                {
                  answer: '',
                  isAnswer: false,
                  order: 0,
                },
              ],
            },
          ],
        },
      ],
    },
  });

  useEffect(() => {
    setValue('id', course.id);
    setValue('userId', course.userId);
    setValue('name', course.name);
    setValue('description', course.description);
    setValue('text', course.text);
    setValue('required', course.required);
    setValue('duration', course.duration);
    setValue('support', course.support);
    setValue('price', course.price);
    setTimeout(() => {
      setValue('lessons', course.lessons);
      setValue('exams', course.exams);
    }, 1);

    setPreview(returnImageLink(course.image));
    imageLink.current = course.image;
  }, [setValue, course]);

  async function updateCourse(newCourse: UpdateCourseType) {
    const { lessons, exams, ...rest } = newCourse;

    exams?.forEach((exam, index) => {
      exam.order = index;
      exam.questions?.forEach((question, index2) => {
        question.order = index2;
        question.questionOptions?.forEach((option, index3) => {
          option.order = index3;
        });
      });
    });

    lessons?.forEach((lesson, index) => {
      lesson.order = index;
    });

    if (!tokens) {
      console.log('Voce não tem permissão de cadastrar um Curso');
      return;
    }

    try {
      const {
        data: { success, type, data },
      } = await api.put<ApiResponse>(
        '/courses/update',
        { course: { ...rest, lessons, exams }, id: getValues('id') },
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

      reset();
      setPreview(null);
      console.log(data);
      actualizeList();
      return;
    } catch (error) {
      console.log(error);
      return;
    }
  }

  async function updateCourseImage(newImage: File | null) {
    if (!tokens)
      return console.log('Voce não tem permissão de editar um Curso');

    if (!newImage) return console.log('Voce precisa escolher uma imagem');

    const formData = new FormData();
    formData.append('image', newImage);
    formData.append('imageLink', imageLink.current || '');
    formData.append('id', getValues('id'));

    try {
      const {
        data: { success, type, data },
      } = await api.put<ApiResponse>('/courses/updateImage', formData, {
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
      setPreview(null);
      actualizeList();
      return console.log(data);
    } catch (error) {
      return console.log(error);
    }
  }

  async function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      updateCourseImage(file);
    }
  }

  return (
    <div>
      <div style={{ width: '85vw', marginBottom: '10px' }}>
        <button
          onClick={handleSubmit(updateCourse)}
          style={{ width: '100%', backgroundColor: 'gray', color: 'white' }}
        >
          SALVAR MUDANÇAS
        </button>
      </div>

      <div style={{ display: 'flex', height: '20vh', gap: '1vw' }}>
        <div style={{ width: '10vw' }}>
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
            width={'100%'}
            height={'100%'}
            onClick={() => fileInputRef?.current?.click()}
            style={{
              cursor: 'pointer',
              objectFit: 'cover',
              borderRadius: '20px',
              objectPosition: 'center',
            }}
          />
        </div>

        <div style={{ width: '90vw' }}>
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

      <div style={{ marginTop: '10px' }}>
        <LessonsUpdate control={control} errors={errors} register={register} />
      </div>

      <div style={{ marginTop: '10px' }}>
        <ExamsUpdate control={control} errors={errors} register={register} />
      </div>
    </div>
  );
}
