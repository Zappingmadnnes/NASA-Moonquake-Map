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
				"Deep moonquakes, which occur at depths between 700 and 1000 kilometers, approximately halfway to the Moon's center, are a fascinating lunar phenomenon. These quakes are notably numerous, with around 6000 detected throughout experiments, originating from roughly 300 distinct source regions, many of which have been precisely located. They exhibit a peculiar tidal periodicity, coinciding with the Moon's 27.5-day orbit. Each source region consistently produces repeatable events that correlate with others from the same area, allowing for data stacking. Despite their numerous occurrences, deep moonquakes are relatively small, with magnitudes typically around 1 or less on the body wave scale and stress drops of 1 bar or less. They feature a dominant period of 1 Hz, strong P and S coda that can obscure other arrivals, and a long decay time of approximately 1 hour. These intriguing seismic events primarily appear on LP (long period) channels, adding to their enigmatic nature.",
		},
		{
			title: "SM - Shallow Moonquake",
			color: "#354A6C",
			description:
				"Shallow moonquakes present a contrasting aspect of lunar seismic activity. These quakes occur in the upper 100 kilometers of the Moon's surface and are relatively infrequent, with only 28 instances detected throughout the experiment. However, they exhibit considerable energy release, with estimated magnitudes ranging from 3 to 5, making them significantly more powerful than their deep counterparts. What sets shallow moonquakes apart is their appearance on both LP (long period) and SP (short period) channels, providing valuable insights into the lunar interior despite their rarity.",
		},
		{
			title: "MI - Meteorite Impacts",
			color: "#D21F3C",
			description:
				"Meteorite impacts on the Moon are natural events that have contributed significantly to shaping the lunar surface and providing valuable insights into lunar geology and planetary science. Much the same as artificial impacts, these impacts occur when meteoroids, asteroids, or comets collide with the Moon's surface.",
		},
		{
			title: "AI - Artificial Impacts",
			color: "#b8c7de",
			description:
				"Artifical impacts come from probes colliding with the surface. Notably during the experiments Apollo the upper stage and lunar module were ditched to collide with the surface, to collect data.",
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
