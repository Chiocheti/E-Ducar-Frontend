import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { api } from '../../services/api';
import { ApiResponse } from '../../types/ApiTypes';
import { useContext, useEffect, useRef, useState } from 'react';
import { StudentContext } from '../../contexts/StudentContext';
import { returnImageLink } from '../../utils/ReturnImageLink';
import StudentNavbar from '../../components/StudentNavbar';
import moment from 'moment';
import { useNavigate } from 'react-router-dom';

const updateStudentSchema = yup.object({
  name: yup.string().required('Campo obrigatório'),
  email: yup.string().required('Campo obrigatório'),
  phone: yup.string().required('Campo obrigatório'),
  password: yup.string(),
});

type UpdateStudentType = yup.InferType<typeof updateStudentSchema>;

export default function StudentPerfil() {
  const context = useContext(StudentContext);
  if (!context) throw new Error('Falta contexto');
  const { student, tokens, updateStudent } = context;

  const [preview, setPreview] = useState<string | null>(null);

  const navigate = useNavigate();

  const imageLink = useRef<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<UpdateStudentType>({
    resolver: yupResolver(updateStudentSchema),
  });

  useEffect(() => {
    if (!student) return;
    setValue('name', student.name);
    setValue('email', student.email);
    setValue('phone', student.phone);

    setPreview(returnImageLink(student.image));
    imageLink.current = student.image;
  }, [tokens, student, setValue]);

  async function updateStudentData(updatedStudent: UpdateStudentType) {
    try {
      const {
        data: { success, type, data },
      } = await api.put<ApiResponse>(
        '/students/update',
        { id: student?.id, student: updatedStudent },
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
      updateStudent();
      return console.log(data);
    } catch (error) {
      return console.log(error);
    }
  }

  async function updateImage(newImage: File | null) {
    if (!newImage) return console.log('Voce precisa escolher uma imagem');

    const formData = new FormData();
    formData.append('image', newImage);
    formData.append('imageLink', imageLink.current || '');
    formData.append('studentId', student?.id || '');

    try {
      const {
        data: { success, type, data },
      } = await api.put<ApiResponse>('/students/updateImage', formData, {
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
      updateStudent();
      return console.log(data);
    } catch (error) {
      return console.log(error);
    }
  }

  async function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      updateImage(file);
    }
  }

  return (
    <div>
      <StudentNavbar />

      <h3 style={{ marginTop: '20vh' }}>Meus Cursos</h3>

      <div style={{ display: 'flex' }}>
        {student?.registrations &&
          student?.registrations.map((registration) => (
            <div key={registration.id} style={{ border: '1px solid blue' }}>
              <img
                width={'100px'}
                src={
                  registration.course?.image
                    ? returnImageLink(registration.course?.image)
                    : 'https://placehold.co/130x130?text=FOTO'
                }
                style={{ cursor: 'pointer' }}
              />
              <p>Curso: {registration.course?.name}</p>
              <p>
                Data de Matricula:{' '}
                {moment(registration.registerDate).format('DD/MM/YYYY')}
              </p>
              <p>
                Data de Suporte:{' '}
                {moment(registration.supportDate).format('DD/MM/YYYY')}
              </p>

              <button
                onClick={() => navigate(`/student/class/${registration.id}`)}
              >
                Ir para curso
              </button>
            </div>
          ))}
      </div>

      <h3>Perfil do Estudante</h3>

      <div style={{ display: 'flex' }}>
        <div style={{ width: '20vw', textAlign: 'center' }}>
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

          <button onClick={handleSubmit(updateStudentData)}>EDITAR</button>
        </div>

        <form>
          <label>Digite o nome:</label>
          <input type="text" {...register('name')} />
          <p style={{ color: 'red' }}>{errors.name?.message}</p>

          <label>Digite seu Telefone:</label>
          <input type="text" {...register('phone')} />
          <p style={{ color: 'red' }}>{errors.phone?.message}</p>

          <label>Digite o email:</label>
          <input type="text" {...register('email')} />
          <p style={{ color: 'red' }}>{errors.email?.message}</p>

          <label>Digite a senha:</label>
          <input type="text" {...register('password')} />
          <p style={{ color: 'red' }}>{errors.password?.message}</p>
        </form>
      </div>
    </div>
  );
}
