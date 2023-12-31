import DraggableTimeline from "./DragableTimeline";
import LegendDropdown from "./LegendDropdown";
import MiniMap from "./MiniMap";
import EventNotification from "./EventNotification";
import TimeControls from "./TimeControls";

export default function UserInterface({
	events,
	time,
	setTime,
	moonRef,
	cameraRef,
}) {
	const copiedEvents = [...events];
	copiedEvents.sort((a, b) => b.JDate - a.JDate);
	return (
		<div className="absolute inset-0 w-screen h-screen overflow-hidden z-[99999999] pointer-events-none">
			<div className="absolute top-0 left-[30%] right-[30%] bg-[#0C141D] border-[#354A6C] pointer-events-auto h-16  opacity-80 border-r border-b rounded-br-xl flex justify-center items-center">
				<p className="mr-5 font-VT323">1969</p>
				<DraggableTimeline time={time} setTime={setTime} />
				<p className="ml-5 font-VT323">1977</p>
			</div>
			<TimeControls time={time} setTime={setTime} />
			<div className="absolute bottom-0 left-[0] h-full  w-[30%] flex flex-col justify-end items-start">
				<div className="relative overflow-y-auto pointer-events-auto w-full h-full scrollbar-none bg-[#0C141D] border-[#354A6C] border-r-2 opacity-80 p-4">
					<h1 className="text-center font-VT323 text-2xl">
						Curretly visible events
					</h1>
					<div className="absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%]">
						{time < 2440546.4286689814 && ( // Time of first event
							<>
								<p className="font-VT323 text-center text-lg">
									No recent events
								</p>
								<p className="font-VT323 text-center">
									Fast forward or use slider to select a
									specific time
								</p>
							</>
						)}
					</div>
					{copiedEvents.map((entry, index) => {
						if (entry.JDate <= time && time <= entry.JDate + 30) {
							return (
								<EventNotification
									key={index}
									event={entry}
									moonRef={moonRef}
									cameraRef={cameraRef}
								/>
							);
						}
						return null;
					})}
				</div>
				<MiniMap events={events} selectedTime={time} />
			</div>
			<LegendDropdown />
		</div>
	);
}
