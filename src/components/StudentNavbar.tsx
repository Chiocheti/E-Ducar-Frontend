import { useContext } from 'react';
import { StudentContext } from '../contexts/StudentContext';
import { useNavigate } from 'react-router-dom';
import { returnImageLink } from '../utils/ReturnImageLink';

export default function StudentNavbar() {
  const context = useContext(StudentContext);
  if (!context) throw new Error('Falta contexto');
  const { student, logout } = context;

  const navigate = useNavigate();

  async function singout() {
    const { success, type, data } = await logout();

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
    <div
      style={{
        width: '100vw',
        height: '20vh',
        position: 'absolute',
        top: 0,
        backgroundColor: '#e8e8e8',
        borderRadius: '20px',
        alignContent: 'center',
      }}
    >
      <div
        style={{
          display: 'flex',
          padding: '1vw',
          gap: '1vw',
        }}
      >
        <img
          height={'100vh'}
          onClick={() => navigate('/student/perfil')}
          src={
            student?.image
              ? returnImageLink(student.image)
              : 'https://placehold.co/130x130?text=FOTO'
          }
          style={{ cursor: 'pointer', borderRadius: '10px' }}
        />

        <div
          style={{
            width: '100%',
            fontWeight: 'bold',
            textAlign: 'center',
          }}
        >
          <p>{student?.name}</p>

          <div
            style={{
              width: '100%',
              justifyContent: 'center',
              gap: '1vw',
              display: 'flex',
            }}
          >
            <div style={{ width: '100%' }}>
              <button onClick={singout} style={{ width: '100%' }}>
                SAIR
              </button>
            </div>

            <div style={{ width: '100%' }}>
              <button
                onClick={() => navigate('/student/registration')}
                style={{ width: '100%' }}
              >
                Cursos
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
