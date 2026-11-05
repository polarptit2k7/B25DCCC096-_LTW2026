import { MAX_LIVES } from '../data';

const Helpers = ({ used, canUse, lives, onFifty, onSkip, onLife }) => (
  <div className="helpers">
    <button type="button" onClick={onFifty} disabled={!canUse || used.fifty}>
      50:50
    </button>
    <button type="button" onClick={onSkip} disabled={!canUse || used.skip}>
      Bỏ qua
    </button>
    <button
      type="button"
      onClick={onLife}
      disabled={!canUse || used.life || lives >= MAX_LIVES}
    >
      Thêm 1 mạng
    </button>
  </div>
);

export default Helpers;