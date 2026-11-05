const ProgressBar = ({ total, results, current }) => (
  <div className="progress-bar">
    {Array.from({ length: total }, (_, i) => {
      const result = results[i];
      let cls = 'progress-cell';
      if (result === 'correct') cls += ' correct';
      else if (result === 'wrong') cls += ' wrong';
      else if (result === 'skipped') cls += ' skipped';
      if (i === current) cls += ' current';
      return (
        <span key={i} className={cls}>
          {i + 1}
        </span>
      );
    })}
  </div>
);

export default ProgressBar;