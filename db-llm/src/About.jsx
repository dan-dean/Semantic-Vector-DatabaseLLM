const About = () => {
	return (
		<div>
			<h1>About This Project</h1>
			<p>
				I've loaded the entire text of the Book of Mormon into a vector database
				so that users may ask questions directly to the text. The problem meant
				to be solved here is the large context size of the text, which would
				require enormous amounts of RAM to load into any model even capable of
				supporting it, which most cannot. I leverage a vector database that is
				able to understand semantic meaning and relevancy between documents,
				where I can query into the database and retrieve relevant context to
				help answer a user's query. This smaller context can then be baked into
				a prompt to a small and efficient LLM, allowing us to get relevant and
				concise responses to queries. The website component provides a
				front-facing UI for query submission and response delivery, while a
				Flask python server coordinates the API calls to the local Marqo
				instance and the LLM Studio instance.
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
				accurate and meaningful outputs. Clever prompting is also utilized to
				set up the LLM to respond spiritually and accurately.
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
			<ul>
				<li>
					<a
						href="https://github.com/marqo-ai/marqo"
						target="_blank"
						rel="noopener noreferrer"
					>
						Marqo on GitHub
					</a>
				</li>
				<li>
					<a
						href="https://github.com/lmstudio-ai"
						target="_blank"
						rel="noopener noreferrer"
					>
						LM Studio on GitHub
					</a>
				</li>
			</ul>
		</div>
	);
};

export default About;
