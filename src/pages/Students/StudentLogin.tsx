import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { useContext } from 'react';

import { StudentContext } from '../../contexts/StudentContext';

const loginStudentSchema = yup.object({
  email: yup.string().required('Campo obrigatório'),
  password: yup.string().required('Campo obrigatório'),
});

type LoginStudentType = yup.InferType<typeof loginStudentSchema>;

export default function StudentLogin() {
  const context = useContext(StudentContext);
  if (!context) throw new Error('Falta contexto');
  const { login } = context;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginStudentType>({
    resolver: yupResolver(loginStudentSchema),
  });

  async function loginStudent(newUser: LoginStudentType) {
    const { email, password } = newUser;
    const { success, type, data } = await login(email, password);

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

    console.log(data);
  }

  return (
    <div>
      <h1>Login de estudante</h1>

      <form onSubmit={handleSubmit(loginStudent)}>
        <label>Digite o email:</label>
        <input type="text" {...register('email')} />
        <p style={{ color: 'red' }}>{errors.email?.message}</p>

        <label>Digite a senha:</label>
        <input type="text" {...register('password')} />
        <p style={{ color: 'red' }}>{errors.password?.message}</p>

        <button type="submit">LOGIN</button>
      </form>
    </div>
  );
}
