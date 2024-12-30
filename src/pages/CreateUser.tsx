import { yupResolver } from '@hookform/resolvers/yup'
import { useForm } from 'react-hook-form'
import * as yup from 'yup'
import { useContext, useState } from 'react'
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

  const [image, setImage] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null);

  if (!context) {
    throw new Error('Falta contexto');
  };

  const { tokens } = context;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<CreateUserType>({
    resolver: yupResolver(createUserSchema),
    defaultValues: {
      isTeacher: false,
    }
  })

  async function createUser(createUser: CreateUserType) {
    if (!tokens) {
      return console.log('Voce não tem permissão de cadastrar um Usuario');
    }

    if (!image) {
      return console.log('Voce precisa escolher uma imagem');
    }

    const user = {
      name: createUser.name,
      username: createUser.username,
      password: createUser.password,
      isTeacher: createUser.isTeacher,
    }

    const formData = new FormData();

    formData.append('user', JSON.stringify(user));
    formData.append('image', image);

    try {
      const
        { data: { success, data, error } } = await api.post<ApiResponse<string | null>>
          ('/users/create', formData, {
            headers: {
              'x-access-token': tokens?.accessToken,
              'Content-Type': 'multipart/form-data'
            },
          });

      if (success || !error) {
        reset();
        setImage(null);
        setPreview(null);
        return console.log(data);
      }

      return console.log(JSON.parse(error));
    } catch (error) {
      return console.log(error);
    }
  }

  async function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImage(file)
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
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
        <input type="checkbox"  {...register("isTeacher")} />
        <p style={{ color: "red" }}>{errors.isTeacher?.message}</p>

        <input type="file" accept="image/*" onChange={handleImageChange} />

        {preview && (
          <div>
            <p>Pré-visualização da Imagem:</p>
            <img src={preview} alt="Preview" width={'100px'} />
          </div>
        )}

        <button type='submit'>
          CADASTRAR
        </button>
      </form>

    </div>
  )
}