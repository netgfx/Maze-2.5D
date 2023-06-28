import { Box } from '@react-three/drei'
import React from 'react'
import { useEffect, useState } from 'react'
import { getLine } from './utils/utils'

export function Cell(props: { maze: any }) {
  const { maze } = props

  useEffect(() => {
    // var _lines = getLine(cell)
    // setLines(_lines)
  }, [])

  const makeLine = (line: any, index: number) => {
    //console.log(line)
    return (
      <Box args={[1, 5, 5]} {...line} key={`line-${index}`}>
        <meshStandardMaterial color={0xfec72c}></meshStandardMaterial>
      </Box>
    )
  }

  return (
    <group>
      {maze.map((row: any, index: number) => {
        return row.map((cell: any, rowIndex: number) => (
          <group key={`cell-${rowIndex}`}>{getLine(cell, index).map((line, rowIndex) => makeLine(line, rowIndex))}</group>
        ))
      })}
    </group>
  )
}
