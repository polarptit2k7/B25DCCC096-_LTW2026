import { useEffect, useRef, useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { MAX_LIVES, TOTAL_TIME } from '../data';
import { calcScore } from '../utils';
import QuestionCard from '../components/QuestionCard';
import StatusBar from '../components/StatusBar';
import ProgressBar from '../components/ProgressBar';

const PlayGame = ({ questions, playerName }) => {
  const navigate = useNavigate();
  const total = questions.length;

  const [index, setIndex] = useState(0);
  const [results, setResults] = useState([]);
  const [lives, setLives] = useState(MAX_LIVES);
  const [timeLeft, setTimeLeft] = useState(TOTAL_TIME);
  const [status, setStatus] = useState('answering'); // answering -> locked -> revealed
  const [selected, setSelected] = useState(null);
  const [hidden] = useState([]);
  const finishedRef = useRef(false);

  const question = questions[index];
  const { score, streak } = calcScore(results, questions);

  // Kết thúc lượt chơi: tính điểm rồi sang trang kết quả
  const finish = (finalResults, livesLeft, reason) => {
    if (finishedRef.current) return;
    finishedRef.current = true;
    const finalScore = calcScore(finalResults, questions).score;
    const correctCount = finalResults.filter((r) => r === 'correct').length;
    navigate('/result', {
      replace: true,
      state: { name: playerName, score: finalScore, correctCount, livesLeft, reason },
    });
  };

  // Sang câu tiếp theo hoặc kết thúc
  const goNext = (finalResults, livesNow) => {
    if (livesNow <= 0) {
      finish(finalResults, livesNow, 'lives');
    } else if (finalResults.length >= total) {
      const perfect = finalResults.every((r) => r === 'correct');
      finish(finalResults, livesNow, perfect ? 'perfect' : 'completed');
    } else {
      setIndex((i) => i + 1);
      setStatus('answering');
      setSelected(null);
    }
  };

  // Đồng hồ chung: chỉ chạy khi đang trả lời
  useEffect(() => {
    if (status !== 'answering') return undefined;
    const id = setInterval(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearInterval(id);
  }, [status]);

  // Hết giờ thì kết thúc ngay
  useEffect(() => {
    if (timeLeft <= 0 && status === 'answering') {
      finish(results, lives, 'timeout');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeLeft, status]);

  // Các bước chờ: locked -> (1s) revealed -> (1s) câu tiếp theo
  useEffect(() => {
    if (status === 'locked') {
      const t = setTimeout(() => {
        const correct = selected === question.answer;
        setResults((r) => [...r, correct ? 'correct' : 'wrong']);
        if (!correct) setLives((l) => l - 1);
        setStatus('revealed');
      }, 1000);
      return () => clearTimeout(t);
    }
    if (status === 'revealed') {
      const t = setTimeout(() => goNext(results, lives), 1000);
      return () => clearTimeout(t);
    }
    return undefined;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);

  const handleAnswer = (i) => {
    if (status !== 'answering') return;
    setSelected(i);
    setStatus('locked');
  };

  return (
    <div className="play">
      <StatusBar timeLeft={timeLeft} lives={lives} score={score} streak={streak} />
      <ProgressBar total={total} results={results} current={index} />
      <QuestionCard
        question={question}
        index={index}
        total={total}
        status={status}
        selected={selected}
        hidden={hidden}
        onSelect={handleAnswer}
      />
    </div>
  );
};

const Play = ({ questions, playerName }) => {
  if (!playerName) return <Navigate to="/" replace />;
  if (questions.length === 0) return <p>Không có câu hỏi để chơi.</p>;
  return <PlayGame questions={questions} playerName={playerName} />;
};

export default Play;