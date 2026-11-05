import { Link, useNavigate, useParams } from 'react-router-dom';
import { LEVELS, LETTERS, POINTS, formatScore } from '../data';

const QuestionDetail = ({ questions }) => {
  const navigate = useNavigate();
  const { id } = useParams();
  const numId = Number(id);
  const index = questions.findIndex((q) => q.id === numId);
  const question = index >= 0 ? questions[index] : undefined;

  if (!question) {
    return (
      <div>
        <p>Không tìm thấy câu hỏi</p>
        <button type="button" onClick={() => navigate(-1)}>
          Quay lại
        </button>
      </div>
    );
  }

  const prev = questions[index - 1];
  const next = questions[index + 1];

  return (
    <div>
      <h2>{`Câu hỏi số ${question.id} (${LEVELS[question.level]} · ${formatScore(
        POINTS[question.level]
      )})`}</h2>
      <p>{question.question}</p>
      <ul className="option-list">
        {question.options.map((option, i) => (
          <li key={i} className={i === question.answer ? 'option correct' : 'option'}>
            {`${LETTERS[i]}. `}
            {option}
            {i === question.answer && ' (Đáp án đúng)'}
          </li>
        ))}
      </ul>
      <div className="detail-nav">
        {prev && <Link to={`/questions/${prev.id}`}>← Câu trước</Link>}
        {next && <Link to={`/questions/${next.id}`}>Câu sau →</Link>}
      </div>
      <button type="button" onClick={() => navigate(-1)}>
        Quay lại
      </button>
    </div>
  );
};

export default QuestionDetail;