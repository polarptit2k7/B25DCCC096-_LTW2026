import { LEVELS, LETTERS, POINTS, formatScore } from '../data';
import AnswerButton from './AnswerButton';

const getState = (i, question, status, selected) => {
  if (status === 'locked') return i === selected ? 'selected' : 'default';
  if (status === 'revealed') {
    if (i === question.answer) return 'correct';
    if (i === selected) return 'wrong';
  }
  return 'default';
};

const QuestionCard = ({ question, index, total, status, selected, hidden, onSelect }) => (
  <div className="question-card">
    <p className="question-meta">
      {`Câu ${index + 1}/${total} · ${LEVELS[question.level]} · ${formatScore(
        POINTS[question.level]
      )}`}
    </p>
    <h2>{question.question}</h2>
    <div className="answer-grid">
      {question.options.map((option, i) => (
        <AnswerButton
          key={i}
          text={hidden.includes(i) ? '' : `${LETTERS[i]}. ${option}`}
          state={getState(i, question, status, selected)}
          hidden={hidden.includes(i)}
          disabled={status !== 'answering'}
          onClick={() => onSelect(i)}
        />
      ))}
    </div>
  </div>
);

export default QuestionCard;