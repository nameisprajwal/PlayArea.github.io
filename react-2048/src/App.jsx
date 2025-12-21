import React, { useEffect } from 'react'
import useGame from './hooks/useGame'
import Board from './components/Board'
import Score from './components/Score'

export default function App(){
  const { board, score, result, move, restart, handleKey, handleTouch } = useGame(4)

  useEffect(()=>{
    function onKey(e){ handleKey(e) }
    window.addEventListener('keyup', onKey)
    return ()=> window.removeEventListener('keyup', onKey)
  },[handleKey])

  return (
    <div className="app" onTouchStart={handleTouch.start} onTouchMove={handleTouch.move} onTouchEnd={handleTouch.end}>
      <div className="header">
        <h1>2048</h1>
        <Score score={score} onRestart={restart} />
      </div>
      <Board board={board} />
      {result && <div className="result">{result}</div>}
    </div>
  )
}
