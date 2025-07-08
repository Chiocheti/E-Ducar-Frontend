import { UserType } from '../../types/UserTypes';

export default function UserItem({
  user,
  selectUser,
}: {
  user: UserType;
  selectUser: (user: UserType) => void;
}) {
  return (
    <div style={{ border: '1px solid red' }} onClick={() => selectUser(user)}>
      <div>
        <p>Nome: {user.name}</p>
      </div>

      <img width={'50px'} src={user?.image} />
    </div>
  );
}
