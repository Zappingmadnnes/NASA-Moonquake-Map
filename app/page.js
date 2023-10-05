// READ MY ASS
// Z and Y are switched, beacuse that's how it is

"use client";
import React, { useState, useEffect, useRef } from "react";
import { Canvas, useLoader } from "@react-three/fiber";
import { Sphere, CameraControls } from "@react-three/drei";
import * as THREE from "three";

import Papa from "papaparse";

const texture = "/4k-texture.jpeg";
const displacement = "/4k-displacement.jpeg";
const starMap = "/4k-starmap.jpeg";

const scale = 1000;
const radiusScale = 1000;

const moonRadius = 1734.4 / radiusScale;
const sunRadius = 696340 / radiusScale;
const earthRadius = 6371 / radiusScale;
const Moon = ({ position, rotation }) => {
	// Load the moon texture
	const moonTexture = useLoader(THREE.TextureLoader, texture);

	// Load the displacement map
	const displacementMap = useLoader(THREE.TextureLoader, displacement);

	// const moonRef = useRef();
	// useFrame(() => {
	// 	if (moonRef.current) {
	// 		moonRef.current.rotation.y += 0.002;
	// 	}
	// });

	return (
		<Sphere
			args={[moonRadius, 64, 64]}
			position={position}
			rotation={rotation}
		>
			<meshStandardMaterial
				map={moonTexture}
				displacementMap={displacementMap}
				displacementScale={0.0002 * radiusScale}
			/>
		</Sphere>
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
	const [selectedTime, setSelectedTime] = useState("2015-02-13 12:00");

	useEffect(() => {
		// Load and parse your CSV files here and set the positions

		// Example of loading and parsing a CSV file for Earth
		Papa.parse("/positions/earth_center_monthly.csv", {
			download: true,
			header: true,
			complete: function (results) {
				const data = results.data;
				const matchingData = data.find(
					(row) => row.Date === selectedTime
				);
				const matchingIndex = data.findIndex(
					(row) => row.Date === selectedTime
				);
				if (matchingData) {
					const x = -parseFloat(data[matchingIndex]["X (km)"]);
					const z = parseFloat(data[matchingIndex]["Y (km)"]);
					const y = -parseFloat(data[matchingIndex]["Z (km)"]);
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
					(row) => row.Date === selectedTime
				);
				const matchingIndex = data.findIndex(
					(row) => row.Date === selectedTime
				);
				if (matchingData) {
					const x = -parseFloat(data[matchingIndex]["X (km)"]);
					const z = parseFloat(data[matchingIndex]["Y (km)"]);
					const y = -parseFloat(data[matchingIndex]["Z (km)"]);
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
					(row) => row.Date === selectedTime
				);
				const matchingIndex = data.findIndex(
					(row) => row.Date === selectedTime
				);
				if (matchingData) {
					const x = -parseFloat(data[matchingIndex]["X (km)"]);
					const z = parseFloat(data[matchingIndex]["Y (km)"]);
					const y = -parseFloat(data[matchingIndex]["Z (km)"]);
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
					(row) => row.Date === selectedTime
				);
				const matchingIndex = data.findIndex(
					(row) => row.Date === selectedTime
				);
				if (matchingData) {
					const x = -parseFloat(data[matchingIndex]["X (km)"]);
					const z = parseFloat(data[matchingIndex]["Y (km)"]);
					const y = -parseFloat(data[matchingIndex]["Z (km)"]);
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
					(row) => row.Date === selectedTime
				);
				const matchingIndex = data.findIndex(
					(row) => row.Date === selectedTime
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
				// Positon to move to
				earthCenterPosition[0] - earthPosition[0],
				earthCenterPosition[1] - earthPosition[1],
				earthCenterPosition[2] - earthPosition[2],
				// earthCenterPosition[0] - moonPosition[0] + moonRadius * 2,
				// earthCenterPosition[1] - moonPosition[1],
				// earthCenterPosition[2] - moonPosition[2],
				// Target to look at
				earthCenterPosition[0] - moonPosition[0],
				earthCenterPosition[1] - moonPosition[1],
				earthCenterPosition[2] - moonPosition[2],

				true
			);
			cameraControlRef.current?.zoomTo(20, true);
		}, 10);

		// Clear the timer to prevent it from running if the component unmounts
		return () => clearTimeout(timer);
	}, [moonPosition, earthCenterPosition]);

	// Temp function to increment by 1 for testing
	const incrementDate = () => {
		const currentDate = new Date(selectedTime);
		currentDate.setDate(currentDate.getDate() + 1);

		// Format the new date back to the string format you are using
		const formattedDate = `${currentDate.getFullYear()}-${String(
			currentDate.getMonth() + 1
		).padStart(2, "0")}-${String(currentDate.getDate()).padStart(
			2,
			"0"
		)} ${String(currentDate.getHours()).padStart(2, "0")}:${String(
			currentDate.getMinutes()
		).padStart(2, "0")}`;

		setSelectedTime(formattedDate);
		console.log(`New date: ${formattedDate}`);
	};

	return (
		<div className="h-screen w-screen">
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
				{/* <EarthCenter position={earthCenterPosition} /> */}
			</Canvas>
		</div>
	);
}
