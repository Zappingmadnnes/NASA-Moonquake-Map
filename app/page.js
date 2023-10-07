// READ MY ASS
// Z and Y are switched, beacuse that's how it is

"use client";
import React, { useState, useEffect, useRef, useImperativeHandle } from "react";
import { Canvas, useLoader, useFrame, events } from "@react-three/fiber";
import { Sphere, CameraControls, Html, OrbitControls } from "@react-three/drei";
import * as THREE from "three";

import Papa from "papaparse";
import MarkerText from "@/components/MarkerText";
import UserInterface from "@/components/UserInterface";

const texture = "/4k-texture.jpeg";
const displacement = "/4k-displacement.jpeg";
const starMap = "/4k-starmap.jpeg";

const scale = 1000;
const radiusScale = 1000;

const moonRadius = 1734.4 / radiusScale;
const sunRadius = 696340 / radiusScale;
const earthRadius = 6371 / radiusScale;

const Marker = ({
	lat,
	lon,
	type,
	time,
	depth,
	duration,
	cameraRef,
	moonRef,
	markerPositions,
	setMarkerPositions,
	id,
}) => {
	const sphereRef = useRef();
	const groupRef = useRef();
	const phi = THREE.MathUtils.degToRad(90 - lat); // Convert latitude to radians
	const theta = -THREE.MathUtils.degToRad(lon); // Convert longitude to radians

	const height = 0.0;
	const cameraHeight = 2.0;
	const sphereRadius = moonRadius + height;
	const x = sphereRadius * Math.sin(phi) * Math.cos(theta);
	const y = sphereRadius * Math.cos(phi);
	const z = sphereRadius * Math.sin(phi) * Math.sin(theta);

	const cameraSphereRadius = moonRadius + cameraHeight;
	const cx = cameraSphereRadius * Math.sin(phi) * Math.cos(theta);
	const cy = cameraSphereRadius * Math.cos(phi);
	const cz = cameraSphereRadius * Math.sin(phi) * Math.sin(theta);

	const initialRadius = 10 / radiusScale;
	const pulseSpeed = 0.05;
	const pulseMaxSize = 5;

	useFrame(() => {
		const sphere = sphereRef.current;
		if (sphere.scale.x < pulseMaxSize) {
			sphere.scale.set(
				sphere.scale.x + pulseSpeed,
				sphere.scale.y + pulseSpeed,
				sphere.scale.z + pulseSpeed
			);
			sphere.material.opacity -= 0.01;
		} else {
			sphere.material.opacity = 0.8;

			sphere.scale.set(initialRadius, initialRadius, initialRadius);
		}
	});

	function cameraPanIn() {
		const globalPosition = new THREE.Vector3();
		if (groupRef.current) {
			groupRef.current.getWorldPosition(globalPosition);
		}
		cameraRef.current?.setLookAt(
			// Positon to move to
			globalPosition.x,
			globalPosition.y,
			globalPosition.z,
			// Target to look at
			moonRef.current.position.x,
			moonRef.current.position.y,
			moonRef.current.position.z,
			true
		);
		cameraRef.current?.dolly(-1, true);
	}

	// To add to marker positions
	// useEffect(() => {
	// 	const globalPosition = new THREE.Vector3();
	// 	if (groupRef.current) {
	// 		groupRef.current.getWorldPosition(globalPosition);
	// 	}
	// 	const existingObjectIndex = markerPositions.findIndex(
	// 		(obj) => obj.id === id
	// 	);

	// 	const sx = globalPosition.x;
	// 	const sy = globalPosition.y;
	// 	const sz = globalPosition.z;

	// 	const newObj = { id, sx, sy, sz };

	// 	if (existingObjectIndex !== -1) {
	// 		// Copy the current state array and replace the existing object
	// 		const updatedArray = [...markerPositions];
	// 		updatedArray[existingObjectIndex] = newObj;

	// 		// Update the state with the new array
	// 		setMarkerPositions(updatedArray);
	// 	} else {
	// 		// If it doesn't exist, add the new object to the state
	// 		setMarkerPositions([...markerPositions, newObj]);
	// 	}
	// }, [moonRef.current?.position.x, id, markerPositions, setMarkerPositions]);

	return (
		<group
			ref={groupRef}
			position={[x, y, z]}
			onClick={(vectorEvent) => {
				let vector = new THREE.Vector3();
				vectorEvent.object.getWorldPosition(vector);
				console.log(vector);
			}}
		>
			<Sphere ref={sphereRef} args={[initialRadius, 32, 32]}>
				<meshBasicMaterial
					color={
						type == "AI"
							? "#b8c7de"
							: type == "SM"
							? "#354A6C"
							: type == "MI"
							? "#D21F3C"
							: "#EE984F"
					}
					transparent
					opacity={0.8}
				/>
			</Sphere>
			<Html position={[x / 25, y / 25, z / 25]} distanceFactor={2}>
				<MarkerText
					type={type}
					julianDate={time}
					lat={lat}
					lon={lon}
					depth={depth}
					duration={duration}
					onClick={cameraPanIn}
				/>
			</Html>
		</group>
	);
};

