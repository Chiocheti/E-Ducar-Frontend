import { useContext, useEffect } from 'react';
import AdmNavbar from '../../components/AdmNavbar';
import { api } from '../../services/api';
import { ApiResponse } from '../../types/ApiTypes';
import { UserContext } from '../../contexts/UserContext';
import { CollaboratorType } from '../../types/CollaboratorTypes';
import { useFieldArray, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

const updateCollaboratorsSchema = yup.object({
  collaborators: yup.array().of(
    yup.object().shape({
      name: yup.string().required('Campo Obrigatório'),
      code: yup
        .number()
        .required('Campo Obrigatório')
        .typeError('Digite um Numero de 0 a 9999')
        .min(0, 'Não pode ser menor do que 0')
        .max(9999, 'Não pode ser maior do que 9999'),
    }),
  ),
});

type UpdateCollaboratorsType = yup.InferType<typeof updateCollaboratorsSchema>;

export default function CollaboratorsUpdate() {
  const context = useContext(UserContext);
  if (!context) throw new Error('Falta contexto');
  const { tokens } = context;

  const {
    control,
    setValue,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(updateCollaboratorsSchema),
    defaultValues: {
      collaborators: [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'collaborators',
  });

  useEffect(() => {
    async function getData() {
      try {
        const {
          data: { success, type, data },
        } = await api.get<ApiResponse>('/collaborators/getAll', {
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

        const parsedData: CollaboratorType[] = JSON.parse(data);

        setValue('collaborators', parsedData);
      } catch (error) {
        console.log(error);
      }
    }

    getData();
  }, [tokens, setValue]);

  function addNewCollaboration() {
    append({
      name: '',
      code: 0,
    });
  }

  async function getCollaborators() {
    try {
      const {
        data: { success, type, data },
      } = await api.get<ApiResponse>('/collaborators/getAll', {
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

      const parsedData: CollaboratorType[] = JSON.parse(data);

      setValue('collaborators', parsedData);
    } catch (error) {
      console.log(error);
    }
  }

  async function updateCollaborators(data: UpdateCollaboratorsType) {
    const { collaborators } = data;
    try {
      const {
        data: { success, type, data },
      } = await api.put<ApiResponse>(
        '/collaborators/update',
        { collaborators },
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

      console.log(data);
      getCollaborators();
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div>
      <AdmNavbar />

      <h2>Atualização de Colaborador</h2>

      {fields.map((field, index) => (
        <div key={field.id} style={{ display: 'flex' }}>
          <div>
            <p style={{ margin: 0 }}>Nome do Colaborador</p>
            <input
              type="text"
              placeholder="Nome do Colaborador"
              style={{ width: '100%' }}
              {...register(`collaborators.${index}.name`)}
            />
            <p style={{ color: 'red' }}>
              {errors.collaborators?.[index]?.name?.message}
            </p>
          </div>

          <div>
            <p style={{ margin: 0 }}>Codigo do Colaborador</p>
            <input
              type="number"
              style={{ width: '100%' }}
              {...register(`collaborators.${index}.code`)}
            />
            <p style={{ color: 'red' }}>
              {errors.collaborators?.[index]?.code?.message}
            </p>
          </div>

          <button onClick={() => remove(index)}>Remover</button>
        </div>
      ))}

      <button onClick={addNewCollaboration}>Adicionar</button>
      <button onClick={handleSubmit(updateCollaborators)}>Salvar</button>
    </div>
  );
}
