import { useState } from 'react';
import { StudentType } from '../../types/StudentTypes';

export default function TicketList({
  student,
  stopRegister,
}: {
  student: StudentType;
  stopRegister(registerId: string): Promise<void>;
}) {
  const [showDetails, setShowDetails] = useState<boolean>(false);

  function returnCode(code: string) {
    if (!code) return 'PAGO COM CARTÃO';
    const result: string[] = [];

    for (let index = 0; index < code.length; index += 4) {
      result.push(code.slice(index, index + 4));
    }

    return result.join('.');
  }

  return (
    <div style={{ marginBottom: '10px' }}>
      <div style={{ display: 'flex' }}>
        <div style={{ border: '1px solid red' }}>
          <p>{student?.name}</p>
        </div>

        <div style={{ border: '1px solid red' }}>
          <p>{student?.email}</p>
        </div>

        <div style={{ border: '1px solid red' }}>
          <p>{student?.phone}</p>
        </div>

        <div style={{ border: '1px solid red' }}>
          <p>{student?.lastLogin}</p>
        </div>

        <button onClick={() => setShowDetails((p) => !p)}>DETALHES</button>
      </div>

      {showDetails &&
        student.registrations?.map((registration) => (
          <div key={registration.id} style={{ display: 'flex' }}>
            <div style={{ border: '1px solid red' }}>
              <p>{registration.course?.name}</p>
            </div>

            <div style={{ border: '1px solid red' }}>
              <p>{returnCode(registration.ticket?.code || '')}</p>
            </div>

            <div style={{ border: '1px solid red' }}>
              <p>{registration.registerDate}</p>
            </div>

            <div style={{ border: '1px solid red' }}>
              <p>{registration.supportDate}</p>
            </div>

            <button
              style={{ color: 'red' }}
              onClick={() => stopRegister(registration.id)}
            >
              DESATIVAR
            </button>
          </div>
        ))}
    </div>
  );
}
