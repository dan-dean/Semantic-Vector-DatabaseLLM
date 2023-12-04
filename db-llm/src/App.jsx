import { useState } from "react";
import "./App.css";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Query from "./Query.jsx";
import About from "./About.jsx";

const App = () => {
	return (
		<Router>
			<nav>
				<ul>
					<li>
						<Link to="/">Query</Link>
					</li>
					<li>
						<Link to="/about">About</Link>
					</li>
				</ul>
			</nav>
			<Routes>
				<Route path="/" element={<Query />} />
				<Route path="/about" element={<About />} />
			</Routes>
		</Router>
	);
};

export default App;
