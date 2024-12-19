import { useContext } from "react"
import { useNavigate } from "react-router-dom"
import { AuthContext } from "../contexts/AuthContext"

export default function Navbar() {

  const context = useContext(AuthContext)

  if (!context) {
    throw new Error('Falta contexto');
  };

  const { tokens, user, isLoading, logout } = context

  async function singout() {
    const res = await logout();
    console.log(res);
  }

  const navigate = useNavigate()

  return (
    <div>
      <div>
        {JSON.stringify(tokens)}
      </div>
      <div>
        {JSON.stringify(user)}
      </div>
      <div>
        {`Is Loading? ${isLoading}`}
      </div>

      <button onClick={singout}>
        SAIR
      </button>

      <button onClick={() => navigate('/CreateUser')}>
        USUARIOS
      </button>

      <button onClick={() => navigate('/CreateCourse')}>
        CURSOS
      </button>
    </div>
  )
}