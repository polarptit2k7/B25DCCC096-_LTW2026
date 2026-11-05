const AnswerButton = ({ text, state, hidden, disabled, onClick }) => (
  <button
    type="button"
    className={`answer-btn ${state}${hidden ? ' hidden-answer' : ''}`}
    disabled={disabled || hidden}
    onClick={onClick}
  >
    {text}
  </button>
);

export default AnswerButton;