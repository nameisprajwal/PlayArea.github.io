import React from 'react'

export default function Score({ score, onRestart }){
  return (
    <div className="scoreRow">
      <div className="scoreBox">
        <div className="score-title">Score</div>
        <div className="score-value">{score}</div>
      </div>
      <button onClick={onRestart}>Restart</button>
    </div>
  )
}
