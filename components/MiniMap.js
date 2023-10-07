"use client";
import Image from "next/image";
import { use, useEffect, useRef, useState } from "react";

function latLongTo2D(lat, lon, mapWidth, mapHeight, selectedTime) {
	let x = (lon + 180) * (mapWidth / 360);
	let y = (90 - lat) * (mapHeight / 180);

	// Clamp the values to ensure they stay within the boundaries
	x = Math.min(Math.max(x, 0), mapWidth);
	y = Math.min(Math.max(y, 0), mapHeight);

	return { x, y };
}

const MapMarker = ({ minimapRef, lat, lon, isHovered, type }) => {
	const [hasHovered, setHasHovered] = useState(false);
	const actualWidth = minimapRef.current?.offsetWidth || 2;
	const actualHeight = minimapRef.current?.offsetHeight || 1;

	const { x, y } = latLongTo2D(lat, lon, actualWidth, actualHeight);

	return (
		<div
			className={`absolute w-2 h-2 animate-pulse rounded-full transition-all ${
				type == "AI"
					? "bg-[#b8c7de]"
					: type == "SM"
					? "bg-[#354A6C]"
					: type == "MI"
					? "bg-[#D21F3C]"
					: "bg-[#EE984F]"
			}`}
			style={{
				top: y,
				left: x,
				transform: "translate(-50%, -50%)",
			}}
		/>
	);
};
export default function MiniMap({ events, selectedTime }) {
	const minimapRef = useRef(null);

	return (
		<div
			className="w-full border-t-2 border-r-2 pointer-events-auto border-[#354A6C]  relative"
			ref={minimapRef}
		>
			<Image
				src="/moon-map.jpeg"
				alt="moon-map"
				width={10000}
				height={5000}
				className="w-full "
			/>
			{/* <MapMarker lat={0} lon={0} minimapRef={minimapRef} /> */}
			{events.map(
				(entry, index) =>
					entry.JDate <= selectedTime &&
					selectedTime <= entry.JDate + 30 && (
						<MapMarker
							key={index}
							lat={entry.Lat}
							lon={entry.Lon}
							type={entry.Type}
							minimapRef={minimapRef}
						/>
					)
			)}
		</div>
	);
}
