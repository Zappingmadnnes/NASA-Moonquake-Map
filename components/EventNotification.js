import React from "react";
import * as THREE from "three";

function EventNotification({ event, moonRef, cameraRef }) {
	const lat = event.Lat;
	const lon = event.Lon;
	const type = event.Type;
	const time = event.JDate;
	const depth = event.Depth;
	const duration = event.Duration;
	const name = event.Name;
	// const julianDate = 2459497.5;
	const millisecondsSinceEpoch = (time - 2440587.5) * 24 * 60 * 60 * 1000;

	// Create a JavaScript Date object
	const gregorianDate = new Date(millisecondsSinceEpoch);

	// Format the date as a readable string
	// Format the date as a custom string (e.g., "YYYY-MM-DD HH:MM:SS")
	const year = gregorianDate.getFullYear();
	const month = String(gregorianDate.getMonth() + 1).padStart(2, "0"); // Add 1 to month because it's zero-based
	const day = String(gregorianDate.getDate()).padStart(2, "0");
	const hours = String(gregorianDate.getHours()).padStart(2, "0");
	const minutes = String(gregorianDate.getMinutes()).padStart(2, "0");
	const seconds = String(gregorianDate.getSeconds()).padStart(2, "0");

	const formattedDate = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;

	const depthBarStyle = (index) => {
		if (index * 55 + 800 > depth) {
			return "opacity-[0.1]";
		} else {
			return "opacity-[1]";
		}
	};
	const durationBarStyle = (index) => {
		if (index * 6 > duration) {
			return "opacity-[0.1]";
		} else {
			return "opacity-[1]";
		}
	};
	const phi = THREE.MathUtils.degToRad(90 - lat); // Convert latitude to radians
	const theta = -THREE.MathUtils.degToRad(lon);
	const sphereRadius = 1734.4 / 1000;
	const x = sphereRadius * Math.sin(phi) * Math.cos(theta);
	const y = sphereRadius * Math.cos(phi);
	const z = sphereRadius * Math.sin(phi) * Math.sin(theta);

	const newPosition = new THREE.Vector3(x, y, z);
	const rotatedPosition = newPosition
		.clone()
		.applyEuler(moonRef.current?.rotation);

	function cameraPanIn() {
		cameraRef.current?.setLookAt(
			// Positon to move to
			rotatedPosition.x,
			rotatedPosition.y,
			rotatedPosition.z,
			// Target to look at
			0,
			0,
			0,
			true
		);
		cameraRef.current?.dolly(-1, true);
	}
	return (
		<div
			onClick={cameraPanIn}
			className={`bg-[#0C141D] w-full cursor-pointer ${
				type == "AI"
					? "border-[#b8c7de]"
					: type == "SM"
					? "border-[#354A6C]"
					: type == "MI"
					? "border-[#D21F3C]"
					: "border-[#EE984F]"
			} border-2 px-2 py-1 my-2 bg-opacity-80 rounded-lg flex flex-col`}
		>
			<div className="flex justify-between">
				<p className="font-VT323 text-xl mr-2">{formattedDate}</p>
				<div>
					<div
						className={`font-VT323 text-3xl leading-none text-right ${
							type == "AI"
								? "text-[#b8c7de]"
								: type == "SM"
								? "text-[#354A6C]"
								: type == "MI"
								? "text-[#D21F3C]"
								: "text-[#EE984F]"
						} `}
					>
						{type == "AI"
							? "Artificial Impact"
							: type == "SM"
							? "Shallow Quake"
							: type == "DM"
							? "Deep Quake"
							: "Meteorite Impact"}
					</div>
					<p className="font-VT323 text-xl leading-none text-right">
						{type == "DM"
							? "Cluster: "
							: type == "AI"
							? "Apollo "
							: ""}
						{name}
					</p>
				</div>
			</div>
			<div className="flex flex-wrap gap-4 my-4">
				{type == "DM" && (
					<div>
						<p className="font-VT323 text-md leading-none mb-1">
							Duration: {duration} min
						</p>
						<div className="flex space-x-1 mb-1">
							{Array.from({ length: 9 }, (_, index) => (
								<div
									key={index}
									className={`bg-white h-5 w-3 -skew-x-12 ${durationBarStyle(
										index
									)}`}
								/>
							))}
						</div>
					</div>
				)}
				{type == "DM" && (
					<div>
						<p className="font-VT323 text-md leading-none mb-1">
							Depth: {depth} km
						</p>
						<div className="flex space-x-1 mb-1">
							{Array.from({ length: 9 }, (_, index) => (
								<div
									key={index}
									className={`bg-white h-5 w-3 -skew-x-12 ${depthBarStyle(
										index
									)}`}
								/>
							))}
						</div>
					</div>
				)}
			</div>
			<div className="flex justify-between items-end">
				<div className="flex space-x-2">
					<p className="font-VT323 text-sm whitespace-nowrap">
						Lat: {lat.toFixed(2)}°
					</p>
					<p className="font-VT323 text-sm whitespace-nowrap">
						Lon: {lon.toFixed(2)}°
					</p>
				</div>
				<p className="text-right font-VT323 text-sm">
					Source: {event.Origin}
				</p>
			</div>
		</div>
	);
}

export default EventNotification;
