import Image from "next/image";
import { useRef } from "react";

function latLongTo2D(lat, lon, mapWidth, mapHeight) {
	let x = (lon + 180) * (mapWidth / 360);
	let y = (90 - lat) * (mapHeight / 180);

	// Clamp the values to ensure they stay within the boundaries
	x = Math.min(Math.max(x, 0), mapWidth);
	y = Math.min(Math.max(y, 0), mapHeight);

	return { x, y };
}

export default function MiniMap({ lat, long }) {
	const minimapRef = useRef(null);

	const mapWidth = 10000; // width of your minimap image
	const mapHeight = 5000; // assuming the height is half of the width for a 2:1 aspect ratio

	const actualWidth = minimapRef.current?.offsetWidth || mapWidth;
	const actualHeight = minimapRef.current?.offsetHeight || mapHeight;

	const { x, y } = latLongTo2D(lat, long, actualWidth, actualHeight);

	return (
		<div
			className="w-full border-t-4 border-r-4 pointer-events-auto border-[#EDEDED] rounded-xl relative"
			ref={minimapRef}
		>
			<Image
				src="/moon-map.jpeg"
				alt="moon-map"
				width={mapWidth}
				height={mapHeight}
				className="w-full rounded-lg"
			/>
			<div
				style={{
					position: "absolute",
					top: y,
					left: x,
					width: "10px",
					height: "10px",
					backgroundColor: "red",
					borderRadius: "50%",
					transform: "translate(-50%, -50%)",
				}}
			></div>
		</div>
	);
}
