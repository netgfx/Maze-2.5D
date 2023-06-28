import React, { useRef, useState, useEffect } from 'react'
import { Sky, Grid, SpriteAnimator, PerspectiveCamera, OrthographicCamera, CameraControls } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

export enum CameraType {
  Orthographic = 'Orthographic',
  Perspective = 'Perspective'
}

export const TopDownCamera: React.FC = (props: any) => {
  const { firstPerson, type, player, setMode } = props
  const [cameraType, setCameraType] = useState(type)
  const cameraRef = useRef<THREE.PerspectiveCamera>(null)
  const [persCam, setPersCam] = useState()
  const controlsRef = useRef<any>()
  const currentPosition = new THREE.Vector3()
  const currentLookAt = new THREE.Vector3()

  useEffect(() => {
    if (firstPerson === true) {
      setCameraType(CameraType.Perspective)
    } else {
      setCameraType(CameraType.Orthographic)
    }
    console.log(firstPerson, cameraType)
  }, [firstPerson])

  const calculateIdealOffset = () => {
    const idealOffset = new THREE.Vector3(0, 20, -30)
    idealOffset.applyQuaternion(player.current.quaternion)
    idealOffset.add(player.current.position)
    return idealOffset
  }

  const calculateIdealLookat = () => {
    const idealLookat = new THREE.Vector3(0, 10, 50)
    idealLookat.applyQuaternion(player.current.quaternion)
    idealLookat.add(player.current.position)
    return idealLookat
  }

  // useEffect(() => {
  //   console.log(cameraType, controlsRef.current)
  //   if (controlsRef.current && cameraType === CameraType.Perspective) {
  //     //controlsRef.current.zoom(10, true)
  //     controlsRef.current.fitToBox(player.current, true)
  //     controlsRef.current.setPosition(player.current.position.x, 0, player.current.position.z - 2, true)
  //     controlsRef.current.saveState()
  //   }
  // }, [cameraType, controlsRef])

  useFrame((state, delta) => {
    if (cameraRef.current) {
      //console.log(firstPerson)
      //console.log(cameraRef.current.position)
      if (cameraType === CameraType.Perspective) {
        // Update the camera's position and lookAt properties here
        // For example:

        const idealOffset = calculateIdealOffset()
        const idealLookat = calculateIdealLookat()
        const t = 1.0 - Math.pow(0.001, delta)

        currentPosition.lerp(idealOffset, t)
        //currentLookAt.lerp(idealLookat, t);

        cameraRef.current.position.copy(currentPosition)
        cameraRef.current.rotation.set([0, 0, 0])
        //persCam?.position.set(0, 0, 0.0)
        cameraRef.current.lookAt(idealLookat)
        //console.log(firstPerson)
        //console.log('move, ', idealOffset)

        //controlsRef.current?.update(state.clock.getDelta())
        cameraRef.current.updateProjectionMatrix()
      } else if (firstPerson === false) {
        // Set the camera rotation to look directly down (top-down view)
        cameraRef.current.rotation.set(-Math.PI / 2, 0, 0)
        cameraRef.current.position.set(0, 10, 0)
        cameraRef.current.updateProjectionMatrix()
      }
    }
  })

  return (
    <group>
      <OrthographicCamera
        makeDefault={cameraType === CameraType.Orthographic}
        {...props}
        ref={cameraRef}
        rotation={[-Math.PI / 2, 0, 0]}
        zoom={30}
      />

      <PerspectiveCamera
        {...props}
        makeDefault={cameraType === CameraType.Perspective}
        ref={(cam) => setPersCam(cam)}
        //position={[0, 1, 1]}
      />

      <CameraControls ref={controlsRef} camera={persCam} />
    </group>
  )
}
