const BUILD_TAG = "tm-6852";
/* eslint-disable import/first */
import { useEffect, useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import axios from 'axios';
import './App.css';
import Layout from './components/Layout';
import QuestionBank from './pages/QuestionBank';
import QuestionDetail from './pages/QuestionDetail';
import NotFound from './pages/NotFound';
import Home from './pages/Home';
import Play from './pages/Play';
import History from './pages/History';
import Result from './pages/Result';

const App = () => {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [playerName, setPlayerName] = useState('');
  const [history, setHistory] = useState(() => {
  try {
    const raw = localStorage.getItem('ltw_3mang_history');
    const data = raw ? JSON.parse(raw) : [];
    return Array.isArray(data) ? data : [];
  } catch (err) {
    return [];
  }
});

  useEffect(() => {
    const controller = new AbortController();
    axios
      .get('/data/questions.json', { signal: controller.signal })
      .then((res) => {
        if (!Array.isArray(res.data)) throw new Error('Dữ liệu không hợp lệ');
        setQuestions(res.data);
        setLoading(false);
      })
      .catch((err) => {
        if (axios.isCancel(err)) return; // request bị hủy thì bỏ qua
        setError(true);
        setLoading(false);
      });
    return () => controller.abort();
  }, []);

  useEffect(() => {
  localStorage.setItem('ltw_3mang_history', JSON.stringify(history));
}, [history]);

const addHistory = (record) => setHistory((prev) => [...prev, record]);
const clearHistory = () => setHistory([]);

  

  return (
    <div data-build={BUILD_TAG}>
      <Routes>
        <Route path="/" element={<Layout loading={loading} error={error} />}>
          <Route index element={<Home playerName={playerName} setPlayerName={setPlayerName} history={history} />} />
          <Route path="play" element={<Play questions={questions} playerName={playerName} onFinish={addHistory} />} />
          <Route path="result" element={<Result />} />
          <Route path="history" element={<History history={history} onClear={clearHistory} />} />
          <Route path="questions" element={<QuestionBank questions={questions} />} />
          <Route path="questions/:id" element={<QuestionDetail questions={questions} />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </div>
  );
};

export default App;