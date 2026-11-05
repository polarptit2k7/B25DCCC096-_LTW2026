import { useNavigate } from 'react-router-dom';
import { MAX_LIVES, TOTAL_TIME, formatScore } from '../data';

const Home = ({ playerName, setPlayerName, history }) => {
  const navigate = useNavigate();

  // Lượt có điểm cao nhất; bằng điểm thì lượt còn nhiều mạng hơn
  const best = history.reduce((b, h) => {
    if (!b) return h;
    if (h.score > b.score) return h;
    if (h.score === b.score && h.livesLeft > b.livesLeft) return h;
    return b;
  }, null);

  const handleChange = (e) => setPlayerName(e.target.value);

  const handleSubmit = (e) => {
    e.preventDefault();
    const name = playerName.trim();
    if (!name) return;
    setPlayerName(name);
    navigate('/play');
  };

  return (
    <div>
      <h1>Thử thách 3 mạng</h1>
      {best && <p>{`Kỷ lục: ${formatScore(best.score)} – ${best.name}`}</p>}
      <ul>
        <li>{`Bạn có ${MAX_LIVES} mạng và ${TOTAL_TIME} giây cho cả lượt chơi để trả lời 15 câu hỏi.`}</li>
        <li>Trả lời đúng được cộng điểm theo mức độ; từ câu đúng thứ 3 liên tiếp được thưởng thêm 50 điểm.</li>
        <li>Trả lời sai mất một mạng nhưng vẫn đi tiếp. Đồng hồ chỉ chạy khi bạn đang trả lời.</li>
        <li>Lượt chơi kết thúc khi hết câu, hết mạng hoặc hết giờ.</li>
      </ul>
      <form onSubmit={handleSubmit}>
        <label>
          Tên người chơi:{' '}
          <input
            type="text"
            value={playerName}
            onChange={handleChange}
            placeholder="Nhập tên của bạn"
          />
        </label>{' '}
        <button type="submit" disabled={playerName.trim() === ''}>
          Bắt đầu
        </button>
      </form>
    </div>
  );
};

export default Home;