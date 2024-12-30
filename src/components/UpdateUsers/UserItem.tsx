import { UserType } from "../../types/User.types"
import { returnImageLink } from "../../utils/ReturnImageLink"


export default function UserItem({ user, selectUser }: { user: UserType, selectUser: (user: UserType) => void }) {
  return (
    <div style={{ border: '1px solid red' }} onClick={() => selectUser(user)}>
      <div>
        <p>Nome: {user.name}</p>
      </div>
      <img width={'50px'} src={returnImageLink(user?.image)} />
    </div>
  )
}