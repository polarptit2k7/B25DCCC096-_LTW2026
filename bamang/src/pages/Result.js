import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { formatScore } from '../data';

const TITLES = {
  perfect: 'Xuất sắc! Bạn đã trả lời đúng cả 15 câu',
  completed: 'Bạn đã hoàn thành thử thách',
  lives: 'Bạn đã hết mạng',
  timeout: 'Hết giờ!',
};

const Result = () => {
  const navigate = useNavigate();
  const { state } = useLocation();

  if (!state) return <Navigate to="/" replace />;

  const { name, score, correctCount, livesLeft, reason } = state;

  return (
    <div>
      <h2>{TITLES[reason]}</h2>
      <p>{`Người chơi: ${name}`}</p>
      <p>{`Số câu trả lời đúng: ${correctCount}`}</p>
      <p>{`Số mạng còn lại: ${livesLeft}`}</p>
      <p>{`Điểm: ${formatScore(score)}`}</p>
      <button type="button" onClick={() => navigate('/play')}>Chơi lại</button>{' '}
      <button type="button" onClick={() => navigate('/')}>Về trang chủ</button>
    </div>
  );
};

export default Result;