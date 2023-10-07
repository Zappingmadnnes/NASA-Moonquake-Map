import { spawn } from "child_process";

export async function GET(req) {
	const { searchParams } = new URL(req.url);
	const julianDate = searchParams.get("julianDate");

	let python = spawn("python3", ["coords.py", julianDate]);
	let datatosend = "";

	for await (const data of python.stdout) {
		datatosend += data.toString();
	}

	return Response.json({ result: JSON.parse(datatosend) });
}

// "1937-09-25"
