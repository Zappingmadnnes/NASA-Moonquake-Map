import React, { useRef } from "react";
import { Sphere } from "@react-three/drei";

function Sun({ position, radiusScale }) {
	const sunRadius = 696340 / radiusScale;
	const sunRef = useRef(); // Create a ref for the sun

	return (
		<Sphere
			args={[sunRadius, 32, 32]}
			transparent
			position={position}
			ref={sunRef}
		>
			<meshBasicMaterial transparent color={0xfce570} />
		</Sphere>
	);
}

export default Sun;
