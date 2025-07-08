import { CourseType } from '../../types/CourseTypes';

import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';

const createTicketSchema = yup.object({
  ticket: yup.string().length(16, 'O cupom deve ter 16 caracteres'),
});

type CreateTicketType = yup.InferType<typeof createTicketSchema>;

export default function CourseItem({
  course,
  subscribe,
}: {
  course: CourseType;
  subscribe: (courseId: string, ticket: string | null, support: number) => void;
}) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateTicketType>({
    resolver: yupResolver(createTicketSchema),
  });

  function handleRegister({ ticket }: CreateTicketType) {
    subscribe(course.id, ticket || null, course.support);
  }

  return (
    <div style={{ border: '1px solid green' }}>
      <img
        width={'100px'}
        src={
          course.image ? course.image : 'https://placehold.co/130x130?text=FOTO'
        }
      />
      <p>Nome: {course.name}</p>
      <p>Descrição: {course.description}</p>
      <p>Valor: {course.price}</p>
      <p>Duração: {course.duration}</p>
      <input
        type="text"
        placeholder="Código"
        {...register('ticket')}
        maxLength={16}
      />
      <p>{errors.ticket?.message}</p>

      <button onClick={handleSubmit(handleRegister)}>Matricular</button>
    </div>
  );
}
