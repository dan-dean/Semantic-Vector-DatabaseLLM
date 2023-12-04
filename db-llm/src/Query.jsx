import React, { useState } from "react";
import ReactMarkdown from "react-markdown";
import ClipLoader from "react-spinners/ClipLoader";

const splashTexts = [
	"Computing the secrets of the universe...",
	"Assembling the bits of wisdom...",
	"Translating ancient records...",
	"Seeking wisdom from Lehi’s dream...",
	"Gathering manna for thought...",
	"Unearthing plates of knowledge...",
	"Consulting the Liahona of learning...",
	"Exploring Moroni’s messages...",
	"Navigating Nephi’s ship of wisdom...",
	"Discovering hidden truths in the Jaredite barges...",
	"Mining gems from the Tree of Life...",
	"Sifting through the sands of the Promised Land...",
	"Charting paths through Mormon’s writings...",
	"Gleaning guidance from the Brother of Jared...",
	"Interpreting the stars of the Nephite sky...",
	"Divining insights from the Waters of Mormon...",
	"Pondering with King Lamoni...",
	"Aligning with the stars of Kolob...",
	"Consulting with the prophets of old...",
	"Gathering manna of wisdom...",
	"Seeking counsel from the tower of Babel...",
	"Harvesting words from the Tree of Life...",
	"Tracing the footsteps of Moroni’s travels...",
	"Connecting with the armies of Helaman...",
	"Receiving revelation from the Urim and Thummim...",
	"Crossing the wilderness of faith...",
	"Illuminating truths from the Liahona...",
	"Channeling insights from the Seer Stone...",
	"Visualizing Nephi’s visions...",
	"Rekindling the faith of the Zoramites...",
	"Navigating through the Nephite-Lamanite wars...",
	"Assembling the clues from the brass plates...",
	"Embarking on a journey with the Jaredites...",
	"Sailing the seas with the brother of Jared...",
	"Traversing the narrow path to enlightenment...",
	"Discovering the treasures of Cumorah...",
];

const Query = () => {
	const [userInput, setUserInput] = useState("");
	const [response, setResponse] = useState("");
	const [errorMsg, setErrorMsg] = useState("");
	const [progressMessage, setProgressMessage] = useState("");

	const [isInputDisabled, setIsInputDisabled] = useState(false);
	const [isLoading, setIsLoading] = useState(false);

	const MAX_CHARS = 200;

	const handleInputChange = (e) => {
		if (e.target.value.length <= MAX_CHARS) {
			setUserInput(e.target.value);
		}
	};

	const handleSubmit = async () => {
		if (userInput.length <= 10) {
			setErrorMsg("Please enter more text");
			setResponse("");
		} else {
			setErrorMsg("");
			setResponse("");
			setIsInputDisabled(true);
			setIsLoading(true);
			setProgressMessage("Sending request...");

			try {
				const response = await fetch(
					"https://chatbomproxy.excursionsxr.world/query",
					{
						method: "POST",
						headers: {
							"Content-Type": "application/json",
						},
						body: JSON.stringify({ query: userInput }),
					}
				);

				if (response.status === 503) {
					throw new Error("Server busy");
				} else if (!response.ok) {
					throw new Error("Server error");
				}

				const responseData = await response.json();

				if (responseData.result === "Query Recieved") {
					const eventSource = new EventSource(
						"https://chatbomproxy.excursionsxr.world/status"
					);

					eventSource.onmessage = (event) => {
						const data = JSON.parse(event.data);
						console.log(data.message);

						const randomSplashText =
							splashTexts[Math.floor(Math.random() * splashTexts.length)];
						setProgressMessage(randomSplashText);

						if (data.final) {
							setProgressMessage("");
							setIsLoading(false);
							eventSource.close();
							setIsInputDisabled(false);
							setResponse(data.result); // Assuming the final message contains the result
						}
					};

					eventSource.onerror = () => {
						setErrorMsg(
							"Server is offline or the connection attempt was unsuccessful"
						);
						setProgressMessage("");
						setIsLoading(false);
						setIsInputDisabled(false);
						eventSource.close();
					};
				} else {
					setProgressMessage("");
					setIsInputDisabled(false);
					setIsLoading(false);
					setResponse(
						"Server responded with unknown or unhandled message. Sorry"
					);
				}
			} catch (error) {
				if (error.message === "Server busy") {
					setErrorMsg(
						"Server is busy handling another request. Try again soon"
					);
				} else {
					setErrorMsg(
						"Error connecting to the server. Please check if the server is running or try again later"
					);
				}
				setProgressMessage("");
				setIsLoading(false);
				setIsInputDisabled(false);
			}
		}
	};

	return (
		<div>
			<h1>ChatBoM</h1>
			<h2>Book of Mormon Database LLM</h2>
			<textarea
				value={userInput}
				onChange={handleInputChange}
				placeholder="Enter your query"
				disabled={isInputDisabled}
				rows={4}
				style={{ width: "100%", resize: "vertical" }}
			/>
			<p>
				{userInput.length} / {MAX_CHARS}
			</p>
			<button onClick={handleSubmit} disabled={isInputDisabled}>
				Submit
			</button>
			{errorMsg && <p style={{ color: "red" }}>{errorMsg}</p>}
			{progressMessage && <p>{progressMessage}</p>}
			<div>
				<h2>Response:</h2>
				{isLoading ? (
					<div style={{ textAlign: "center", margin: "20px" }}>
						<ClipLoader size={50} color={"#123abc"} />
						{/* Adjust size and color as needed */}
					</div>
				) : (
					<ReactMarkdown>{response}</ReactMarkdown>
				)}
			</div>
		</div>
	);
};

export default Query;
