import { useState, useRef, useEffect } from "react";

function DraggableTimeline({ setTime, time }) {
	const [handlePosition, setHandlePosition] = useState(0);
	const [isDragging, setIsDragging] = useState(false);
	const [selectedTime, setSelectedTime] = useState(0);
	const [formattedDate, setFormattedDate] = useState();
	const timelineRef = useRef(null);

	const start_date = 2440541;
	const end_date = 2443418;

	const stopDrag = () => {
		setIsDragging(false);
		setTime(selectedTime);
		document.removeEventListener("mousemove", handleDrag);
		document.removeEventListener("mouseup", stopDrag);
	};

	const handleDrag = (event) => {
		const timelineRect = timelineRef.current.getBoundingClientRect();
		let newPosition = event.clientX - timelineRect.left;
		newPosition = Math.max(0, Math.min(newPosition, timelineRect.width));

		const newPositionPercent = (newPosition / timelineRect.width) * 100;
		setHandlePosition(newPositionPercent);
		setSelectedTime(
			((end_date - start_date) * newPositionPercent) / 100 + start_date
		);
		const millisecondsSinceEpoch =
			(((end_date - start_date) * newPositionPercent) / 100 +
				start_date -
				2440587.5) *
			24 *
			60 *
			60 *
			1000;
		const gregorianDate = new Date(millisecondsSinceEpoch);
		const year = gregorianDate.getFullYear();
		const month = String(gregorianDate.getMonth() + 1).padStart(2, "0");
		const day = String(gregorianDate.getDate()).padStart(2, "0");
		// const formattedDate = `${year}-${month}-${day}`;
		setFormattedDate(`${year}-${month}-${day}`);
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

	// JD to gregorian

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
						{formattedDate}
					</div>
				)}
			</div>
		</div>
	);
}

export default DraggableTimeline;
