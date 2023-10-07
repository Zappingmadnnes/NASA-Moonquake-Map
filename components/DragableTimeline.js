import { useState, useRef, useEffect } from "react";

function DraggableTimeline({ setTime, time }) {
	const [handlePosition, setHandlePosition] = useState(0);
	const [isDragging, setIsDragging] = useState(false);
	const [currentYear, setCurrentYear] = useState(1969);
	const timelineRef = useRef(null);

	const calculateYear = (positionPercent) => {
		const range = 1979 - 1969;
		return Math.round(1969 + (range * positionPercent) / 100);
	};

	function yearToJulianDate(year) {
		return (year - 1969) * 365.25 + 2440546; // 2440546 is the Julian date for the start of 1969
	}

	const handleDrag = (event) => {
		const timelineRect = timelineRef.current.getBoundingClientRect();
		let newPosition = event.clientX - timelineRect.left;
		newPosition = Math.max(0, Math.min(newPosition, timelineRect.width));

		const newPositionPercent = (newPosition / timelineRect.width) * 100;
		setHandlePosition(newPositionPercent);
	};

	useEffect(() => {
		const stopDrag = () => {
			setIsDragging(false);
			setCurrentYear(calculateYear(handlePosition));
			setTime(yearToJulianDate(calculateYear(handlePosition))); // Update the main application's time
			document.removeEventListener("mousemove", handleDrag);
			document.removeEventListener("mouseup", stopDrag);
		};

		if (isDragging) {
			document.addEventListener("mousemove", handleDrag);
			document.addEventListener("mouseup", stopDrag);
		}

		return () => {
			document.removeEventListener("mousemove", handleDrag);
			document.removeEventListener("mouseup", stopDrag);
		};
	}, [isDragging, handlePosition]);

	function julianDateToYear(julianDate) {
		return Math.round((julianDate - 2440546) / 365.25 + 1969);
	}

	function yearToPositionPercent(year) {
		const range = 1979 - 1969;
		const positionPercent = ((year - 1969) / range) * 100;
		return positionPercent;
	}

	useEffect(() => {
		const yearFromTime = julianDateToYear(time);
		const positionPercent = yearToPositionPercent(yearFromTime);
		setHandlePosition(positionPercent);
		setCurrentYear(yearFromTime);
	}, [time]);

	return (
		<div
			className="h-1 bg-[#EDEDED] w-[70%] overflow-visible relative select-none"
			ref={timelineRef}
		>
			<div
				className={`w-5 ${
					isDragging ? "border-orange-400" : "border-[#EDEDED]"
				} border-4 rounded-full -top-2 aspect-square bg-gray-800 absolute hover:cursor-pointer`}
				style={{ right: `calc(100% - ${handlePosition}% - 0.5rem)` }}
				draggable
				onMouseDown={(e) => {
					e.preventDefault();
					setIsDragging(true);
				}}
			>
				{isDragging && (
					<div className="absolute text-xs text-white font-VT323 -bottom-6">
						{calculateYear(handlePosition)}
					</div>
				)}
			</div>
		</div>
	);
}

export default DraggableTimeline;