const Moon = ({
	position,
	rotation,
	cameraRef,
	events,
	selectedTime,
	markerPositions,
	setMarkerPositions,
	moonRef,
}) => {
	// Load the moon texture
	const moonTexture = useLoader(THREE.TextureLoader, texture);

	// Load the displacement map
	const displacementMap = useLoader(THREE.TextureLoader, displacement);

	const markerDuration = 30;

	return (
		<group position={position} rotation={rotation} ref={moonRef}>
			<Sphere args={[moonRadius, 128, 128]}>
				<meshStandardMaterial
					map={moonTexture}
					displacementMap={displacementMap}
					displacementScale={0.0001 * radiusScale}
				/>
			</Sphere>
			{events.map(
				(entry, index) =>
					entry.JDate <= selectedTime &&
					selectedTime <= entry.JDate + markerDuration && (
						<Marker
							key={index}
							lat={entry.Lat}
							lon={entry.Lon}
							type={entry.Type}
							time={entry.JDate}
							depth={entry.Depth}
							duration={entry.Duration}
							cameraRef={cameraRef}
							moonRef={moonRef}
							markerPositions={markerPositions}
							setMarkerPositions={setMarkerPositions}
							id={entry.ID}
						/>
					)
			)}
		</group>
	);
};

const Sun = ({ position }) => {
	return (
		<Sphere args={[sunRadius, 32, 32]} position={position}>
			<meshBasicMaterial color={0xfce570} />
		</Sphere>
	);
};

const Earth = ({ position }) => {
	return (
		<Sphere args={[earthRadius, 32, 32]} position={position}>
			<meshBasicMaterial color={"blue"} />
		</Sphere>
	);
};
const EarthCenter = ({ position }) => {
	return (
		<Sphere args={[0.1, 8, 8]} position={position}>
			<meshBasicMaterial color={"gray"} />
		</Sphere>
	);
};
const StarMap = () => {
	// Load the star map texture
	const starMapTexture = useLoader(THREE.TextureLoader, starMap);
	return (
		<Sphere args={[1000000, 16, 16]}>
			<meshStandardMaterial
				map={starMapTexture}
				side={THREE.BackSide}
				emissiveIntensity={0.01}
				emissive={0xffffff}
				emissiveMap={starMapTexture}
			/>
		</Sphere>
	);
};

