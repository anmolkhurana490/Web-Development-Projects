import { useEffect, useState, useRef } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  const rows = 15
  const cols = 20
  const block_size = 30
  const drop_length = 5
  const droppingTime = 150 // how fast the drops falls per block
  const colorChangeTime = 2000 // how fast the color changes

  const [grid, setGrid] = useState(Array.from({ length: rows }, () => Array(cols).fill({ drop: false, color: [0, 0, 0] })))

  const currColor = useRef([0, 0, 0])
  const lastEmptyFullRow = useRef(Array(cols).fill(rows - 1))
  const currColorDiff = useRef(Array(cols).fill([0, 0, 0]))

  const [day, setDay] = useState(true)
  const [raining, setRaining] = useState(false)

  const randomColor = () => {
    let val1 = Math.floor(Math.random() * 255)
    let val2 = Math.floor(Math.random() * 255)
    let val3 = Math.floor(Math.random() * 255)
    return [val1, val2, val3]
  }

  const dropColorChange = (color, colorDiff) => {
    let val1 = color[0] - colorDiff[0]
    let val2 = color[1] - colorDiff[1]
    let val3 = color[2] - colorDiff[2]
    return [val1, val2, val3]
  }

  const assignDrop = () => {
    if (Math.random() > 0.9)
      return { color: currColor.current, drop: true }
    else return { color: [0, 0, 0], drop: false }
  }

  const updateGrid = () => {
    setGrid(prevGrid => {
      const newGrid = prevGrid.map(row => row.map(cell => ({ ...cell })))
      for (let i = rows - 1; i > 0; i--) {
        for (let j = 0; j < cols; j++) {
          newGrid[i][j] = newGrid[i - 1][j]
        }
      }
      for (let j = 0; j < cols; j++) {
        let val = newGrid[0][j]
        if (val.drop) {
          if (lastEmptyFullRow.current[j] >= drop_length - 1) {
            newGrid[0][j] = { color: [0, 0, 0], drop: false }
            lastEmptyFullRow.current[j] = 0
          }
          else {
            newGrid[0][j] = { color: dropColorChange(val.color, currColorDiff.current[j]), drop: true }
            lastEmptyFullRow.current[j]++
          }
        }
        else {
          if (lastEmptyFullRow.current[j] >= drop_length) newGrid[0][j] = assignDrop()
          if (newGrid[0][j].drop) lastEmptyFullRow.current[j] = -1
          currColorDiff.current[j] = newGrid[0][j].color.map(val => Math.floor(val / drop_length))
          if (lastEmptyFullRow.current[j] < rows - 1) lastEmptyFullRow.current[j]++;
        }
      }
      return newGrid
    })
  }

  useEffect(() => {
    const colorInterval = setInterval(() => currColor.current = randomColor(), colorChangeTime)

    return () => {
      clearInterval(colorInterval)
    }
  }, [])

  const [gridInterval, setGridInterval] = useState()

  const start = () => {
    clearInterval(gridInterval)
    setGridInterval(setInterval(updateGrid, droppingTime))
    setRaining(true)
  }
  const stop = () => {
    clearInterval(gridInterval)
    setDay(!day)
    setRaining(false)
  }

  return (
    <>
      <div className="gaming-background">
        {Array(5).fill(0).map((_, i) => {
          return <div key={i} className="particle"></div>
        })}
        <div className="orb"></div>
        <div className="cube"></div>
        <div className="ring"></div>
        <div className="star"></div>
        <div className="grid"></div>

        <div className={'sky ' + (day? 'day': '')} style={{ background: raining ? 'transparent' : ''}}>
          {!raining && <div className="sun"></div>}
          {!raining && <div className="moon"></div>}
        </div>
      </div>

      <div className='container' style={{
        gridTemplate: `repeat(${rows}, ${block_size}px) / repeat(${cols}, ${block_size}px)`, gap: 3
      }}>
        {
          grid.map((row, i) => {
            return row.map((val, j) => {
              return <div className='block' key={i * rows + j} style={{ backgroundColor: `rgb(${val.color})`, width: block_size, height: block_size, borderRadius: 3 }}></div>
            })
          })
        }
      </div>

      <div className='controls'>
        <button onClick={start} className='gaming-btn start'>Start</button>
        <button onClick={stop} className='gaming-btn stop'>Stop</button>
      </div>
    </>
  )
}

export default App
