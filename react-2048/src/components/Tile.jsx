import React from 'react'

const classFor = (v) => v === 0 ? 'tile empty' : `tile t${v}`

export default function Tile({ value }){
  return (
    <div className={classFor(value)}>
      {value !== 0 ? value : ''}
    </div>
  )
}
