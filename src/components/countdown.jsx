import { useState, useEffect } from 'react';

function CountdownTimer({ expiresAt }) {
  const [timeLeft, setTimeLeft] = useState(() => {
    const diff = Date.parse(expiresAt + 'Z') - Date.now();
    return Math.max(0, diff);
  });

  useEffect(() => {
    const update = () => {
      const diff = Date.parse(expiresAt + 'Z') - Date.now();
      setTimeLeft(Math.max(0, diff));
    };

    update();
    const timer = setInterval(update, 1000);
    return () => clearInterval(timer);
  }, [expiresAt]);

  const formatTime = (ms) => {
    const totalSec = Math.floor(ms / 1000);
    const min = String(Math.floor(totalSec / 60)).padStart(2, '0');
    const sec = String(totalSec % 60).padStart(2, '0');
    return `${min}:${sec}`;
  };

  return (
    <div>
      {timeLeft > 0 ? (
        <p> Chúng tôi sẽ tạm giữ phòng cho bạn, vui lòng thanh toán trong:⏳ <strong>{formatTime(timeLeft)}</strong></p>
      ) : (
        <p style={{ color: 'red' }}>⚠️ Đơn đặt phòng của bạn đã hết hạn thanh toán</p>
      )}
    </div>
  );
}

export default CountdownTimer;
