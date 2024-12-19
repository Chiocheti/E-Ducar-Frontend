import { yupResolver } from '@hookform/resolvers/yup'
import { useForm } from 'react-hook-form'
import * as yup from 'yup'
import { useContext } from 'react'
import { AuthContext } from '../contexts/AuthContext'

const loginSchema = yup.object({
  username: yup.string().required("Por favor insira o login"),
  password: yup.string().required("Por favor insira a senha"),
  keepLogin: yup.boolean().default(false),
});

type LoginType = yup.InferType<typeof loginSchema>

export default function Login() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('Falta contexto');
  };

  const { login, isLoading, user, tokens } = context;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginType>({
    resolver: yupResolver(loginSchema),
  })

  async function singin(data: LoginType) {
    const { username, password, keepLogin } = data;

    try {
      const { success, data, error } = await login(username, password, keepLogin);

      if (success) {
        console.log(data);
      } else {
        console.log(error);
      }
    } catch (error) {
      console.log(error);
    }
  }

  return !isLoading ? (
    <div style={{ maxWidth: "400px", margin: "auto", padding: "20px" }}>

      <div>
        {JSON.stringify(tokens)}
      </div>
      <div>
        {JSON.stringify(user)}
      </div>

      <h1>Tela de Login</h1>
      <form onSubmit={handleSubmit(singin)}>
        <div style={{ marginBottom: "15px" }}>
          <label htmlFor="username">Login:</label>
          <input type="text" {...register('username')} />
          <p style={{ color: "red" }}>{errors.username?.message}</p>
        </div>

        <div style={{ marginBottom: "15px" }}>
          <label htmlFor="password">Senha:</label>
          <input type="text" {...register('password')} />
          <p style={{ color: "red" }}>{errors.password?.message}</p>
        </div>

        <div style={{ marginBottom: "15px" }}>
          <label htmlFor="keepLogin">Manter logado:</label>
          <input type="checkbox" {...register('keepLogin')} />
          <p style={{ color: "red" }}>{errors.keepLogin?.message}</p>
        </div>

        <button type='submit' style={{ padding: "10px 20px" }}>
          Entrar
        </button>
      </form>
    </div>
  ) : 'Carregando...'
}