import { Box, KeyboardControlsEntry, OrbitControls, Text, useKeyboardControls } from '@react-three/drei'
import { Sky, Grid, SpriteAnimator, PerspectiveCamera, KeyboardControls } from '@react-three/drei'
import React, { useEffect, useRef, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Suspense, useState } from 'react'
import { Card } from './Card'
import * as THREE from 'three'
import { TopDownCamera, CameraType } from './TopDownCamera'
import { generateMaze } from './utils/utils'
import { Cell } from './Cell'
import { useControls } from 'leva'
import { Lantern } from './units/lantern'

const count = 1000
const stride = 10
const dots = new Float64Array(count)

enum KControls {
  forward = 'forward',
  back = 'back',
  left = 'left',
  right = 'right',
  jump = 'jump'
}

const random = (min: number, max: number) => Math.random() * (max - min) + min

const step = () => {}

function Dots() {
  return null
}

var options = {
  gridSize: [140, 140],
  cellSize: 1.0,
  cellThickness: 1.0,
  cellColor: '#f1f1f1',
  sectionSize: 5.0,
  sectionThickness: 1.5,
  sectionColor: 'orange', //'#00ffd9',
  fadeDistance: 150,
  fadeStrength: 1,
  followCamera: true,
  infiniteGrid: true
}

const Controls = (props) => {
  const controlsRef = useRef()
  const [sub, get] = useKeyboardControls<KControls>()
  useFrame(() => {
    const pressForward = get().forward
    console.log(pressForward)
    if (pressForward) {
      props.playerRef.current.position.x += 0.01
    }
  })

  return (
    <OrbitControls
      {...props}
      ref={controlsRef}
      enablePan={true}
      enableRotate={false}
      maxDistance={200}
      minDistance={10}
      maxZoom={100}
      minZoom={7.5}
    />
  )
}

export function App() {
  const [frameName, setFrameName] = useState('idle')
  const [frameNameCyclops, setFrameNameCyclops] = useState('idle')
  const [transition, setTransition] = useState(false)
  const [cameraPos, setCameraPos] = useState([0, 0.0, -1.5])
  const [maze, setMaze] = useState([])
  const playerRef = useRef()
  const [mode, setMode] = useState('2D')

  const map = useMemo<KeyboardControlsEntry<KControls>[]>(
    () => [
      { name: KControls.forward, keys: ['ArrowUp', 'KeyW'] },
      { name: KControls.back, keys: ['ArrowDown', 'KeyS'] },
      { name: KControls.left, keys: ['ArrowLeft', 'KeyA'] },
      { name: KControls.right, keys: ['ArrowRight', 'KeyD'] },
      { name: KControls.jump, keys: ['Space'] }
    ],
    []
  )

  const camera = useControls({
    firstPerson: false
  })

  // add mechanic here
  useEffect(() => {
    var maze = generateMaze(12, 12, Math.random() * 100000)
    var test = [
      [{ x: 0, y: 0, top: true, left: true, bottom: true, right: false }],
      [
        {
          x: 1,
          y: 0,
          top: true,
          left: false,
          bottom: false,
          right: true
        }
      ]
    ]
    console.log(maze)
    setMaze(test)
  }, [])

  return (
    <Canvas
    // camera={{
    //   position: [10, 10, -12],
    //   rotation: cameraPos,
    //   fov: '50',
    //   far: 1000,
    //   near: 0.2,
    //   aspectRatio: window.innerWidth / window.innerHeight
    // }}
    >
      <KeyboardControls map={map}>
        <color attach="background" args={[0x1e1e1e]} />
        {/* <ambientLight intensity={0.5} /> */}
        <pointLight position={[20, 30, 10]} intensity={1} />
        <pointLight position={[-10, -10, -10]} color="orange" />

        <Suspense fallback={null}>
          <TopDownCamera
            player={playerRef}
            makeDefault
            position={[0, 10, 0]}
            fov={90}
            near={1.0}
            far={1000}
            type={camera.firstPerson === false ? CameraType.Orthographic : CameraType.Perspective}
            firstPerson={camera.firstPerson}
          />
          <group>
            <Box args={[0.5, 0.5, 0.5]} position={[2.5, 0, 2.5]} ref={playerRef}>
              <meshStandardMaterial color={'hotpink'} />
            </Box>
            <Lantern position={[-2.5, -3, 4.5]} rotation={[0, 0.0, 0.0]} />
            {/* <Box args={[1, 5, 5]} position={[5.5, 0, 2.5]} rotation={[0, 0, 0]}>
            <meshStandardMaterial color={0xfec72c}></meshStandardMaterial>
          </Box>

          <Box args={[1, 5, 5]} position={[9.5, 0, 2.5]} rotation={[0, 0, 0]}>
            <meshStandardMaterial color={0xfec72c}></meshStandardMaterial>
          </Box>

          <Box args={[1, 5, 5]} position={[7.5, 0, 0.5]} rotation={[0, Math.PI / 2, 0]}>
            <meshStandardMaterial color={0xfec72c}></meshStandardMaterial>
          </Box>

          <Box args={[1, 5, 5]} position={[7.5, 0, 4.5]} rotation={[0, Math.PI / 2, 0]}>
            <meshStandardMaterial color={0xfec72c}></meshStandardMaterial>
          </Box> */}

            {/* -- */}
            {/* <Box args={[1, 5, 5]} position={[10.5, 0, 7.5]} rotation={[0, 0, 0]}>
            <meshStandardMaterial color={0xfec72c}></meshStandardMaterial>
          </Box>

          <Box args={[1, 5, 5]} position={[14.5, 0, 7.5]} rotation={[0, 0, 0]}>
            <meshStandardMaterial color={0xfec72c}></meshStandardMaterial>
          </Box>

          <Box args={[1, 5, 5]} position={[12.5, 0, 5.5]} rotation={[0, Math.PI / 2, 0]}>
            <meshStandardMaterial color={0xfec72c}></meshStandardMaterial>
          </Box>

          <Box args={[1, 5, 5]} position={[12.5, 0, 9.5]} rotation={[0, Math.PI / 2, 0]}>
            <meshStandardMaterial color={0xfec72c}></meshStandardMaterial>
          </Box> */}

            {/* -- */}
            {/* <Box args={[1, 5, 5]} position={[5.5, 0, 12.5]} rotation={[0, 0, 0]}>
            <meshStandardMaterial color={0xfec72c}></meshStandardMaterial>
          </Box>

          <Box args={[1, 5, 5]} position={[9.5, 0, 12.5]} rotation={[0, 0, 0]}>
            <meshStandardMaterial color={0xfec72c}></meshStandardMaterial>
          </Box>

          <Box args={[1, 5, 5]} position={[7.5, 0, 10.5]} rotation={[0, Math.PI / 2, 0]}>
            <meshStandardMaterial color={0xfec72c}></meshStandardMaterial>
          </Box>

          <Box args={[1, 5, 5]} position={[7.5, 0, 14.5]} rotation={[0, Math.PI / 2, 0]}>
            <meshStandardMaterial color={0xfec72c}></meshStandardMaterial>
          </Box> */}

            <Cell maze={maze} />
          </group>
        </Suspense>
        <Grid {...options} position={[0, -3.0, 0.0]} />
        <Controls playerRef={playerRef} />
      </KeyboardControls>
    </Canvas>
  )
}
