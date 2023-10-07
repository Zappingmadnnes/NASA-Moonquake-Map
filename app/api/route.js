import { spawn } from "child_process";

export async function GET(req) {
	const { searchParams } = new URL(req.url);
	const number = searchParams.get("number");

	let python = spawn("python3", ["script.py", number]);
	let datatosend = "";

	for await (const data of python.stdout) {
		datatosend += data.toString();
	}

	return Response.json({ result: datatosend });
}
