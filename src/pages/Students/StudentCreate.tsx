import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { api } from '../../services/api';
import { ApiResponse } from '../../types/ApiTypes';

const createStudentSchema = yup.object({
  name: yup.string().required('Campo obrigatório'),
  email: yup.string().required('Campo obrigatório'),
  phone: yup.string().required('Campo obrigatório'),
  password: yup.string().required('Campo obrigatório'),
  repeatPassword: yup
    .string()
    .required('Campo obrigatório')
    .oneOf([yup.ref('password')], 'Senhas diferentes'),
});

type CreateStudentType = yup.InferType<typeof createStudentSchema>;

export default function StudentCreate() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateStudentType>({
    resolver: yupResolver(createStudentSchema),
  });

  async function createStudent(newStudent: CreateStudentType) {
    try {
      const {
        data: { success, type, data },
      } = await api.post<ApiResponse>('/students/create', {
        student: newStudent,
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
      return console.log(data);
    } catch (error) {
      return console.log(error);
    }
  }

  return (
    <div>
      <h1>Cadastro de estudante</h1>

      <form onSubmit={handleSubmit(createStudent)}>
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

        <label>Repita a senha:</label>
        <input type="text" {...register('repeatPassword')} />
        <p style={{ color: 'red' }}>{errors.repeatPassword?.message}</p>

        <button type="submit">CADASTRAR</button>
      </form>
    </div>
  );
}
