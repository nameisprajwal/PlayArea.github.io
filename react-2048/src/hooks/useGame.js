import { useCallback, useState, useRef } from 'react'

const randEmptyIndex = (board) => {
  const empties = board.map((v,i)=> v===0? i : -1).filter(i=>i>=0)
  if (!empties.length) return -1
  return empties[Math.floor(Math.random()*empties.length)]
}

function slideAndCombineRow(row){
  const filtered = row.filter(n=>n!==0)
  const result = []
  let score = 0
  for (let i=0;i<filtered.length;i++){
    if (filtered[i] === filtered[i+1]){
      result.push(filtered[i]*2)
      score += filtered[i]*2
      i++
    } else result.push(filtered[i])
  }
  while(result.length < row.length) result.push(0)
  return { row: result, score }
}

export default function useGame(size=4){
  const cells = size*size
  const [board, setBoard] = useState(()=> Array(cells).fill(0))
  const [score, setScore] = useState(0)
  const [result, setResult] = useState('')
  const touch = useRef({startX:0,startY:0, endX:0,endY:0})

  const generate = useCallback((b)=>{
    const idx = randEmptyIndex(b)
    if (idx < 0) return b
    const copy = b.slice()
    copy[idx] = 2
    return copy
  },[])

  const init = useCallback(()=>{
    let b = Array(cells).fill(0)
    b = generate(b)
    b = generate(b)
    setBoard(b)
    setScore(0)
    setResult('')
  },[cells,generate])

  const transpose = (b) => {
    const out = Array(cells).fill(0)
    for (let r=0;r<size;r++){
      for (let c=0;c<size;c++){
        out[c*size + r] = b[r*size + c]
      }
    }
    return out
  }

  const moveLeft = useCallback((b)=>{
    let changed = false; let gained = 0
    const out = []
    for (let r=0;r<size;r++){
      const row = b.slice(r*size, r*size+size)
      const { row: newRow, score: s } = slideAndCombineRow(row)
      gained += s
      out.push(...newRow)
      if (newRow.join(',') !== row.join(',')) changed = true
    }
    return { board: out, changed, gained }
  },[size])

  const moveRight = useCallback((b)=>{
    const rev = b.slice()
    for (let r=0;r<size;r++){
      rev.splice(r*size, size, ...b.slice(r*size, r*size+size).reverse())
    }
    const { board: moved, changed, gained } = moveLeft(rev)
    const out = []
    for (let r=0;r<size;r++) out.push(...moved.slice(r*size, r*size+size).reverse())
    return { board: out, changed, gained }
  },[size,moveLeft])

  const moveUp = useCallback((b)=>{
    const t = transpose(b)
    const { board: moved, changed, gained } = moveLeft(t)
    return { board: transpose(moved), changed, gained }
  },[size,moveLeft])

  const moveDown = useCallback((b)=>{
    const t = transpose(b)
    const { board: moved, changed, gained } = moveRight(t)
    return { board: transpose(moved), changed, gained }
  },[size,moveRight])

  const checkWin = useCallback((b)=> b.some(v=>v===2048),[])
  const hasMoves = useCallback((b)=>{
    if (b.some(v=>v===0)) return true
    // check horizontal
    for (let r=0;r<size;r++){
      for (let c=0;c<size-1;c++){
        if (b[r*size+c] === b[r*size+c+1]) return true
      }
    }
    // check vertical
    for (let c=0;c<size;c++){
      for (let r=0;r<size-1;r++){
        if (b[r*size+c] === b[(r+1)*size+c]) return true
      }
    }
    return false
  },[size])

  const performMove = useCallback((dir)=>{
    setBoard((prev)=>{
      let resultObj
      if (dir === 'left') resultObj = moveLeft(prev)
      else if (dir === 'right') resultObj = moveRight(prev)
      else if (dir === 'up') resultObj = moveUp(prev)
      else resultObj = moveDown(prev)

      if (!resultObj.changed) return prev
      const afterGen = generate(resultObj.board)
      setScore(s => s + resultObj.gained)
      if (checkWin(afterGen)) setResult('You WIN')
      if (!hasMoves(afterGen)) setResult('You LOSE')
      return afterGen
    })
  },[generate,moveLeft,moveRight,moveUp,moveDown,checkWin,hasMoves])

  // keyboard handler
  const handleKey = useCallback((e)=>{
    if (e.key === 'ArrowLeft') performMove('left')
    else if (e.key === 'ArrowRight') performMove('right')
    else if (e.key === 'ArrowUp') performMove('up')
    else if (e.key === 'ArrowDown') performMove('down')
  },[performMove])

  // touch handlers
  const handleTouch = {
    start: (e)=>{
      const t = e.changedTouches[0]; touch.current.startX = t.clientX; touch.current.startY = t.clientY
    },
    move: (e)=>{ const t = e.changedTouches[0]; touch.current.endX = t.clientX; touch.current.endY = t.clientY },
    end: (e)=>{
      const dx = touch.current.endX - touch.current.startX
      const dy = touch.current.endY - touch.current.startY
      const absDx = Math.abs(dx), absDy = Math.abs(dy)
      if (Math.max(absDx, absDy) < 20) return
      if (absDx > absDy){ if (dx>0) performMove('right'); else performMove('left') }
      else { if (dy>0) performMove('down'); else performMove('up') }
    }
  }

  const restart = useCallback(()=> init(),[init])

  // initialize on first mount
  if (board.every(v=> v===0)) init()

  return { board, score, result, move: performMove, restart, handleKey, handleTouch }
}
