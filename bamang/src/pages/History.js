import { formatScore } from '../data';

const History = ({ history, onClear }) => {
  // Sắp xếp trên bản sao: điểm giảm dần, bằng điểm thì nhiều mạng hơn đứng trước
  const sorted = [...history].sort(
    (a, b) => b.score - a.score || b.livesLeft - a.livesLeft
  );
  const maxScore = history.reduce((m, h) => Math.max(m, h.score), 0);
  const totalCorrect = history.reduce((sum, h) => sum + h.correctCount, 0);

  return (
    <div>
      <h2>Lịch sử các lượt chơi</h2>
      <p>{`Số lượt chơi: ${history.length}`}</p>
      <p>{`Điểm cao nhất: ${formatScore(maxScore)}`}</p>
      <p>{`Tổng số câu trả lời đúng: ${totalCorrect}`}</p>
      <button type="button" onClick={onClear} disabled={history.length === 0}>
        Xóa lịch sử
      </button>
      {history.length === 0 ? (
        <p>Chưa có lượt chơi nào</p>
      ) : (
        <table className="table">
          <thead>
            <tr>
              <th>Người chơi</th>
              <th>Số câu đúng</th>
              <th>Mạng còn lại</th>
              <th>Điểm</th>
              <th>Thời gian</th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((h) => (
              <tr key={h.id}>
                <td>{h.name}</td>
                <td>{h.correctCount}</td>
                <td>{h.livesLeft}</td>
                <td>{formatScore(h.score)}</td>
                <td>{h.playedAt}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default History;