// "use client";

// import { Canvas, useFrame } from "@react-three/fiber";
// // import { OrbitControls, Edges } from "@react-three/drei";
// import { useRef, useEffect, useState } from "react";
// import * as THREE from "three";

// // Enhance contrast using canvas
// function enhanceContrast(image: HTMLImageElement, contrast = 100.5) {
//   const canvas = document.createElement("canvas");
//   canvas.width = image.width;
//   canvas.height = image.height;
//   const ctx = canvas.getContext("2d")!;
//   ctx.drawImage(image, 0, 0);

//   const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
//   const data = imageData.data;

//   const factor = (259 * (contrast + 255)) / (255 * (259 - contrast));

//   for (let i = 0; i < data.length; i += 4) {
//     data[i] = factor * (data[i] - 128) + 128; // R
//     data[i + 1] = factor * (data[i + 1] - 128) + 128; // G
//     data[i + 2] = factor * (data[i + 2] - 128) + 128; // B
//   }

//   ctx.putImageData(imageData, 0, 0);

//   const texture = new THREE.Texture(canvas);
//   texture.needsUpdate = true;
//   return texture;
// }
// // type RotatingBoxProps = {
// //   size?: [number, number, number];
// // };

// // Rotating box using the enhanced texture
// function RotatingBox({
//   size = [7, 7, 7],
// }: {
//   size?: [number, number, number];
// }) {
//   const meshRef = useRef<THREE.Mesh>(null);
//   const [materials, setMaterials] = useState<THREE.Material[]>([]);

//   useEffect(() => {
//     const loader = new THREE.ImageLoader();
//     loader.load("/logo.png", (image) => {
//       const texture = enhanceContrast(image, 1.8);
//       const material = new THREE.MeshStandardMaterial({ map: texture });
//       setMaterials(new Array(6).fill(material));
//     });
//   }, []);

//   useFrame(() => {
//     if (meshRef.current) {
//       meshRef.current.rotation.x += 0.01;
//       meshRef.current.rotation.y += 0.01;
//     }
//   });

//   if (materials.length === 0) return null;

//   return (
//     <mesh ref={meshRef} material={materials} castShadow receiveShadow>
//       <boxGeometry args={size} />
//       <Edges scale={1.05} color="black" threshold={15} />
//     </mesh>
//   );
// }
// type SceneProps = {
//   cubeSize?: [number, number, number];
// };

// // Main scene component
// export default function Scene() {
//   return (
//     <Canvas shadows camera={{ position: [4, 4, 8] }}>
//       <ambientLight intensity={0.3} />
//       <directionalLight
//         position={[10, 10, 10]}
//         intensity={1}
//         castShadow
//         shadow-mapSize-width={1024}
//         shadow-mapSize-height={1024}
//       />

//       <RotatingBox />

//       <mesh rotation-x={-Math.PI / 2} position={[0, -5, 0]} receiveShadow>
//         <planeGeometry args={[100, 100]} />
//         <shadowMaterial opacity={0.3} />
//       </mesh>
//     </Canvas>
//   );
// }
