const About = () => {
	return (
		<div>
			<h1>About This System</h1>
			<p>
				This system is a designed to leverage the power of vector search and
				language models for efficient and accurate scriptural reference
				retrieval. The website component provides a front-facing UI for query
				submission and response delivery, while a Flask python server
				coordinates the API calls to the local Marqo instance and the LLM Studio
				instance.
			</p>
			<p>
				<strong>Vector Search with Marqo:</strong> Utilizing{" "}
				<a
					href="https://github.com/marqo-ai/marqo"
					target="_blank"
					rel="noopener noreferrer"
				>
					Marqo
				</a>
				, the system performs sophisticated vector searches. Marqo, an
				end-to-end vector search engine, streamlines the process of vector
				generation, storage, and retrieval, allowing for complex semantic
				queries and efficient data processing.
			</p>
			<p>
				<strong>Local Language Models with LM Studio:</strong> The system
				integrates{" "}
				<a
					href="https://lmstudio.ai/"
					target="_blank"
					rel="noopener noreferrer"
				>
					LM Studio
				</a>{" "}
				to run smaller, local Language Learning Models (LLMs). These models are
				adept at generating responses based on textual context, significantly
				reducing instances of hallucination and enhancing generation quality.
				Providing rich, relevant context to these models is key to achieving
				accurate and meaningful outputs.
			</p>
			<p>
				<strong>Frontend Technology:</strong> The user interface of this system
				is built using React, a popular JavaScript library for building user
				interfaces. React's component-based architecture allows for a modular,
				efficient, and easy-to-maintain frontend. This approach ensures a
				responsive and dynamic user experience.
			</p>
			<p>
				<strong>Context-Driven Responses:</strong> A major strength of this
				system is its ability to provide context-driven responses. By supplying
				smaller LLMs with targeted, relevant context, the system significantly
				improves the accuracy and relevance of the generated content, reducing
				the likelihood of erroneous or misleading information.
			</p>
			<p>
				This blend of technologies, from the React-based frontend to the
				sophisticated backend leveraging Marqo and LM Studio, creates a robust
				platform capable of handling complex queries with high precision and
				reliability.
			</p>
			{/* Add more content as needed */}
		</div>
	);
};

export default About;
