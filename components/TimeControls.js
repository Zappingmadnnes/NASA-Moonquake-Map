import Image from "next/image";
import React, { useEffect, useState } from "react";

function TimeControls({ time, setTime }) {
	const warpFactors = [
		-100000000, -10000000, -1000000, -100000, -10000, -5000, -1000, -500,
		-200, -100, -50, -10, 5, -1, 0, 1, 5, 10, 50, 100, 200, 500, 1000, 5000,
		10000, 100000, 1000000, 10000000, 100000000,
	];
	const [warpIndex, setWarpIndex] = useState(
		Math.floor(warpFactors.length / 2)
	);
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

	const formattedDate = `${year}-${month}-${day}`;
	const formattedTime = `${hours}:${minutes}:${seconds}`;

	// Function to increment time by the warp value every tenth of a second
	const incrementTime = () => {
		setTime(time + warpFactors[warpIndex] / 24 / 60 / 60 / 100);
	};

	useEffect(() => {
		const intervalId = setInterval(incrementTime, 10); // Run every 100 milliseconds
		return () => clearInterval(intervalId); // Cleanup on component unmount
	}, [time, incrementTime]);

	const changeWarp = (increment) => {
		if (increment > 0) {
			if (warpIndex + 1 < warpFactors.length) {
				let newIndex = warpIndex + increment;
				setWarpIndex(newIndex);
			}
		} else {
			if (warpIndex > 0) {
				let newIndex = warpIndex + increment;
				setWarpIndex(newIndex);
			}
		}
	};

	return (
		<div className="absolute bottom-0 left-[30%] py-6 px-12 bg-[#0C141D] border-[#354A6C] pointer-events-auto opacity-80 border-r border-t rounded-tr-lg flex flex-col justify-center items-center ">
			<div className="font-VT323 text-3xl mb-4">
				{warpFactors[warpIndex] == 0
					? "Paused"
					: warpFactors[warpIndex] == 1
					? "Real time"
					: warpFactors[warpIndex] + "x speed"}
			</div>

			<div className="flex items-center justify-center w-full gap-4">
				<p className="mr-5 text-[#EDEDED] w-32 font-VT323 text-3xl">
					{formattedDate}
				</p>
				<div
					onClick={() => changeWarp(-1)}
					className="flex items-center justify-center  select-none rounded-xl aspect-square border-2 border-[#EDEDED] w-11 hover:bg-gray-900 hover:bg-opacity-100 hover:shadow-xl transition-all duration-150 hover:cursor-pointer"
				>
					<Image
						src="/back.svg"
						alt="back-button"
						width={1000}
						height={0}
						className="w-[50%]"
					/>
				</div>
				<div
					onClick={() =>
						setWarpIndex(Math.floor(warpFactors.length / 2))
					}
					className="flex items-center justify-center select-none rounded-xl aspect-square border-2 border-[#EDEDED] w-11 hover:bg-gray-900 hover:bg-opacity-100 hover:shadow-xl transition-all duration-150 hover:cursor-pointer"
				>
					<Image
						src="/play.svg"
						alt="back-button"
						width={1000}
						height={0}
						className="w-[50%]"
					/>
				</div>
				<div
					onClick={() => changeWarp(1)}
					className="flex items-center justify-center select-none rounded-xl aspect-square border-2 border-[#EDEDED] w-11 hover:bg-gray-900 hover:bg-opacity-100 hover:shadow-xl transition-all duration-150 hover:cursor-pointer"
				>
					<Image
						src="/forward.svg"
						alt="back-button"
						width={1000}
						height={0}
						className="w-[50%]"
					/>
				</div>
				<p className="ml-5 w-32 font-VT323 text-3xl text-[#EDEDED]">
					{formattedTime}
				</p>
			</div>
			{/* <div className="h-1 bg-[#EDEDED] w-[80%] overflow-visible relative">
            <div className="w-5 border-[#EDEDED] border-4 rounded-full right-[40%] -top-2 aspect-square bg-gray-800 absolute"></div>
        </div> */}
			{/* <DraggableTimeline time={time} setTime={setTime} /> */}
		</div>
	);
}

export default TimeControls;
