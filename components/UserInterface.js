import Image from "next/image";
import DraggableTimeline from "./DragableTimeline";
import LegendDropdown from "./LegendDropdown";
import MiniMap from "./MiniMap";
import EventNotification from "./EventNotification";
import TimeControls from "./TimeControls";

export default function UserInterface({ data, events, time, setTime }) {
	return (
		<div className="absolute inset-0 w-screen h-screen overflow-hidden z-[99999999] pointer-events-none">
			<div className="absolute top-0 left-[35%] right-[35%] bg-gray-800 pointer-events-auto h-16 backdrop-blur-2xl opacity-70 border-r border-b border-l rounded-b-xl border-[#EDEDED] flex justify-center items-center">
				<div className="flex flex-row gap-6 mt-44 whitespace-nowrap">
					<div className="flex flex-col">
						<h3>Sun</h3>
						<ul>
							{data && data.sun ? (
								<>
									<li>X: {data.sun[0]}</li>
									<li>Y: {data.sun[1]}</li>
									<li>Z: {data.sun[2]}</li>
								</>
							) : (
								<li>Loading...</li>
							)}
						</ul>
					</div>

					<div className="flex flex-col">
						<h3>Earth Center</h3>
						<ul>
							{data && data.earth_center ? (
								<>
									<li>X: {data.earth_center[0]}</li>
									<li>Y: {data.earth_center[1]}</li>
									<li>Z: {data.earth_center[2]}</li>
								</>
							) : (
								<li>Loading...</li>
							)}
						</ul>
					</div>

					<div className="flex flex-col">
						<h3>Earth</h3>
						<ul>
							{data && data.earth ? (
								<>
									<li>X: {data.earth[0]}</li>
									<li>Y: {data.earth[1]}</li>
									<li>Z: {data.earth[2]}</li>
								</>
							) : (
								<li>Loading...</li>
							)}
						</ul>
					</div>

					<div className="flex flex-col">
						<h3>Moon</h3>
						<ul>
							{data && data.moon ? (
								<>
									<li>X: {data.moon[0]}</li>
									<li>Y: {data.moon[1]}</li>
									<li>Z: {data.moon[2]}</li>
								</>
							) : (
								<li>Loading...</li>
							)}
						</ul>
					</div>

					{/* ... similarly for earth and moon ... */}
				</div>
			</div>
			<TimeControls time={time} setTime={setTime} />
			<div className="absolute bottom-0 left-[0] h-full w-[30%] flex flex-col justify-end items-start">
				<div className="overflow-y-auto pointer-events-auto scrollbar-none bg-[#0C141D] border-[#354A6C] border-r-2 opacity-80 p-4">
					{events.map(
						(entry, index) =>
							index < 65 && (
								<EventNotification key={index} event={entry} />
							)
					)}
				</div>

				{/* <div className="w-[80%] bg-gray-800 pointer-events-auto h-[60%] backdrop-blur-2xl border-r border-t border-[#EDEDED] rounded-tr-xl opacity-70 flex flex-col items-center justify-end">
					<div className="w-full border-t h-[40%]"></div>
					<div className="absolute bottom-0 flex items-end justify-center w-full h-40 gap-5 text-[#EDEDED] text-sm">
						<div className="w-10 h-32 transform -skew-x-[14deg] bg-gray-800 border-t border-l border-r border-[#EDEDED] backdrop-blur-2xl opacity-70 shadow-[inset_0_-2px_8px_#EDEDED] flex justify-center items-center">
							<p className="transform -rotate-90">Micro</p>
						</div>
						<div className="w-10 h-32 transform -skew-x-[14deg] bg-gray-800 border-t border-l border-r border-[#EDEDED] backdrop-blur-2xl opacity-70 shadow-[inset_0_-2px_8px_#EDEDED] flex justify-center items-center">
							<p className="transform -rotate-90">Minor</p>
						</div>
						<div className="w-10 h-32 transform -skew-x-[14deg] bg-gray-800 border-t border-l border-r border-[#EDEDED] backdrop-blur-2xl opacity-70 shadow-[inset_0_-2px_8px_#EDEDED] flex justify-center items-center">
							<p className="transform -rotate-90">Light</p>
						</div>
						<div className="w-10 h-32 transform -skew-x-[14deg] bg-gray-800 border-t border-l border-r border-[#EDEDED] backdrop-blur-2xl opacity-70 shadow-[inset_0_-2px_8px_#EDEDED] flex justify-center items-center">
							<p className="transform -rotate-90">Moderate</p>
						</div>
						<div className="w-10 h-32 transform -skew-x-[14deg] bg-gray-800 border-t border-l border-r border-[#e30b1d] backdrop-blur-2xl opacity-70 shadow-[inset_0_15px_8px_#e30b1d] flex justify-center items-center">
							<p className="transform -rotate-90">Strong</p>
						</div>
						<div className="w-10 h-32 transform -skew-x-[14deg] bg-gray-800 border-t border-l border-r border-[#EDEDED] backdrop-blur-2xl opacity-70 shadow-[inset_0_-2px_8px_#EDEDED] flex justify-center items-center">
							<p className="transform -rotate-90">Major</p>
						</div>
					</div>
				</div> */}
				<MiniMap events={events} />
			</div>
			<LegendDropdown />
		</div>
	);
}
