"use client";
import { useState } from "react";
import Image from "next/image";

export default function LegendDropdown() {
	const [expanded, setExpanded] = useState(true);
	const [modalShown, setModalShown] = useState(false);
	const [selectedEvent, setSelectedEvent] = useState(null);

	const legendInfo = [
		{
			title: "DM - Deep Moonquake",
			color: "#EE984F",
			description:
				"Info about deep moonquake...lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptas sapiente similique dignissimos ex error illum molestiae perspiciatis, repellendus facilis dolor earum atque qui impedit sint magnam iure repudiandae modi aperiam ",
		},
		{
			title: "SM - Shallow Moonquake",
			color: "#354A6C",
			description:
				"Info about shallow moonquake...lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptas sapiente similique dignissimos ex error illum molestiae perspiciatis, repellendus facilis dolor earum atque qui impedit sint magnam iure repudiandae modi aperiam",
		},
		{
			title: "MI - Meteorite Impacts",
			color: "#D21F3C",
			description:
				"Info about meteorite impacts...lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptas sapiente similique dignissimos ex error illum molestiae perspiciatis, repellendus facilis dolor earum atque qui impedit sint magnam iure repudiandae modi aperiam",
		},
		{
			title: "AI - Artificial Impacts",
			color: "#b8c7de",
			description:
				"Info about artificial impacts...lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptas sapiente similique dignissimos ex error illum molestiae perspiciatis, repellendus facilis dolor earum atque qui impedit sint magnam iure repudiandae modi aperiam",
		},
	];

	const handleEventClick = (event) => {
		setSelectedEvent(event);
		setModalShown(true);
	};

	return (
		<>
			<div
				className={`absolute top-0 right-0 transition-all duration-500 ${
					expanded ? "translate-y-0" : "-translate-y-[100%]"
				}`}
			>
				<div className="flex flex-col items-start justify-center w-full gap-2 px-6 py-6 bg-[#0C141D] border-[#354A6C] border-b-2 border-l-2 pointer-events-auto opacity-80 rounded-bl-lg">
					<h2 className="mb-3 text-2xl font-VT323">
						Event Classifications
					</h2>
					{legendInfo.map((event, index) => (
						<div
							key={index}
							className={`font-VT323 text-3xl leading-none hover:cursor-pointer`}
							style={{ color: event.color }}
							onClick={() => handleEventClick(event)}
						>
							{event.title}
						</div>
					))}
				</div>
				<div
					onClick={() => setExpanded(!expanded)}
					className="py-1 hover:cursor-pointer flex flex-col items-center justify-center w-[40%] absolute bg-[#0C141D] border-[#354A6C] border-b-2 border-l-2 border-r-2 opacity-80 rounded-bl-xl rounded-br-xl left-[30%] pointer-events-auto"
				>
					<p className="text-lg leading-none font-VT323">Info</p>
					<Image
						src="/arrow-down.svg"
						width={1000}
						height={0}
						alt="arrow-down"
						className={`w-6 ${
							expanded ? "-scale-y-100" : "scale-y-100"
						} transition-all duration-500`}
					/>
				</div>
			</div>
			{modalShown && selectedEvent && (
				<div className="absolute inset-0 flex items-center justify-center w-screen h-screen bg-black bg-opacity-50 z-[9999]">
					<div className="bg-[#0C141D] opacity-90 border-[#354A6C] border rounded-md p-7 w-[40%] flex pointer-events-auto relative flex-col items-start justify-start">
						<div
							className="absolute w-8 aspect-square top-6 right-6 hover:cursor-pointer"
							onClick={() => setModalShown(false)}
						>
							<Image
								src="/cross.svg"
								alt="close"
								width={1000}
								height={0}
								className="w-full"
							/>
						</div>
						<h1
							className={`text-4xl font-VT323 mb-5`}
							style={{ color: selectedEvent.color }}
						>
							{selectedEvent.title}
						</h1>
						<p className="text-xl font-VT323">
							{selectedEvent.description}
						</p>
					</div>
				</div>
			)}
		</>
	);
}
