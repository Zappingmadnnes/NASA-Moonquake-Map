import { exec } from "child_process";

export async function GET() {
	return Response.json({ result: exec("python3 /script.py") });

	// const { searchParams } = new URL(
	// 	Request.url,
	// 	`http://${Request.headers.host}`
	// );
	// const id = searchParams.get("id");
	// Res
	// exec("python3 script.py", (error, stdout, stderr) => {
	// 	if (error) {
	// 		console.error(`exec error: ${error}`);
	// 		return Response.status(500).json({
	// 			error: "Failed to execute Python script.",
	// 		});
	// 	}
	// 	// Return the output of the Python script along with the id
	// 	return Response.status(200).json({ id, pythonOutput: stdout });
	// });
}
