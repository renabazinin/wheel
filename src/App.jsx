import React, { useState } from 'react'; // Added useState
import Wheel from './Wheel';
import data from './data.json';
import './Wheel.css'; // Import the new CSS for App layout styles

export default function App() {
  const [winner, setWinner] = useState(null);

  const handleSpinEnd = (winningItem) => {
    setWinner(winningItem);
    // Optionally, you can add a timeout to clear the winner message
    // setTimeout(() => setWinner(null), 5000);
  };

  return (
    <div className="app-container"> {/* Use class for centering and background */}
      <h1 className="app-title">Spin the Wheel!</h1> {/* Use class for title styling */}
      <Wheel data={data} size={400} onSpinEnd={handleSpinEnd} /> {/* Increased size */}
      {winner && (
        <div className="winner-announcement">
          Congratulations! You won: {winner.label}
        </div>
      )}
    </div>
  );
}
