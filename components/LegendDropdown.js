"use client";
import { useState } from "react";
import Image from "next/image";

export default function LegendDropdown() {
	const [expanded, setExpanded] = useState(false);

	return (
		<div
			className={`absolute top-0 right-0 w-[20%] transition-all duration-500 ${
				expanded ? "translate-y-0" : "-translate-y-[100%]"
			}`}
		>
			<div className="flex flex-col items-start justify-center w-full gap-2 px-8 py-10 bg-gray-800 border-b border-l pointer-events-auto backdrop-blur-2xl opacity-70 rounded-bl-xl">
				<h2 className="mb-3 text-xl">Maginitude classifications</h2>
				<div className="flex items-center justify-center">
					<div className="w-5 mr-3 bg-green-600 aspect-square blur-sm"></div>
					<p>Mirco Moonquake</p>
				</div>
				<div className="flex items-center justify-center">
					<div className="w-5 mr-3 bg-yellow-600 aspect-square blur-sm"></div>
					<p>Minor Moonquake</p>
				</div>
				<div className="flex items-center justify-center">
					<div className="w-5 mr-3 bg-orange-500 aspect-square blur-sm"></div>
					<p>Light Moonquake</p>
				</div>
				<div className="flex items-center justify-center">
					<div className="w-5 mr-3 bg-orange-700 aspect-square blur-sm"></div>
					<p>Moderate Moonquake</p>
				</div>
				<div className="flex items-center justify-center">
					<div className="w-5 mr-3 bg-red-700 aspect-square blur-sm"></div>
					<p>Strong Moonquake</p>
				</div>
				<div className="flex items-center justify-center">
					<div className="w-5 mr-3 bg-red-900 aspect-square blur-sm"></div>
					<p>Major Moonquake</p>
				</div>
			</div>
			<div
				onClick={() => setExpanded(!expanded)}
				className="h-14 hover:cursor-pointer flex flex-col items-center justify-center w-[40%] absolute bg-gray-800 border-b border-l border-r backdrop-blur-2xl opacity-70 rounded-bl-xl rounded-br-xl left-[30%] pointer-events-auto"
			>
				<p className="mt-1 text-sm">Legend</p>
				<Image
					src="/arrow-down.svg"
					width={1000}
					height={0}
					alt="arrow-down"
					className={`w-6 ${
						expanded ? "rotate-180" : "rotate-0"
					} transition-all duration-500`}
				/>
			</div>
		</div>
	);
}
