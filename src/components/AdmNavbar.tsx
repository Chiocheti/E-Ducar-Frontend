import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../contexts/UserContext';
import { returnImageLink } from '../utils/ReturnImageLink';

export default function AdmNavbar() {
  const context = useContext(UserContext);
  if (!context) throw new Error('Falta contexto');
  const { user, logout } = context;

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
      <div style={{ display: 'flex', padding: '1vw', gap: '1vw' }}>
        <img
          height={'100vh'}
          onClick={() => navigate('/adm/UserPerfil')}
          src={returnImageLink(user?.image || '')}
          style={{ cursor: 'pointer', borderRadius: '10px' }}
        />

        <div
          style={{
            width: '100%',
            fontWeight: 'bold',
            textAlign: 'center',
          }}
        >
          <p>{user?.name.toLocaleUpperCase()}</p>

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
                onClick={() => navigate('/adm/UserCreate')}
                style={{ width: '100%' }}
              >
                CREATE USERS
              </button>
            </div>

            <div style={{ width: '100%' }}>
              <button
                onClick={() => navigate('/adm/UserUpdate')}
                style={{ width: '100%' }}
              >
                UPDATE USERS
              </button>
            </div>

            <div style={{ width: '100%' }}>
              <button
                onClick={() => navigate('/adm/CourseCreate')}
                style={{ width: '100%' }}
              >
                CREATE CURSOS
              </button>
            </div>

            <div style={{ width: '100%' }}>
              <button
                onClick={() => navigate('/adm/CourseUpdate')}
                style={{ width: '100%' }}
              >
                UPDATE CURSOS
              </button>
            </div>

            <div style={{ width: '100%' }}>
              <button
                onClick={() => navigate('/adm/CollaboratorCreate')}
                style={{ width: '100%' }}
              >
                CREATE COLLABORATORS
              </button>
            </div>

            <div style={{ width: '100%' }}>
              <button
                onClick={() => navigate('/adm/CollaboratorUpdate')}
                style={{ width: '100%' }}
              >
                UPDATE COLLABORATORS
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
