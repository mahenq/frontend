// File: src/pages/AdminLogin.jsx
import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import NavBar from "../components/common/navBar";
import Footer from "../components/common/footer";
import Logo from "../components/common/logo";
import INFO from "../data/user";
import SEO from "../data/seo";

import "./styles/adminLogin.css";

const AdminLogin = () => {
	const [formData, setFormData] = useState({ username: "", password: "" });
	const [error, setError] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const navigate = useNavigate();

	useEffect(() => {
		window.scrollTo(0, 0);
	}, []);

	const currentSEO = SEO.find((item) => item.page === "login");

	const handleChange = (e) => {
		setFormData({ ...formData, [e.target.name]: e.target.value });
		// Clear error message when user starts typing
		if (error) setError("");
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		setIsLoading(true);
		setError("");

		try {
			const API_URL =
				process.env.REACT_APP_API_URL || "http://localhost:5000";
			const res = await axios.post(
				`${API_URL}/api/admin/login`,
				formData
			);
			localStorage.setItem("token", res.data.token);
			navigate("/admin");
		} catch (err) {
			setError("Login gagal. Periksa email atau password.");
			console.error("Login error:", err);
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<React.Fragment>
			<Helmet>
				<title>{`Login | ${INFO.main.title}`}</title>
				<meta
					name="description"
					content={currentSEO?.description || ""}
				/>
				<meta
					name="keywords"
					content={currentSEO?.keywords?.join(", ") || ""}
				/>
			</Helmet>

			<div className="page-content">
				<NavBar active="login" />
				<div className="content-wrapper">
					<div className="adminlogin-logo-container">
						<div className="adminlogin-logo">
							<Logo width={46} />
						</div>
					</div>
					<div className="adminlogin-container">
						<div className="title adminlogin-title">
							Admin Login
						</div>

						<div className="subtitle adminlogin-subtitle">
							Access the admin dashboard to manage your content,
							projects, and site settings. Please enter your
							credentials to continue.
						</div>

						<div className="adminlogin-form-container">
							<form
								onSubmit={handleSubmit}
								className="adminlogin-form"
							>
								<input
									type="text"
									name="email"
									placeholder="Email"
									value={formData.email}
									onChange={handleChange}
									required
									disabled={isLoading}
								/>
								<input
									type="password"
									name="password"
									placeholder="Password"
									value={formData.password}
									onChange={handleChange}
									required
									disabled={isLoading}
								/>
								<button type="submit" disabled={isLoading}>
									{isLoading ? "Logging in..." : "Login"}
								</button>
							</form>

							{error && <p className="error-message">{error}</p>}
						</div>
					</div>
					<div className="page-footer">
						<Footer />
					</div>
				</div>
			</div>
		</React.Fragment>
	);
};

export default AdminLogin;
