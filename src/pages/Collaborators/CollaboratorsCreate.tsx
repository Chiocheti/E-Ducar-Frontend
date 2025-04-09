import { useContext } from 'react';
import AdmNavbar from '../../components/AdmNavbar';
import { UserContext } from '../../contexts/UserContext';

import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { api } from '../../services/api';
import { ApiResponse } from '../../types/ApiTypes';

const createCollaboratorSchema = yup.object({
  name: yup.string().required('Campo Obrigatório'),
  code: yup
    .number()
    .required('Campo Obrigatório')
    .typeError('Digite um Numero de 0 a 9999')
    .min(0, 'Não pode ser menor do que 0')
    .max(9999, 'Não pode ser maior do que 9999'),
});

type CreateCollaboratorType = yup.InferType<typeof createCollaboratorSchema>;

export default function CollaboratorsCreate() {
  const context = useContext(UserContext);
  if (!context) throw new Error('Falta contexto');
  const { tokens } = context;

  const {
    reset,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(createCollaboratorSchema),
    defaultValues: {
      code: 0,
      name: '',
    },
  });

  async function createCollaborator(collaborator: CreateCollaboratorType) {
    try {
      const {
        data: { success, type, data },
      } = await api.post<ApiResponse>(
        '/collaborators/create',
        { collaborator },
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
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div>
      <AdmNavbar />

      <div style={{ width: '100%', textAlign: 'center' }}>
        <h2>Cadastro de Colaboradores</h2>
      </div>

      <div style={{ width: '100%' }}>
        <p style={{ margin: 0 }}>Nome do Colaborador</p>
        <input
          type="text"
          placeholder="Nome do Colaborador"
          style={{ width: '100%' }}
          {...register('name')}
        />
        <p style={{ color: 'red' }}>{errors.name?.message}</p>
      </div>

      <div style={{ width: '100%' }}>
        <p style={{ margin: 0 }}>Nome do Colaborador</p>
        <input type="number" style={{ width: '100%' }} {...register('code')} />
        <p style={{ color: 'red' }}>{errors.code?.message}</p>
      </div>

      <div style={{ width: '100%', textAlign: 'right' }}>
        <button onClick={handleSubmit(createCollaborator)}>CADASTRAR</button>
      </div>
    </div>
  );
}
