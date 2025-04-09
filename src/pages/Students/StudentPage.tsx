import StudentCreate from './StudentCreate';
import StudentLogin from './StudentLogin';

export default function StudentPage() {
  return (
    <div style={{ display: 'flex' }}>
      <div style={{ width: '50vw', border: '1px solid' }}>
        <StudentCreate></StudentCreate>
      </div>
      <div style={{ width: '50vw', border: '1px solid' }}>
        <StudentLogin></StudentLogin>
      </div>
    </div>
  );
}
