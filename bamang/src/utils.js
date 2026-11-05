import { POINTS, STREAK_BONUS } from './data';

// results[i] là "correct" | "wrong" | "skipped", tương ứng questions[i]
export const calcScore = (results, questions) =>
  results.reduce(
    (acc, result, i) => {
      if (result === 'correct') {
        const streak = acc.streak + 1;
        const bonus = streak >= 3 ? STREAK_BONUS : 0;
        return { score: acc.score + POINTS[questions[i].level] + bonus, streak };
      }
      if (result === 'wrong') return { ...acc, streak: 0 };
      return acc; // câu bỏ qua: không điểm, giữ nguyên chuỗi
    },
    { score: 0, streak: 0 }
  );