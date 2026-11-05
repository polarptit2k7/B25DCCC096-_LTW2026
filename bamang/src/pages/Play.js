import { useEffect, useRef, useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { MAX_LIVES, TOTAL_TIME, LETTERS } from '../data';
import { calcScore } from '../utils';
import QuestionCard from '../components/QuestionCard';
import StatusBar from '../components/StatusBar';
import ProgressBar from '../components/ProgressBar';
import Helpers from '../components/Helpers';

const DEFAULT_TITLE = 'Thử thách 3 mạng';

  const PlayGame = ({ questions, playerName, onFinish }) => {
  const navigate = useNavigate();
  const total = questions.length;

  const [index, setIndex] = useState(0);
  const [results, setResults] = useState([]);
  const [lives, setLives] = useState(MAX_LIVES);
  const [timeLeft, setTimeLeft] = useState(TOTAL_TIME);
  const [status, setStatus] = useState('answering'); // answering -> locked -> revealed
  const [selected, setSelected] = useState(null);
  const [hidden, setHidden] = useState([]); // MỚI: đáp án bị 50:50 ẩn
  const [used, setUsed] = useState({ fifty: false, skip: false, life: false }); // MỚI
  const finishedRef = useRef(false);

  const question = questions[index];
  const { score, streak } = calcScore(results, questions);

  const finish = (finalResults, livesLeft, reason) => {
    if (finishedRef.current) return;
    finishedRef.current = true;
    const finalScore = calcScore(finalResults, questions).score;
    const correctCount = finalResults.filter((r) => r === 'correct').length;
    
      onFinish({
    id: Date.now(),
    name: playerName,
    score: finalScore,
    correctCount,
    livesLeft,
    playedAt: new Date().toLocaleString('vi-VN'),
  });

    navigate('/result', {
      replace: true,
      state: { name: playerName, score: finalScore, correctCount, livesLeft, reason },
    });
  };

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
      setHidden([]); // MỚI: sang câu mới thì hiện lại đủ đáp án
    }
  };

  useEffect(() => {
    if (status !== 'answering') return undefined;
    const id = setInterval(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearInterval(id);
  }, [status]);

  useEffect(() => {
    if (timeLeft <= 0 && status === 'answering') {
      finish(results, lives, 'timeout');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeLeft, status]);

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
    if (status !== 'answering' || hidden.includes(i)) return;
    setSelected(i);
    setStatus('locked');
  };

  // MỚI: phím tắt A-D
  useEffect(() => {
    const handleKey = (e) => {
      if (e.ctrlKey || e.metaKey || e.altKey) return;
      const i = LETTERS.indexOf(String(e.key).toUpperCase());
      if (i === -1) return;
      handleAnswer(i);
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, hidden]);

  // MỚI: tiêu đề tab, cleanup trả lại tiêu đề cũ
  useEffect(() => {
    document.title = `Câu ${index + 1}/${total} – còn ${lives} mạng`;
    return () => {
      document.title = DEFAULT_TITLE;
    };
  }, [index, lives, total]);

  // MỚI: 3 quyền trợ giúp
  const handleFifty = () => {
    if (status !== 'answering' || used.fifty) return;
    const wrongs = question.options
      .map((_, i) => i)
      .filter((i) => i !== question.answer && !hidden.includes(i));
    const shuffled = [...wrongs].sort(() => Math.random() - 0.5);
    setHidden((h) => [...h, ...shuffled.slice(0, 2)]);
    setUsed((u) => ({ ...u, fifty: true }));
  };

  const handleSkip = () => {
    if (status !== 'answering' || used.skip) return;
    setUsed((u) => ({ ...u, skip: true }));
    const nextResults = [...results, 'skipped'];
    setResults(nextResults);
    goNext(nextResults, lives);
  };

  const handleLife = () => {
    if (status !== 'answering' || used.life || lives >= MAX_LIVES) return;
    setLives((l) => Math.min(l + 1, MAX_LIVES));
    setUsed((u) => ({ ...u, life: true }));
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
      <Helpers
        used={used}
        canUse={status === 'answering'}
        lives={lives}
        onFifty={handleFifty}
        onSkip={handleSkip}
        onLife={handleLife}
      />
    </div>
  );
};

const Play = ({ questions, playerName, onFinish }) => {
  if (!playerName) return <Navigate to="/" replace />;
  if (questions.length === 0) return <p>Không có câu hỏi để chơi.</p>;
  return <PlayGame questions={questions} playerName={playerName} onFinish={onFinish} />;
};

export default Play;