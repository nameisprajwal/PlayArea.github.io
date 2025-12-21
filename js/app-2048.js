  
"use strict";
document.addEventListener('DOMContentLoaded', load2048game) 
  
function load2048game() {

  const gridDisplay = document.querySelector('.grid')
  let squares = []
  const width = 4

  const scoreDisplay = document.getElementById('score')
  let score = 0

  const resultDisplay = document.getElementById('result')

  createEmptyBoard(width, gridDisplay, squares)
  populateATile()
  populateATile()

  document.addEventListener('keyup', control)

  var myTimer = setInterval(addColours, 50)
  addColours()

  

  function populateATile() {
    checkForGameOver()
    let randomNumber = Math.floor(Math.random() * squares.length)
    if (squares[randomNumber].innerHTML == 0) {
      squares[randomNumber].innerHTML = 2   
    } else populateATile()
  }
  
   function checkForGameOver() { //TODO: merge the for loops, optimise with 'return' statement
    let zeros = 0
    let horizontalCheck = 0
    let verticalCheck = 0   
    
    let check = 0
    for (let i=0; i < squares.length; i++) {
      if (squares[i].innerHTML == 0) {
        zeros++
        check++
      }

      if ( (i+1) % 4 !== 0  &&  i + 1 < squares.length ) { //change 4 to width to make it dynamic
        if (squares[i].innerHTML === squares[i +1].innerHTML) {
          horizontalCheck++
          check++
        }
      }

      if (i < squares.length - 4) { //change 4 to width to make it dynamic
        if (squares[i].innerHTML === squares[i +4].innerHTML) {
          verticalCheck++
          check++
        }
      }

    }


    if (check === 0) { //change check to zeros in "make it interesting" version
      resultDisplay.innerHTML = 'You LOSE'
      document.removeEventListener('keyup', control)
      setTimeout(() => clear(), 3000)
    }
  }

  function checkForGameOverOld() {  
    let zeros = 0
    for (let i=0; i < squares.length; i++) {
      if (squares[i].innerHTML == 0) {
        zeros++
      }
    }
    if (zeros === 0) {
      resultDisplay.innerHTML = 'You LOSE'
      document.removeEventListener('keyup', control)
      setTimeout(() => clear(), 3000)
    }
  }

  function moveRight() {
    for (let i=0; i < 16; i++) {
      if (i % 4 === 0) {
        let totalOne = squares[i].innerHTML
        let totalTwo = squares[i+1].innerHTML
        let totalThree = squares[i+2].innerHTML
        let totalFour = squares[i+3].innerHTML
        let row = [parseInt(totalOne), parseInt(totalTwo), parseInt(totalThree), parseInt(totalFour)]

        let filteredRow = row.filter(num => num)
        let missing = 4 - filteredRow.length
        let zeros = Array(missing).fill(0)
        let newRow = zeros.concat(filteredRow)

        squares[i].innerHTML = newRow[0]
        squares[i +1].innerHTML = newRow[1]
        squares[i +2].innerHTML = newRow[2]
        squares[i +3].innerHTML = newRow[3]
      }
    }
  }

  function moveLeft() {
    for (let i=0; i < 16; i++) {
      if (i % 4 === 0) {
        let totalOne = squares[i].innerHTML
        let totalTwo = squares[i+1].innerHTML
        let totalThree = squares[i+2].innerHTML
        let totalFour = squares[i+3].innerHTML
        let row = [parseInt(totalOne), parseInt(totalTwo), parseInt(totalThree), parseInt(totalFour)]

        let filteredRow = row.filter(num => num)
        let missing = 4 - filteredRow.length
        let zeros = Array(missing).fill(0)
        let newRow = filteredRow.concat(zeros)

        squares[i].innerHTML = newRow[0]
        squares[i +1].innerHTML = newRow[1]
        squares[i +2].innerHTML = newRow[2]
        squares[i +3].innerHTML = newRow[3]
      }
    }
  }


  function moveUp() {
    for (let i=0; i < 4; i++) {
      let totalOne = squares[i].innerHTML
      let totalTwo = squares[i+width].innerHTML
      let totalThree = squares[i+(width*2)].innerHTML
      let totalFour = squares[i+(width*3)].innerHTML
      let column = [parseInt(totalOne), parseInt(totalTwo), parseInt(totalThree), parseInt(totalFour)]

      let filteredColumn = column.filter(num => num)
      let missing = 4 - filteredColumn.length
      let zeros = Array(missing).fill(0)
      let newColumn = filteredColumn.concat(zeros)

      squares[i].innerHTML = newColumn[0]
      squares[i +width].innerHTML = newColumn[1]
      squares[i+(width*2)].innerHTML = newColumn[2]
      squares[i+(width*3)].innerHTML = newColumn[3]
    }
  }

  function moveDown() {
    for (let i=0; i < 4; i++) {
      let totalOne = squares[i].innerHTML
      let totalTwo = squares[i+width].innerHTML
      let totalThree = squares[i+(width*2)].innerHTML
      let totalFour = squares[i+(width*3)].innerHTML
      let column = [parseInt(totalOne), parseInt(totalTwo), parseInt(totalThree), parseInt(totalFour)]

      let filteredColumn = column.filter(num => num)
      let missing = 4 - filteredColumn.length
      let zeros = Array(missing).fill(0)
      let newColumn = zeros.concat(filteredColumn)

      squares[i].innerHTML = newColumn[0]
      squares[i +width].innerHTML = newColumn[1]
      squares[i+(width*2)].innerHTML = newColumn[2]
      squares[i+(width*3)].innerHTML = newColumn[3]
    }
  }

  function combineRow() {
    for (let i =0; i < 15; i++) {
      if (squares[i].innerHTML === squares[i +1].innerHTML) {
        let combinedTotal = parseInt(squares[i].innerHTML) + parseInt(squares[i +1].innerHTML)
        squares[i].innerHTML = combinedTotal
        squares[i +1].innerHTML = 0
        score += combinedTotal
        scoreDisplay.innerHTML = score
      }
    }
    checkForWin()
  }

  function combineColumn() {
    for (let i =0; i < 12; i++) {
      if (squares[i].innerHTML === squares[i +width].innerHTML) {
        let combinedTotal = parseInt(squares[i].innerHTML) + parseInt(squares[i +width].innerHTML)
        squares[i].innerHTML = combinedTotal
        squares[i +width].innerHTML = 0
        score += combinedTotal
        scoreDisplay.innerHTML = score
      }
    }
    checkForWin()
  }

  function control(e) {
    if(e.keyCode === 37) {
      keyLeft()
    } else if (e.keyCode === 38) {
      keyUp()
    } else if (e.keyCode === 39) {
      keyRight()
    } else if (e.keyCode === 40) {
      keyDown()
    }
  }

  function keyRight() {
    moveRight()
    combineRow()
    moveRight()
    populateATile()
  }

  function keyLeft() {
    moveLeft()
    combineRow()
    moveLeft()
    populateATile()
  }

  function keyUp() {
    moveUp()
    combineColumn()
    moveUp()
    populateATile()
  }

  function keyDown() {
    moveDown()
    combineColumn()
    moveDown()
    populateATile()
  }

  function checkForWin() {
    for (let i=0; i < squares.length; i++) {
      if (squares[i].innerHTML == 2048) {
        resultDisplay.innerHTML = 'You WIN'
        document.removeEventListener('keyup', control)
        setTimeout(() => clear(), 3000)
      }
    }
  }

  function clear() {
    clearInterval(myTimer)
  }

  function addColours() {
    for (let i=0; i < squares.length; i++) {
      if (squares[i].innerHTML == 0) squares[i].style.backgroundColor = '#8a7f73'
      else if (squares[i].innerHTML == 2) squares[i].style.backgroundColor = '#eee4da'
      else if (squares[i].innerHTML  == 4) squares[i].style.backgroundColor = '#ede0c8' 
      else if (squares[i].innerHTML  == 8) squares[i].style.backgroundColor = '#f2b179' 
      else if (squares[i].innerHTML  == 16) squares[i].style.backgroundColor = '#ffcea4' 
      else if (squares[i].innerHTML  == 32) squares[i].style.backgroundColor = '#e8c064' 
      else if (squares[i].innerHTML == 64) squares[i].style.backgroundColor = '#ffab6e' 
      else if (squares[i].innerHTML == 128) squares[i].style.backgroundColor = '#fd9982' 
      else if (squares[i].innerHTML == 256) squares[i].style.backgroundColor = '#ead79c' 
      else if (squares[i].innerHTML == 512) squares[i].style.backgroundColor = '#76daff' 
      else if (squares[i].innerHTML == 1024) squares[i].style.backgroundColor = '#beeaa5' 
      else if (squares[i].innerHTML == 2048) squares[i].style.backgroundColor = '#d7d4f0' 
    }
  }

  // enable touch interactions for mobile (swipe support) - start
  document.body.style.touchAction = 'none'
  let touchStartX = null
  let touchStartY = null
  let touchEndX = null
  let touchEndY = null

  document.addEventListener('touchstart', function(e) {
    const t = e.changedTouches[0]
    touchStartX = t.clientX
    touchStartY = t.clientY
    touchEndX = null
    touchEndY = null
  }, {passive: true})

  document.addEventListener('touchmove', function(e) {
    // prevent the page from scrolling when swiping on the screen
    e.preventDefault()
    const t = e.changedTouches[0]
    touchEndX = t.clientX
    touchEndY = t.clientY
  }, {passive: false})

  document.addEventListener('touchend', function() {
    if (touchStartX === null || touchStartY === null) return
    // if touchmove didn't set end coords, treat as a tap (no action)
    const endX = (touchEndX === null) ? touchStartX : touchEndX
    const endY = (touchEndY === null) ? touchStartY : touchEndY

    const dx = endX - touchStartX
    const dy = endY - touchStartY
    const absDx = Math.abs(dx)
    const absDy = Math.abs(dy)
    const threshold = 30 // minimum px for a swipe

    if (absDx > absDy && absDx > threshold) {
      if (dx > 0) keyRight()
      else keyLeft()
    } else if (absDy > threshold) {
      if (dy > 0) keyDown()
      else keyUp()
    }

    touchStartX = null
    touchStartY = null
    touchEndX = null
    touchEndY = null
  }, false)
  // enable touch interactions for mobile (swipe support) - end

}

function createEmptyBoard(inputWidth, gridElement, squaresArray) {
    for (let i=0; i < inputWidth*inputWidth; i++) {
      let square = document.createElement('div') //css takes care of stayig within grid
      square.innerHTML = 0
      gridElement.appendChild(square)
      squaresArray.push(square)
    }
}