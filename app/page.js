// READ MY ASS
// Z and Y are switched, beacuse that's how it is

"use client";
import React, { useState, useEffect, useRef } from "react";
import { Canvas, useLoader, useFrame } from "@react-three/fiber";
import { Sphere, CameraControls, Html } from "@react-three/drei";
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

const Marker = ({ lon, lat, moonRef }) => {
	const sphereRef = useRef();
	const phi = THREE.MathUtils.degToRad(90 - lat); // Convert latitude to radians
	const theta = THREE.MathUtils.degToRad(lon); // Convert longitude to radians

	const height = 0.005;
	const sphereRadius = moonRadius + height;
	const x = sphereRadius * Math.sin(phi) * Math.cos(theta);
	const y = sphereRadius * Math.cos(phi) + 0.1;
	const z = sphereRadius * Math.sin(phi) * Math.sin(theta);

	const initialRadius = 10 / radiusScale;
	const pulseSpeed = 0.05;
	const pulseMaxSize = 3;

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

	return (
		<group position={[x, y, z]}>
			<Sphere ref={sphereRef} args={[initialRadius, 32, 32]}>
				<meshBasicMaterial color={"orange"} transparent opacity={0.8} />
			</Sphere>
			<Html
				occlude={[moonRef]}
				position={[x / 25, y / 25, z / 25]}
				distanceFactor={2}
			>
				<MarkerText
					type={"M"}
					julianDate={2457061.5}
					magnitude={3}
					lat={0.0}
					lon={0}
				/>
			</Html>
		</group>
	);
};

