import React from "react";

function MarkerText({ type, magnitude, julianDate, lat, lon }) {
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
	// text-[#859ABC]
	// border-[#354A6C]
	return (
		<div className="bg-[#0C141D] border-orange-400 border-2 px-2 py-1 m-4 bg-opacity-80 rounded-lg flex flex-col">
			<div className="flex justify-between">
				<p className="font-VT323 text-xl">{formattedDate}</p>
				<div className="font-VT323 text-3xl leading-none text-orange-400">
					{type}
				</div>
			</div>
			<p className="font-VT323 text-md leading-none mb-1">Duration:</p>
			<div className="flex space-x-1 mb-1">
				<div className="bg-white h-5 w-3 -skew-x-12" />
				<div className="bg-white h-5 w-3 -skew-x-12" />
				<div className="bg-white h-5 w-3 -skew-x-12" />
				<div className="bg-white h-5 w-3 -skew-x-12" />
				<div className="bg-white h-5 w-3 -skew-x-12" />
				<div className="bg-white h-5 w-3 -skew-x-12" />
				<div className="bg-white h-5 w-3 -skew-x-12" />
				<div className="bg-white h-5 w-3 -skew-x-12" />
				<div className="bg-white h-5 w-3 -skew-x-12" />
			</div>
			<div className="flex space-x-2">
				<p className="font-VT323">Lat: {lat.toFixed(2)}°</p>
				<p className="font-VT323">Lon: {lon.toFixed(2)}°</p>
			</div>
		</div>
	);
}

export default MarkerText;
