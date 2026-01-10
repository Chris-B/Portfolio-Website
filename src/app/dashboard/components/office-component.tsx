'use client'

import React, { useMemo } from 'react'
import { useGLTF } from '@react-three/drei'
import { type GLTF } from 'three-stdlib'
import { type Mesh, type MeshPhysicalMaterial } from 'three'

import { useAvatarStore } from "~/providers/avatar-store-provider"

type GLTFResult = GLTF & {
  nodes: {
    chair_furniture_0: Mesh
    Cube002_furniture_0: Mesh
    Cube004_details_0: Mesh
    Cube008_details_0: Mesh
    Cube009_details_0: Mesh
    Cube012_details_0: Mesh
    Cube014_details_0: Mesh
    Cube016_details_0: Mesh
    Cube018_details_0: Mesh
    Cube019_bookcase_0: Mesh
    Cube020_details_0: Mesh
    Cube036_furniture_0: Mesh
    Cube053_furniture_0: Mesh
    Cylinder004_bookcase_0: Mesh
    Cylinder007_details_0: Mesh
    Cylinder008_details_0: Mesh
    Cylinder009_details_0: Mesh
    Cylinder010_details_0: Mesh
    Icosphere_details_0: Mesh
    Icosphere003_details_0: Mesh
    lamps002_details_0: Mesh
    pachira_aquatica_01_bark_c002_bookcase_0: Mesh
    paintings_bookcase_0: Mesh
    Plane_furniture_0: Mesh
    Plane006_bookcase_0: Mesh
    Plane007_bookcase_0: Mesh
    walls_wall_0: Mesh
    walls001_wall_0: Mesh
  }
  materials: {
    ['furniture.001']: MeshPhysicalMaterial
    furniture: MeshPhysicalMaterial
    details: MeshPhysicalMaterial
    bookcase: MeshPhysicalMaterial
    wall: MeshPhysicalMaterial
  }
}

