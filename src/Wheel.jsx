import React, { useRef, useEffect, useState } from 'react';
import './Wheel.css';

export default function Wheel({ data, size = 350, onSpinEnd }) {
  const canvasRef = useRef();
  const [spinning, setSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);

  // Draw segments whenever data or size changes
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    canvas.width = canvas.height = size;
    const segmentAngle = (2 * Math.PI) / data.length;

    ctx.clearRect(0, 0, size, size);
    data.forEach((item, i) => {
      const start = i * segmentAngle;
      const end = start + segmentAngle;

      ctx.beginPath();
      ctx.moveTo(size / 2, size / 2);
      ctx.arc(size / 2, size / 2, size / 2 - 5, start, end);
      ctx.closePath();
      ctx.fillStyle = item.color;
      ctx.fill();

      ctx.save();
      ctx.translate(size / 2, size / 2);
      ctx.rotate(start + segmentAngle / 2);
      ctx.textAlign = 'right';
      ctx.fillStyle = '#fff';
      ctx.font = 'bold 16px Arial';
      ctx.fillText(item.label, size / 2 - 25, 0);
      ctx.restore();
    });
  }, [data, size]);

  const spin = () => {
    if (spinning) return;
    setSpinning(true);

    const initialRot = rotation;
    const spins = Math.floor(Math.random() * 8) + 8; // 8–15 full turns
    const extraDeg = spins * 360 + Math.random() * 360;
    const targetRot = initialRot - extraDeg;

    // Determine winner ahead of time
    const segDeg = 360 / data.length;
    const endDeg = ((targetRot % 360) + 360) % 360;
    const pointer = (270 - endDeg + 360) % 360;
    const winnerIdx = Math.floor(pointer / segDeg) % data.length;

    const duration = 5000;
    const startTime = performance.now();

    const animate = now => {
      const elapsed = now - startTime;
      const t = Math.min(elapsed / duration, 1);
      // Ease-out: starts fast, slows down
      const eased = 1 - Math.pow(1 - t, 5);
      setRotation(initialRot - extraDeg * eased);

      if (t < 1) {
        requestAnimationFrame(animate);
      } else {
        setRotation(targetRot);
        setSpinning(false);
        onSpinEnd(data[winnerIdx]);
      }
    };

    requestAnimationFrame(animate);
  };

  return (
    <div className="wheel-container">
      <div className="pointer-container" />
      <canvas
        ref={canvasRef}
        className="wheel-canvas"
        style={{ transform: `rotate(${rotation}deg)`, transition: 'none' }}
      />
      <button onClick={spin} disabled={spinning} className="spin-button">
        {spinning ? 'Spinning…' : 'SPIN!'}
      </button>
    </div>
  );
}
