import { useState, useRef, useEffect } from "react";

function DraggableTimeline() {
	const [handlePosition, setHandlePosition] = useState(0);
	const [isDragging, setIsDragging] = useState(false);
	const timelineRef = useRef(null);

	const handleDrag = (event) => {
		const timelineRect = timelineRef.current.getBoundingClientRect();
		let newPosition = event.clientX - timelineRect.left;
		newPosition = Math.max(0, Math.min(newPosition, timelineRect.width));

		setHandlePosition((newPosition / timelineRect.width) * 100);
	};

	useEffect(() => {
		const stopDrag = () => {
			setIsDragging(false);
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
	}, [isDragging]);

	return (
		<div
			className="h-1 bg-[#EDEDED] w-[80%] overflow-visible relative select-none"
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
			></div>
		</div>
	);
}

export default DraggableTimeline;