export function Office(props: JSX.IntrinsicElements['group']) {
  const { nodes, materials } = useGLTF('/Office.glb') as GLTFResult

  const { isDancing } = useAvatarStore((state) => state)

  // Memoize material modifications
  const modifiedMaterials = useMemo(() => {
    const newMaterials = { ...materials }
    newMaterials.details.metalness = 1
    newMaterials.bookcase.metalness = 1
    return newMaterials
  }, [materials])

  // Memoize the entire mesh group
  const meshGroupWithFurniture = useMemo(() => (
    <group scale={0.01}>
      <group
        position={[-206.168, 8.551, -31.41]}
        rotation={[-Math.PI / 2, 0, 1.145]}
        scale={108.239}>
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.chair_furniture_0.geometry}
          material={modifiedMaterials['furniture.001']}
          position={[-0.1, -0.52, -0.03]}
          scale={[1, 1, 0.74]}
        />
      </group>
      <group
        position={[-210.072, -1.122, -32.293]}
        rotation={[-Math.PI / 2, 0, 1.145]}
        scale={108.239}>
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Cube053_furniture_0.geometry}
          material={modifiedMaterials['furniture.001']}
          position={[-0.1, -0.52, -0.13]}
          rotation={[0, 0, 0.433]}
        />
      </group>
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Cube002_furniture_0.geometry}
        material={modifiedMaterials.furniture}
        position={[-16.839, 164.454, -0.973]}
        rotation={[-Math.PI / 2, 0, -Math.PI]}
        scale={100}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Cube004_details_0.geometry}
        material={modifiedMaterials.details}
        position={[-275.985, 135.423, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
        scale={100}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Cube008_details_0.geometry}
        material={modifiedMaterials.details}
        position={[-21.747, 121.099, -102.797]}
        rotation={[-Math.PI / 2, 0, -0.543]}
        scale={100}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Cube009_details_0.geometry}
        material={modifiedMaterials.details}
        position={[-33.478, 138.4, -83.349]}
        rotation={[-Math.PI / 2, 0, -0.543]}
        scale={100}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Cube012_details_0.geometry}
        material={modifiedMaterials.details}
        position={[62.293, 0, 0]}
        rotation={[-Math.PI / 2, 0, -Math.PI]}
        scale={100}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Cube014_details_0.geometry}
        material={modifiedMaterials.details}
        position={[61.993, 0, 1.381]}
        rotation={[-Math.PI / 2, 0, 0]}
        scale={100}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Cube016_details_0.geometry}
        material={modifiedMaterials.details}
        position={[-336.081, -1.982, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
        scale={100}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Cube018_details_0.geometry}
        material={modifiedMaterials.details}
        position={[61.993, 0, 19.918]}
        rotation={[-Math.PI / 2, 0, 0]}
        scale={100}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Cube019_bookcase_0.geometry}
        material={modifiedMaterials.bookcase}
        position={[-336.081, -1.982, -0.435]}
        rotation={[-Math.PI / 2, 0, 0]}
        scale={100}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Cube020_details_0.geometry}
        material={modifiedMaterials.details}
        position={[61.993, 0, 19.918]}
        rotation={[-Math.PI / 2, 0, 0]}
        scale={100}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Cube036_furniture_0.geometry}
        material={modifiedMaterials.furniture}
        position={[-16.839, 164.454, -0.973]}
        rotation={[-Math.PI / 2, 0, -Math.PI]}
        scale={100}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Cylinder004_bookcase_0.geometry}
        material={modifiedMaterials.bookcase}
        position={[-25.678, 90.662, 99.322]}
        rotation={[-Math.PI / 2, 0, -2.11]}
        scale={148.775}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Cylinder007_details_0.geometry}
        material={modifiedMaterials.details}
        position={[-333.274, 261.082, -215.113]}
        rotation={[-Math.PI / 2, 0, 0]}
        scale={100}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Cylinder008_details_0.geometry}
        material={modifiedMaterials.details}
        position={[-25.678, 90.662, 99.322]}
        rotation={[-Math.PI / 2, 0, -2.11]}
        scale={148.775}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Cylinder009_details_0.geometry}
        material={modifiedMaterials.details}
        position={[-69.338, 95.138, -15.153]}
        rotation={[-3.132, 1.172, -2.662]}
        scale={100}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Cylinder010_details_0.geometry}
        material={modifiedMaterials.details}
        position={[-333.274, 214.154, 153.451]}
        rotation={[-Math.PI / 2, 0, 0]}
        scale={100}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Icosphere_details_0.geometry}
        material={modifiedMaterials.details}
        position={[-326.114, 124.6, -191.953]}
        rotation={[-Math.PI / 2, 0, 0]}
        scale={75.598}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Icosphere003_details_0.geometry}
        material={modifiedMaterials.details}
        position={[-326.114, 263.946, 215.566]}
        rotation={[-Math.PI / 2, 0, 0]}
        scale={75.598}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.lamps002_details_0.geometry}
        material={modifiedMaterials.details}
        position={[-358.314, 402.763, -362.147]}
        rotation={[-Math.PI / 2, 0, 0]}
        scale={100}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.pachira_aquatica_01_bark_c002_bookcase_0.geometry}
        material={modifiedMaterials.bookcase}
        position={[-251.976, 31.934, -0.287]}
        rotation={[-Math.PI / 2, 0, 0]}
        scale={100}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.paintings_bookcase_0.geometry}
        material={modifiedMaterials.bookcase}
        position={[-208.542, 327.232, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
        scale={100}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Plane_furniture_0.geometry}
        material={modifiedMaterials.furniture}
        position={[227.725, 2.562, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
        scale={100}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Plane006_bookcase_0.geometry}
        material={modifiedMaterials.bookcase}
        position={[-68.338, 94.552, 4.694]}
        rotation={[-Math.PI / 2, 0, -0.147]}
        scale={100}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Plane007_bookcase_0.geometry}
        material={modifiedMaterials.bookcase}
        position={[-69.014, 93.291, -82.658]}
        rotation={[-Math.PI / 2, 0, -0.476]}
        scale={127.589}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.walls_wall_0.geometry}
        material={modifiedMaterials.wall}
        position={[61.993, 0, 1.626]}
        rotation={[-Math.PI / 2, 0, 0]}
        scale={100}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.walls001_wall_0.geometry}
        material={modifiedMaterials.wall}
        position={[61.993, 0, 1.626]}
        rotation={[-Math.PI / 2, 0, 0]}
        scale={100}
      />
    </group>
  ), [nodes, modifiedMaterials])

  const meshGroupWithoutFurniture = useMemo(() => (
    <group scale={0.01}>
      {/*<group*/}
      {/*  position={[-206.168, 8.551, -31.41]}*/}
      {/*  rotation={[-Math.PI / 2, 0, 1.145]}*/}
      {/*  scale={108.239}>*/}
      {/*  <mesh*/}
      {/*    castShadow*/}
      {/*    receiveShadow*/}
      {/*    geometry={nodes.chair_furniture_0.geometry}*/}
      {/*    material={modifiedMaterials['furniture.001']}*/}
      {/*    position={[-0.1, -0.52, -0.03]}*/}
      {/*    scale={[1, 1, 0.74]}*/}
      {/*  />*/}
      {/*</group>*/}
      {/*<group*/}
      {/*  position={[-210.072, -1.122, -32.293]}*/}
      {/*  rotation={[-Math.PI / 2, 0, 1.145]}*/}
      {/*  scale={108.239}>*/}
      {/*  <mesh*/}
      {/*    castShadow*/}
      {/*    receiveShadow*/}
      {/*    geometry={nodes.Cube053_furniture_0.geometry}*/}
      {/*    material={modifiedMaterials['furniture.001']}*/}
      {/*    position={[-0.1, -0.52, -0.13]}*/}
      {/*    rotation={[0, 0, 0.433]}*/}
      {/*  />*/}
      {/*</group>*/}
      {/*<mesh*/}
      {/*  castShadow*/}
      {/*  receiveShadow*/}
      {/*  geometry={nodes.Cube002_furniture_0.geometry}*/}
      {/*  material={modifiedMaterials.furniture}*/}
      {/*  position={[-16.839, 164.454, -0.973]}*/}
      {/*  rotation={[-Math.PI / 2, 0, -Math.PI]}*/}
      {/*  scale={100}*/}
      {/*/>*/}
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Cube004_details_0.geometry}
        material={modifiedMaterials.details}
        position={[-275.985, 135.423, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
        scale={100}
      />
      {/*<mesh*/}
      {/*  castShadow*/}
      {/*  receiveShadow*/}
      {/*  geometry={nodes.Cube008_details_0.geometry}*/}
      {/*  material={modifiedMaterials.details}*/}
      {/*  position={[-21.747, 121.099, -102.797]}*/}
      {/*  rotation={[-Math.PI / 2, 0, -0.543]}*/}
      {/*  scale={100}*/}
      {/*/>*/}
      {/*<mesh*/}
      {/*  castShadow*/}
      {/*  receiveShadow*/}
      {/*  geometry={nodes.Cube009_details_0.geometry}*/}
      {/*  material={modifiedMaterials.details}*/}
      {/*  position={[-33.478, 138.4, -83.349]}*/}
      {/*  rotation={[-Math.PI / 2, 0, -0.543]}*/}
      {/*  scale={100}*/}
      {/*/>*/}
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Cube012_details_0.geometry}
        material={modifiedMaterials.details}
        position={[62.293, 0, 0]}
        rotation={[-Math.PI / 2, 0, -Math.PI]}
        scale={100}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Cube014_details_0.geometry}
        material={modifiedMaterials.details}
        position={[61.993, 0, 1.381]}
        rotation={[-Math.PI / 2, 0, 0]}
        scale={100}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Cube016_details_0.geometry}
        material={modifiedMaterials.details}
        position={[-336.081, -1.982, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
        scale={100}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Cube018_details_0.geometry}
        material={modifiedMaterials.details}
        position={[61.993, 0, 19.918]}
        rotation={[-Math.PI / 2, 0, 0]}
        scale={100}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Cube019_bookcase_0.geometry}
        material={modifiedMaterials.bookcase}
        position={[-336.081, -1.982, -0.435]}
        rotation={[-Math.PI / 2, 0, 0]}
        scale={100}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Cube020_details_0.geometry}
        material={modifiedMaterials.details}
        position={[61.993, 0, 19.918]}
        rotation={[-Math.PI / 2, 0, 0]}
        scale={100}
      />
      {/*<mesh*/}
      {/*  castShadow*/}
      {/*  receiveShadow*/}
      {/*  geometry={nodes.Cube036_furniture_0.geometry}*/}
      {/*  material={modifiedMaterials.furniture}*/}
      {/*  position={[-16.839, 164.454, -0.973]}*/}
      {/*  rotation={[-Math.PI / 2, 0, -Math.PI]}*/}
      {/*  scale={100}*/}
      {/*/>*/}
      {/*<mesh*/}
      {/*  castShadow*/}
      {/*  receiveShadow*/}
      {/*  geometry={nodes.Cylinder004_bookcase_0.geometry}*/}
      {/*  material={modifiedMaterials.bookcase}*/}
      {/*  position={[-25.678, 90.662, 99.322]}*/}
      {/*  rotation={[-Math.PI / 2, 0, -2.11]}*/}
      {/*  scale={148.775}*/}
      {/*/>*/}
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Cylinder007_details_0.geometry}
        material={modifiedMaterials.details}
        position={[-333.274, 261.082, -215.113]}
        rotation={[-Math.PI / 2, 0, 0]}
        scale={100}
      />
      {/*<mesh*/}
      {/*  castShadow*/}
      {/*  receiveShadow*/}
      {/*  geometry={nodes.Cylinder008_details_0.geometry}*/}
      {/*  material={modifiedMaterials.details}*/}
      {/*  position={[-25.678, 90.662, 99.322]}*/}
      {/*  rotation={[-Math.PI / 2, 0, -2.11]}*/}
      {/*  scale={148.775}*/}
      {/*/>*/}
      {/*<mesh*/}
      {/*  castShadow*/}
      {/*  receiveShadow*/}
      {/*  geometry={nodes.Cylinder009_details_0.geometry}*/}
      {/*  material={modifiedMaterials.details}*/}
      {/*  position={[-69.338, 95.138, -15.153]}*/}
      {/*  rotation={[-3.132, 1.172, -2.662]}*/}
      {/*  scale={100}*/}
      {/*/>*/}
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Cylinder010_details_0.geometry}
        material={modifiedMaterials.details}
        position={[-333.274, 214.154, 153.451]}
        rotation={[-Math.PI / 2, 0, 0]}
        scale={100}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Icosphere_details_0.geometry}
        material={modifiedMaterials.details}
        position={[-326.114, 124.6, -191.953]}
        rotation={[-Math.PI / 2, 0, 0]}
        scale={75.598}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Icosphere003_details_0.geometry}
        material={modifiedMaterials.details}
        position={[-326.114, 263.946, 215.566]}
        rotation={[-Math.PI / 2, 0, 0]}
        scale={75.598}
      />
      {/*<mesh*/}
      {/*  castShadow*/}
      {/*  receiveShadow*/}
      {/*  geometry={nodes.lamps002_details_0.geometry}*/}
      {/*  material={modifiedMaterials.details}*/}
      {/*  position={[-358.314, 402.763, -362.147]}*/}
      {/*  rotation={[-Math.PI / 2, 0, 0]}*/}
      {/*  scale={100}*/}
      {/*/>*/}
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.pachira_aquatica_01_bark_c002_bookcase_0.geometry}
        material={modifiedMaterials.bookcase}
        position={[-251.976, 31.934, -0.287]}
        rotation={[-Math.PI / 2, 0, 0]}
        scale={100}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.paintings_bookcase_0.geometry}
        material={modifiedMaterials.bookcase}
        position={[-208.542, 327.232, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
        scale={100}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Plane_furniture_0.geometry}
        material={modifiedMaterials.furniture}
        position={[227.725, 2.562, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
        scale={100}
      />
      {/*<mesh*/}
      {/*  castShadow*/}
      {/*  receiveShadow*/}
      {/*  geometry={nodes.Plane006_bookcase_0.geometry}*/}
      {/*  material={modifiedMaterials.bookcase}*/}
      {/*  position={[-68.338, 94.552, 4.694]}*/}
      {/*  rotation={[-Math.PI / 2, 0, -0.147]}*/}
      {/*  scale={100}*/}
      {/*/>*/}
      {/*<mesh*/}
      {/*  castShadow*/}
      {/*  receiveShadow*/}
      {/*  geometry={nodes.Plane007_bookcase_0.geometry}*/}
      {/*  material={modifiedMaterials.bookcase}*/}
      {/*  position={[-69.014, 93.291, -82.658]}*/}
      {/*  rotation={[-Math.PI / 2, 0, -0.476]}*/}
      {/*  scale={127.589}*/}
      {/*/>*/}
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.walls_wall_0.geometry}
        material={modifiedMaterials.wall}
        position={[61.993, 0, 1.626]}
        rotation={[-Math.PI / 2, 0, 0]}
        scale={100}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.walls001_wall_0.geometry}
        material={modifiedMaterials.wall}
        position={[61.993, 0, 1.626]}
        rotation={[-Math.PI / 2, 0, 0]}
        scale={100}
      />
    </group>
  ), [nodes, modifiedMaterials])

  return (
    <group {...props} dispose={null}>
      {isDancing ? meshGroupWithoutFurniture : meshGroupWithFurniture}
    </group>
  )
}

useGLTF.preload('/Office.glb')