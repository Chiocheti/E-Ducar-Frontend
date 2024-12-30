import { useContext } from "react"
import { useNavigate } from "react-router-dom"
import { AuthContext } from "../contexts/AuthContext"
import { returnImageLink } from "../utils/ReturnImageLink"

export default function Navbar() {

  const context = useContext(AuthContext)

  if (!context) {
    throw new Error('Falta contexto');
  };

  const { user, logout } = context

  async function singout() {
    const res = await logout();
    console.log(res);
  }

  const navigate = useNavigate()

  return (
    <div>
      <p>\/\/\/\/\/\/\/\/ NAVBAR \/\/\/\/\/\/\/\/</p>

      <p>Usuario: {user?.name}</p>

      <img width={'50px'} src={returnImageLink(user?.image || '')} />

      <button onClick={singout}>
        SAIR
      </button>

      <button onClick={() => navigate('/UpdateUser')}>
        UPDATE USERS
      </button>

      <button onClick={() => navigate('/CreateUser')}>
        CREATE USERS
      </button>

      <button onClick={() => navigate('/CreateCourse')}>
        CURSOS
      </button>

      <p>/\/\/\/\/\/\/\ NAVBAR /\/\/\/\/\/\/\</p>
      </div>
        )
}