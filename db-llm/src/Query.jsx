import React, { useState } from "react";

const Query = () => {
	const [userInput, setUserInput] = useState("");
	const [response, setResponse] = useState("");
	const [errorMsg, setErrorMsg] = useState("");
	const [progressMessage, setProgressMessage] = useState("");

	const [isInputDisabled, setIsInputDisabled] = useState(false);

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
			setProgressMessage("Sending request...");

			try {
				const response = await fetch("http://localhost:0000", {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({ query: userInput }),
				});

				if (!response.ok) {
					throw new Error("Server error");
				}

				const eventSource = new EventSource("http://localhost:0000/status");

				eventSource.onmessage = (event) => {
					const data = JSON.parse(event.data);
					setProgressMessage(data.message);

					if (data.final) {
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
					setIsInputDisabled(false);
					eventSource.close();
				};
			} catch (error) {
				//console.error("Error establishing connection to the server:", error);
				setErrorMsg(
					"Error connecting to the server. Please check if the server is running or try again later"
				);
				setProgressMessage("");
				setIsInputDisabled(false);
			}
		}
	};

	return (
		<div>
			<h1>LLM Database Query Interface</h1>
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
				<p>{response}</p>
			</div>
		</div>
	);
};

export default Query;
