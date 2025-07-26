import { useState, useEffect } from "react";
import axios from "axios";
import NavBar from "../components/common/navBar";
import Footer from "../components/common/footer";
import Logo from "../components/common/logo";
import { Helmet } from "react-helmet";
import INFO from "../data/user";
import SEO from "../data/seo";

import "./styles/admin.css";

export default function AdminLogin() {
	const [formData, setFormData] = useState({ username: "", password: "" });
	const [error, setError] = useState("");

	useEffect(() => {
		window.scrollTo(0, 0);
	}, []);

	const currentSEO = SEO.find((item) => item.page === "login");

	const handleChange = (e) => {
		setFormData({ ...formData, [e.target.name]: e.target.value });
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			const res = await axios.post(
				"http://localhost:5000/api/admin/login",
				formData
			);
			localStorage.setItem("token", res.data.token);
			window.location.href = "/admin";
		} catch (err) {
			setError("Login gagal. Periksa username atau password.");
		}
	};

	return (
		<div className="page-content">
			<Helmet>
				<title>{`Login Admin | ${INFO.main.title}`}</title>
				<meta name="description" content={currentSEO.description} />
				<meta
					name="keywords"
					content={currentSEO.keywords.join(", ")}
				/>
			</Helmet>

			<NavBar active="login" />
			<div className="content-wrapper">
				<div className="login-logo-container">
					<div className="login-logo">
						<Logo width={46} />
					</div>
				</div>

				<div className="login-container">
					<h2 className="login-title">Login Admin</h2>
					{error && <p className="login-error">{error}</p>}
					<form onSubmit={handleSubmit} className="login-form">
						<input
							type="text"
							name="username"
							placeholder="Username"
							onChange={handleChange}
							required
						/>
						<input
							type="password"
							name="password"
							placeholder="Password"
							onChange={handleChange}
							required
						/>
						<button type="submit">Login</button>
					</form>
				</div>

				<div className="page-footer">
					<Footer />
				</div>
			</div>
		</div>
	);
}