const Moon = ({ position, rotation }) => {
	const moonRef = useRef();
	// Load the moon texture
	const moonTexture = useLoader(THREE.TextureLoader, texture);

	// Load the displacement map
	const displacementMap = useLoader(THREE.TextureLoader, displacement);

	return (
		<group position={position} rotation={rotation} ref={moonRef}>
			<Sphere args={[moonRadius, 128, 128]}>
				<meshStandardMaterial
					map={moonTexture}
					displacementMap={displacementMap}
					displacementScale={0.0001 * radiusScale}
				/>
			</Sphere>
			<Marker lon={0} lat={0} moonRef={moonRef} />
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
	const [selectedTime, setSelectedTime] = useState(2457061.5);

	const [apiData, setApiData] = useState();

	useEffect(() => {
		// Load and parse your CSV files here and set the positions

		// Example of loading and parsing a CSV file for Earth
		Papa.parse("/positions/earth_center_monthly.csv", {
			download: true,
			header: true,
			complete: function (results) {
				const data = results.data;
				const matchingData = data.find(
					(row) => row.Date === selectedTime.toString()
				);
				const matchingIndex = data.findIndex(
					(row) => row.Date === selectedTime.toString()
				);
				if (matchingData) {
					const x = parseFloat(data[matchingIndex]["X (km)"]);
					const z = -parseFloat(data[matchingIndex]["Y (km)"]);
					const y = parseFloat(data[matchingIndex]["Z (km)"]);
					setCenterEarthPosition([x / scale, y / scale, z / scale]);

					// Log Earth position here, after setting the state
					console.log(
						`Earth center position: ${[
							x / scale,
							y / scale,
							z / scale,
						]}`
					);
				}
			},
		});

		// Repeat the above code for sun CSV file
		Papa.parse("/positions/sun_positions_monthly.csv", {
			download: true,
			header: true,
			complete: function (results) {
				const data = results.data;
				const matchingData = data.find(
					(row) => row.Date === selectedTime.toString()
				);
				const matchingIndex = data.findIndex(
					(row) => row.Date === selectedTime.toString()
				);
				if (matchingData) {
					const x = parseFloat(data[matchingIndex]["X (km)"]);
					const z = -parseFloat(data[matchingIndex]["Y (km)"]);
					const y = parseFloat(data[matchingIndex]["Z (km)"]);
					setSunPosition([x / scale, y / scale, z / scale]);

					console.log(
						`Sun position: ${[x / scale, y / scale, z / scale]}`
					);
				}
			},
		});

		Papa.parse("/positions/earth_positions_monthly.csv", {
			download: true,
			header: true,
			complete: function (results) {
				const data = results.data;
				const matchingData = data.find(
					(row) => row.Date === selectedTime.toString()
				);
				const matchingIndex = data.findIndex(
					(row) => row.Date === selectedTime.toString()
				);
				if (matchingData) {
					const x = parseFloat(data[matchingIndex]["X (km)"]);
					const z = -parseFloat(data[matchingIndex]["Y (km)"]);
					const y = parseFloat(data[matchingIndex]["Z (km)"]);
					setEarthPosition([x / scale, y / scale, z / scale]);

					console.log(
						`Earth relative position: ${[
							x / scale,
							y / scale,
							z / scale,
						]}`
					);
				}
			},
		});
		Papa.parse("/positions/moon_positions_monthly.csv", {
			download: true,
			header: true,
			complete: function (results) {
				const data = results.data;
				const matchingData = data.find(
					(row) => row.Date === selectedTime.toString()
				);
				const matchingIndex = data.findIndex(
					(row) => row.Date === selectedTime.toString()
				);
				if (matchingData) {
					const x = -parseFloat(data[matchingIndex]["X (km)"]);
					const z = parseFloat(data[matchingIndex]["Y (km)"]);
					const y = -parseFloat(data[matchingIndex]["Z (km)"]); // VERTICAL BITCH
					setMoonPosition([x / scale, y / scale, z / scale]);

					console.log(
						`Moon relative  position: ${[
							x / scale,
							y / scale,
							z / scale,
						]}`
					);
				}
			},
		});
		Papa.parse("/positions/moon_rotation.csv", {
			download: true,
			header: true,
			complete: function (results) {
				const data = results.data;
				const matchingData = data.find(
					(row) => row.Date === selectedTime.toString()
				);
				const matchingIndex = data.findIndex(
					(row) => row.Date === selectedTime.toString()
				);

				if (matchingData) {
					const ra = parseFloat(
						data[matchingIndex]["Right Ascension"]
					);
					const de = parseFloat(data[matchingIndex]["Declination"]);
					const cr = parseFloat(
						data[matchingIndex]["Cumulative Rotation"]
					);
					setMoonRotation([ra, de, cr]);

					console.log(`Moon rotation (ra, de, cr): ${[ra, de, cr]}`);
				} else {
					console.log("Not matching");
				}
			},
		});
	}, [selectedTime]);

	useEffect(() => {
		const timer = setTimeout(() => {
			console.log(
				`Moving to : ${earthCenterPosition[0] - moonPosition[0]}, ${
					earthCenterPosition[1] - moonPosition[1]
				}, ${earthCenterPosition[2] - moonPosition[2]}}`
			);
			cameraControlRef.current?.setLookAt(
				// // Positon to move to
				// 0,
				// 1000000,
				// 0,
				// // Target to look at
				// 0,
				// 0,
				// 0,
				// Positon to move to
				earthCenterPosition[0] - earthPosition[0],
				earthCenterPosition[1] - earthPosition[1],
				earthCenterPosition[2] - earthPosition[2],
				// Target to look at
				earthCenterPosition[0] - moonPosition[0],
				earthCenterPosition[1] - moonPosition[1],
				earthCenterPosition[2] - moonPosition[2],

				// // Positon to move to
				// earthCenterPosition[0],
				// earthCenterPosition[1] + 10000,
				// earthCenterPosition[2],
				// // Target to look at
				// earthCenterPosition[0],
				// earthCenterPosition[1],
				// earthCenterPosition[2],

				true
			);
			cameraControlRef.current?.zoomTo(1, true);
		}, 10);

		// Clear the timer to prevent it from running if the component unmounts
		return () => clearTimeout(timer);
	}, [moonPosition, earthCenterPosition]);

	useEffect(() => {
		const fetchData = async () => {
			fetch("/api").then((res) => {
				console.log(res);
			});

			try {
				const response = await fetch("/api", {
					method: "GET",
				});
				if (!response.ok) {
					throw new Error("Network response was not ok");
				}
				const data = await response.json();
				console.log(data.result);
				setApiData(data.result);
			} catch (error) {
				console.error("Error:", error);
			}
		};

		fetchData();
	}, []);

	// Temp function to increment by 1 for testing
	const incrementDate = () => {
		setSelectedTime(selectedTime + 1);
	};

	return (
		<div className="relative w-screen h-screen">
			<UserInterface data={apiData} />
			<div className="absolute z-50">
				<button onClick={incrementDate}>Increment Date</button>
			</div>
			<Canvas camera={{ position: [0, 0, 5], far: 10000000000000 }}>
				<CameraControls ref={cameraControlRef} smoothTime={0} />
				<pointLight intensity={80000000000} position={sunPosition} />
				<ambientLight intensity={0.1} />
				<Moon
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
				{/* <Html
					occlude={true}
					position={[
						earthCenterPosition[0] - moonPosition[0],
						earthCenterPosition[1] - moonPosition[1],
						earthCenterPosition[2] - moonPosition[2],
					]}
				>
					HEy
				</Html> */}

				{/* <EarthCenter position={earthCenterPosition} /> */}
			</Canvas>
		</div>
	);
}
