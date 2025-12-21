import React from 'react'
import Tile from './Tile'

export default function Board({ board }){
  return (
    <div className="grid">
      {board.map((v,i)=>(<Tile key={i} value={v} />))}
    </div>
  )
}
