"use client";
import { useState } from "react";
import Image from "next/image";

export default function LegendDropdown() {
	const [expanded, setExpanded] = useState(false);

	return (
		<div
			className={`absolute top-0 right-0 transition-all duration-500 ${
				expanded ? "translate-y-0" : "-translate-y-[100%]"
			}`}
		>
			<div className="flex flex-col items-start justify-center w-full gap-2 px-6 py-6 bg-[#0C141D] border-[#354A6C] border-b-2 border-l-2 pointer-events-auto opacity-80 rounded-bl-lg">
				<h2 className="mb-3 font-VT323 text-2xl">
					Event Classifications
				</h2>
				<div className="font-VT323 text-3xl leading-none text-[#EE984F]">
					DM - Deep Moonquake
				</div>
				<div className="font-VT323 text-3xl leading-none text-[#354A6C]">
					SM - Shallow Moonquake
				</div>
				<div className="font-VT323 text-3xl leading-none text-[#D21F3C]">
					MI - Meteorite Impacts
				</div>
				<div className="font-VT323 text-3xl leading-none text-[#b8c7de]">
					AI - Artificial Impacts
				</div>
			</div>
			<div
				onClick={() => setExpanded(!expanded)}
				className="py-1 hover:cursor-pointer flex flex-col items-center justify-center w-[40%] absolute bg-[#0C141D] border-[#354A6C] border-b-2 border-l-2 border-r-2 opacity-80 rounded-bl-xl rounded-br-xl left-[30%] pointer-events-auto"
			>
				<p className="leading-none text-lg font-VT323">Info</p>
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
	);
}