export default function Home() {
	const cameraControlRef = useRef();

	const [moonPosition, setMoonPosition] = useState([0, 0, 0]);
	const [moonRotation, setMoonRotation] = useState([0, 0, 0]);
	const [earthPosition, setEarthPosition] = useState([0, 0, 0]);
	const [earthCenterPosition, setCenterEarthPosition] = useState([0, 0, 0]);
	const [sunPosition, setSunPosition] = useState([0, 0, 0]);
	const [selectedTime, setSelectedTime] = useState(2440541); // Earliest quake -5
	const [timeBeforeUpdate, setTimeBeforeUpdate] = useState(0);

	const [apiData, setApiData] = useState({});
	const [CSV, setCSV] = useState([]);

	useEffect(() => {
		Papa.parse("/positions/coordsCollection.csv", {
			download: true,
			header: true,
			complete: function (results) {
				const data = results.data;
				setCSV(data);
			},
		});
	}, []);

	useEffect(() => {
		if (CSV.length > 0) {
			// Tries to predict i
			const start_time = 2440541;
			const end_time = 2443417.9999571294;

			// let predictedI = parseInt(
			// 	Math.min(
			// 		Math.max(
			// 			((selectedTime - start_time) /
			// 				(end_time - start_time)) *
			// 				276193,
			// 			0
			// 		),
			// 		276193
			// 	)
			// );
			// console.log(predictedI);
			function predict(time) {
				return parseInt(
					Math.min(
						Math.max(
							((time - start_time) / (end_time - start_time)) *
								276193 -
								10,
							0
						),
						276193
					)
				);
			}
			// console.log(predict(2442043.5520609436));
			let closestRowIndex = predict(selectedTime);

			// let closestRowIndex = -1;
			// for (let i = predictedI; i < CSV.length - 10; i++) {
			// 	if (selectedTime >= CSV[i].Date) {
			// 		closestRowIndex = i;
			// 		if (selectedTime < CSV[i + 1].Date) {
			// 			console.log("Breaking");
			// 			break;
			// 		}
			// 	}
			// }

			// // Fallback if i is wrong
			// if (closestRowIndex == -1) {
			// 	console.log("rerunning");
			// 	for (let i = 0; i < CSV.length - 100; i++) {
			// 		if (selectedTime >= CSV[i].Date) {
			// 			closestRowIndex = i;
			// 			if (selectedTime < CSV[i + 1].Date) {
			// 				break;
			// 			}
			// 		}
			// 	}
			// }

			const Cx = parseFloat(CSV[closestRowIndex]["ECX (km)"]);
			const Cz = -parseFloat(CSV[closestRowIndex]["ECY (km)"]);
			const Cy = parseFloat(CSV[closestRowIndex]["ECZ (km)"]);
			setCenterEarthPosition([Cx / scale, Cy / scale, Cz / scale]);

			const Ex = parseFloat(CSV[closestRowIndex]["EX (km)"]);
			const Ez = -parseFloat(CSV[closestRowIndex]["EY (km)"]);
			const Ey = parseFloat(CSV[closestRowIndex]["EZ (km)"]);
			setEarthPosition([Ex / scale, Ey / scale, Ez / scale]);

			const Mx = -parseFloat(CSV[closestRowIndex]["MX (km)"]);
			const Mz = parseFloat(CSV[closestRowIndex]["MY (km)"]);
			const My = -parseFloat(CSV[closestRowIndex]["MZ (km)"]);
			setMoonPosition([Mx / scale, My / scale, Mz / scale]);

			const Sx = parseFloat(CSV[closestRowIndex]["SX (km)"]);
			const Sz = -parseFloat(CSV[closestRowIndex]["SY (km)"]);
			const Sy = parseFloat(CSV[closestRowIndex]["SZ (km)"]);
			setSunPosition([Sx / scale, Sy / scale, Sz / scale]);

			const ra = parseFloat(CSV[closestRowIndex]["Right Ascension"]);
			const de = parseFloat(CSV[closestRowIndex]["Declination"]);
			const cr = parseFloat(CSV[closestRowIndex]["Cumulative Rotation"]);
			setMoonRotation([ra, de, cr]);
		}
	}, [selectedTime, CSV]);

	const [csvData, setCsvData] = useState([]);

	useEffect(() => {
		// Function to load and parse the CSV data
		const loadCSV = async () => {
			const response = await fetch("/data/Quakes_All.csv"); // Replace with the path to your CSV file
			const text = await response.text();
			// console.log(text);
			Papa.parse(text, {
				header: true, // Assuming the first row contains headers
				dynamicTyping: true, // Automatically convert numeric values
				complete: (result) => {
					setCsvData(result.data); // Store the parsed CSV data in the state
				},
			});
		};

		loadCSV();
	}, []);

	const resetCamera = () => {
		cameraControlRef.current?.setLookAt(
			// Positon to move to
			earthCenterPosition[0] - earthPosition[0] * 80.2,
			earthCenterPosition[1] - earthPosition[1] * 80.2,
			earthCenterPosition[2] - earthPosition[2] * 80.2,
			// Target to look at
			earthCenterPosition[0] - moonPosition[0],
			earthCenterPosition[1] - moonPosition[1],
			earthCenterPosition[2] - moonPosition[2],

			false
		);

		cameraControlRef.current?.zoomTo(1, true);
	};

	useEffect(() => {
		resetCamera();
	}, [moonPosition]);

	const [markerPositions, setMarkerPositions] = useState([]);

	const moonRef = useRef();

	return (
		<div className="relative w-screen h-screen">
			<UserInterface
				data={apiData}
				events={csvData}
				time={selectedTime}
				setTime={setSelectedTime}
				markerPositions={markerPositions}
				moonRef={moonRef}
				cameraRef={cameraControlRef}
			/>
			<Canvas
				camera={{
					position: [
						moonPosition[0],
						moonPosition[1],
						moonPosition[2],
					],
					far: 10000000000000,
				}}
			>
				<CameraControls ref={cameraControlRef} smoothTime={0.8} />
				<pointLight intensity={80000000000} position={sunPosition} />
				<ambientLight intensity={0.1} />
				<Moon
					markerPositions={markerPositions}
					setMarkerPositions={setMarkerPositions}
					events={csvData}
					position={[
						earthCenterPosition[0] - moonPosition[0],
						earthCenterPosition[1] - moonPosition[1],
						earthCenterPosition[2] - moonPosition[2],
					]}
					rotation={[
						moonRotation[1],
						moonRotation[2],
						moonRotation[0],
						// 0, 1, 0,
					]}
					cameraRef={cameraControlRef}
					selectedTime={selectedTime}
					moonRef={moonRef}
				/>

				<StarMap />
				<Sun position={sunPosition} />
				<Earth
					position={[
						earthCenterPosition[0] - earthPosition[0],
						earthCenterPosition[1] - earthPosition[1],
						earthCenterPosition[2] - earthPosition[2],
					]}
				/>
			</Canvas>
		</div>
	);
}
