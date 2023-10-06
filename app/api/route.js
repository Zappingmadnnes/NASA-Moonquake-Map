import { spawn } from "child_process";

export async function GET(req, res) {
	let python = spawn("python3", ["script.py", 5]);
	let datatosend = "";

	for await (const data of python.stdout) {
		datatosend += data.toString();
	}

	return Response.json({ result: datatosend });
}
