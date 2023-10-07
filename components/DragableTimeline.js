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

	const calculateDate = (positionPercent) => {
		const totalMonths = (1979 - 1969) * 12; // Total months in the range
		const currentMonth = Math.round((totalMonths * positionPercent) / 100);
		const year = 1969 + Math.floor(currentMonth / 12);
		const month = currentMonth % 12;
		return { year, month };
	};

	function yearToJulianDate(year) {
		return (year - 1969) * 365.25 + 2440546; // 2440546 is the Julian date for the start of 1969
	}

	function dateToJulianDate(year, month) {
		const day = 1; // Set to the first day of the month
		const a = Math.floor((14 - (month + 1)) / 12);
		const y = year + 4800 - a;
		const m = month + 1 + 12 * a - 3;
		let jd =
			day +
			Math.floor((153 * m + 2) / 5) +
			365 * y +
			Math.floor(y / 4) -
			Math.floor(y / 100) +
			Math.floor(y / 400) -
			32045;
		return jd;
	}

	const stopDrag = () => {
		setIsDragging(false);
		const { year, month } = calculateDate(handlePosition);
		setCurrentYear(year); // This can be updated to include the month if needed
		setTime(dateToJulianDate(year, month)); // Update the main application's time
		document.removeEventListener("mousemove", handleDrag);
		document.removeEventListener("mouseup", stopDrag);
	};

	const handleDrag = (event) => {
		const timelineRect = timelineRef.current.getBoundingClientRect();
		let newPosition = event.clientX - timelineRect.left;
		newPosition = Math.max(0, Math.min(newPosition, timelineRect.width));

		const newPositionPercent = (newPosition / timelineRect.width) * 100;
		setHandlePosition(newPositionPercent);
	};

	useEffect(() => {
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
		const millisecondsSinceEpoch = (time - 2440587.5) * 24 * 60 * 60 * 1000;
		const gregorianDate = new Date(millisecondsSinceEpoch);
		const year = gregorianDate.getFullYear();
		const positionPercent = ((year - 1969) / (1979 - 1969)) * 100;
		setHandlePosition(positionPercent);
		setCurrentYear(year);
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
					<div className="absolute text-xs -left-[50%] text-white w-fit whitespace-nowrap font-VT323 -bottom-6">
						{`${calculateDate(handlePosition).year}-${String(
							calculateDate(handlePosition).month + 1
						).padStart(2, "0")}`}
					</div>
				)}
			</div>
		</div>
	);
}

export default DraggableTimeline;
