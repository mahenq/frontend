// File: src/pages/Submit.jsx
import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet";
import axios from "axios";

import NavBar from "../components/common/navBar";
import Footer from "../components/common/footer";
import Logo from "../components/common/logo";
import INFO from "../data/user";
import SEO from "../data/seo";

import "./styles/SubmitForm.css";

const Submit = () => {
	const [formData, setFormData] = useState({
		name: "",
		email: "",
		message: "",
	});
	const [success, setSuccess] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState("");

	useEffect(() => {
		window.scrollTo(0, 0);
	}, []);

	const currentSEO = SEO.find((item) => item.page === "submit");

	const handleChange = (e) => {
		setFormData({ ...formData, [e.target.name]: e.target.value });
		// Clear success and error messages when user starts typing
		if (success) setSuccess(false);
		if (error) setError("");
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		setIsLoading(true);
		setError("");
		setSuccess(false);

		try {
			const API_URL =
				process.env.REACT_APP_API_URL || "http://localhost:5000";
			await axios.post(`${API_URL}/api/customers`, formData);
			setSuccess(true);
			setFormData({ name: "", email: "", message: "" });
		} catch (err) {
			setError("Gagal mengirim pesan. Silakan coba lagi.");
			console.error("Gagal mengirim pesan:", err);
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<React.Fragment>
			<Helmet>
				<title>{`Submit | ${INFO.main.title}`}</title>
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
				<NavBar active="submit" />
				<div className="content-wrapper">
					<div className="submit-logo-container">
						<div className="submit-logo">
							<Logo width={46} />
						</div>
					</div>
					<div className="submit-container">
						<div className="title submit-title">
							Let's discuss your project and bring your ideas to
							life.
						</div>

						<div className="subtitle submit-subtitle">
							I'm always excited to work on new projects and
							collaborate with clients to create something
							amazing. Whether you have a clear vision or just an
							idea that needs to be developed, I'm here to help
							you turn it into reality. Please fill out the form
							below and let's start the conversation about your
							project.
						</div>

						<div className="submit-form-container">
							<form
								onSubmit={handleSubmit}
								className="submit-form"
							>
								<input
									type="text"
									name="name"
									placeholder="Nama"
									value={formData.name}
									onChange={handleChange}
									required
									disabled={isLoading}
								/>
								<input
									type="email"
									name="email"
									placeholder="Email"
									value={formData.email}
									onChange={handleChange}
									required
									disabled={isLoading}
								/>
								<textarea
									name="message"
									placeholder="Pesan"
									value={formData.message}
									onChange={handleChange}
									required
									disabled={isLoading}
									style={{ minHeight: "120px" }}
								/>
								<button type="submit" disabled={isLoading}>
									{isLoading ? "Mengirim..." : "Kirim"}
								</button>
							</form>

							{success && (
								<p className="success-message">
									Pesan berhasil dikirim!
								</p>
							)}

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

export default Submit;
