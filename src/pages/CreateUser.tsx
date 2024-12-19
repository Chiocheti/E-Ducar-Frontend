import { yupResolver } from '@hookform/resolvers/yup'
import { useForm } from 'react-hook-form'
import * as yup from 'yup'
import { useContext } from 'react'
import { AuthContext } from '../contexts/AuthContext'
import { api } from '../services/api'
import { ApiResponse } from '../types/AuthContext.types'
import Navbar from '../components/Navbar'

const createUserSchema = yup.object({
  name: yup.string().required('Campo obrigatório'),
  username: yup.string().required('Campo obrigatório'),
  password: yup.string().required('Campo obrigatório'),
  repeatPassword: yup.string()
    .required('Campo obrigatório')
    .oneOf([yup.ref('password')], 'Senhas diferentes'),
  isTeacher: yup.boolean().default(false),
})

type CreateUserType = yup.InferType<typeof createUserSchema>

export default function CreateUser() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('Falta contexto');
  };

  const { tokens } = context;

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<CreateUserType>({
    resolver: yupResolver(createUserSchema),
    defaultValues: {
      isTeacher: false,
    }
  })

  async function createUser(createUser: CreateUserType) {
    const user = {
      name: createUser.name,
      // name: 123,
      username: createUser.username,
      password: createUser.password,
      isTeacher: createUser.isTeacher,
    }

    try {
      const { data: { success, data, error } }: { data: ApiResponse<string | null> } = await api.post('/users/create', { user }, {
        headers: {
          'x-access-token': tokens?.accessToken,
        },
      });

      if (success || !error) {
        return console.log(data);
      }

      return console.log(JSON.parse(error));
    } catch (error) {
      return console.log(error);
    }
  }

  return (
    <div>
      <Navbar />

      <h1>Cadastro de Usuario</h1>

      <form onSubmit={handleSubmit(createUser)}>
        <label htmlFor="name">Digite o nome:</label>
        <input type="text" {...register('name')} />
        <p style={{ color: "red" }}>{errors.name?.message}</p>

        <label htmlFor="username">Digite o login:</label>
        <input type="text" {...register('username')} />
        <p style={{ color: "red" }}>{errors.username?.message}</p>

        <label htmlFor="password">Digite a senha:</label>
        <input type="text" {...register('password')} />
        <p style={{ color: "red" }}>{errors.password?.message}</p>

        <label htmlFor="repeatPassword">Repita a senha:</label>
        <input type="text" {...register('repeatPassword')} />
        <p style={{ color: "red" }}>{errors.repeatPassword?.message}</p>

        <label htmlFor="type">É professor:</label>
        {/* <select id="type" {...register("type")}>
          <option value="">Selecione</option>
          <option value={true}>ADMINISTRADOR</option>
          <option value={false}>PROFESSOR</option>
        </select> */}
        <input type="checkbox"  {...register("isTeacher")} />
        <p style={{ color: "red" }}>{errors.isTeacher?.message}</p>

        <button type='submit'>
          CADASTRAR
        </button>
      </form>

    </div>
  )
}