"use client";
import React, { useState, useEffect } from "react";

function MarkerText({
	type,
	accentColor,
	julianDate,
	lat,
	lon,
	depth,
	duration,
	onClick,
}) {
	// const julianDate = 2459497.5;
	const millisecondsSinceEpoch =
		(julianDate - 2440587.5) * 24 * 60 * 60 * 1000;

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

	const formattedDate = `${year}-${month}-${day}`;

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

	const [isFadingIn, setIsFadingIn] = useState(false);

	// Function to trigger the fade-in effect
	const fadeIn = () => {
		setIsFadingIn(true);
	};

	// Use useEffect to trigger the fade-in effect after a short delay
	useEffect(() => {
		const timeoutId = setTimeout(fadeIn, 100); // Adjust the delay as needed
		return () => clearTimeout(timeoutId); // Clean up the timeout if the component unmounts
	}, []);
	return (
		<div
			onClick={onClick}
			className={`bg-[#0C141D] w-40 cursor-pointer ${
				type == "AI"
					? "border-[#b8c7de]"
					: type == "SM"
					? "border-[#354A6C]"
					: type == "MI"
					? "border-[#D21F3C]"
					: "border-[#EE984F]"
			} border-2 px-2 py-1 m-4 bg-opacity-80 rounded-lg flex flex-col duration-500 transition-all ${
				isFadingIn ? "scale-100" : "scale-0"
			}`}
		>
			<div className="flex justify-between">
				<p className="font-VT323 text-xl">{formattedDate}</p>
				<div
					className={`font-VT323 text-3xl leading-none ${
						type == "AI"
							? "text-[#b8c7de]"
							: type == "SM"
							? "text-[#354A6C]"
							: type == "MI"
							? "text-[#D21F3C]"
							: "text-[#EE984F]"
					} `}
				>
					{type}
				</div>
			</div>
			{type == "DM" && (
				<>
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
				</>
			)}
			{type == "DM" && (
				<>
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
				</>
			)}
			<div className="flex space-x-2">
				<p className="font-VT323 text-sm">Lat: {lat.toFixed(2)}°</p>
				<p className="font-VT323 text-sm">Lon: {lon.toFixed(2)}°</p>
			</div>
		</div>
	);
}

export default MarkerText;
