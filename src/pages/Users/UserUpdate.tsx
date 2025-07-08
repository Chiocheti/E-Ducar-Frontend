import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { useContext, useEffect, useRef, useState } from 'react';
import { UserContext } from '../../contexts/UserContext';
import { api } from '../../services/api';
import AdmNavbar from '../../components/AdmNavbar';
import UserItem from '../../components/UpdateUsers/UserItem';

import { ApiResponse } from '../../types/ApiTypes';
import { UserType } from '../../types/UserTypes';

const updateUserSchema = yup.object({
  id: yup.string().required('Campo obrigatório'),
  name: yup.string().required('Campo obrigatório'),
  username: yup.string().required('Campo obrigatório'),
  password: yup.string(),
  isTeacher: yup.boolean().default(false),
});

type UpdateUserType = yup.InferType<typeof updateUserSchema>;

export default function UserUpdate() {
  const context = useContext(UserContext);

  const [users, setUsers] = useState<UserType[] | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const imageLink = useRef<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!context) {
    throw new Error('Falta contexto');
  }

  const { user, tokens, updateUser } = context;

  useEffect(() => {
    async function getData() {
      try {
        const {
          data: { success, type, data },
        } = await api.get<ApiResponse>('/users/getAll', {
          headers: { 'x-access-token': tokens?.accessToken },
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

        const parseData: UserType[] = JSON.parse(data);

        setUsers(parseData);
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
    watch,
    formState: { errors },
  } = useForm<UpdateUserType>({
    resolver: yupResolver(updateUserSchema),
  });

  async function actualizeList() {
    try {
      const {
        data: { success, type, data },
      } = await api.get<ApiResponse>('/users/getAll', {
        headers: { 'x-access-token': tokens?.accessToken },
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

      const parsedData: UserType[] = JSON.parse(data);

      setUsers(parsedData);
    } catch (error) {
      console.log(error);
    }
  }

  function selectUser(user: UserType) {
    setValue('id', user.id);
    setValue('name', user.name);
    setValue('username', user.username);
    setValue('isTeacher', user.isTeacher);
    setPreview(user?.image);
    imageLink.current = user.image;
  }

  async function updateUserData(createUser: UpdateUserType) {
    if (!tokens) {
      return console.log('Voce não tem permissão de editar um Usuario');
    }

    const newUser: {
      name: string;
      username: string;
      password?: string | null;
      isTeacher: boolean;
    } = {
      name: createUser.name,
      username: createUser.username,
      isTeacher: createUser.isTeacher,
    };

    if (getValues('password')) {
      newUser.password = createUser.password;
    }

    try {
      const {
        data: { success, type, data },
      } = await api.put<ApiResponse>(
        '/users/update',
        { user: newUser, id: getValues('id') },
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

      if (getValues('id') === user?.id) {
        updateUser();
      }

      reset();
      actualizeList();
    } catch (error) {
      return console.log(error);
    }
  }

  async function updateImage(newImage: File | null) {
    if (!tokens)
      return console.log('Voce não tem permissão de editar um Usuario');

    if (!newImage) return console.log('Voce precisa escolher uma imagem');

    const formData = new FormData();
    formData.append('image', newImage);
    formData.append('imageLink', imageLink.current || '');
    formData.append('userId', getValues('id'));

    try {
      const {
        data: { success, type, data },
      } = await api.put<ApiResponse>('/users/updateImage', formData, {
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

      if (getValues('id') === user?.id) {
        updateUser();
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
      updateImage(file);
    }
  }

  return (
    <div>
      <AdmNavbar />

      <h2>Atualização de Usuario</h2>

      {watch('id') ? (
        <form onSubmit={handleSubmit(updateUserData)}>
          <label htmlFor="name">Digite o nome:</label>
          <input type="text" {...register('name')} />
          <p style={{ color: 'red' }}>{errors.name?.message}</p>

          <label htmlFor="username">Digite o login:</label>
          <input type="text" {...register('username')} />
          <p style={{ color: 'red' }}>{errors.username?.message}</p>

          <label htmlFor="password">
            Digite a senha ou deixe em branco para não mudar:
          </label>
          <input type="text" {...register('password')} />
          <p style={{ color: 'red' }}>{errors.password?.message}</p>

          <label htmlFor="type">É professor:</label>
          <input type="checkbox" {...register('isTeacher')} />
          <p style={{ color: 'red' }}>{errors.isTeacher?.message}</p>

          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            style={{ display: 'none' }}
            onChange={handleImageChange}
          />

          <button type="submit">SALVAR</button>

          {preview && (
            <img
              src={preview}
              alt="Preview"
              width={'100px'}
              onClick={() => fileInputRef?.current?.click()}
              style={{ cursor: 'pointer' }}
            />
          )}
        </form>
      ) : null}

      <p>------------------- LISTA DE USUARIOS -------------------</p>

      {users && users.length
        ? users.map((user) => (
            <UserItem key={user.id} user={user} selectUser={selectUser} />
          ))
        : null}
    </div>
  );
}
