import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import Logo from "../components/common/logo";
import INFO from "../data/user";
import SEO from "../data/seo";

import "./styles/adminDashboard.css";

const AdminDashboard = () => {
	const [customers, setCustomers] = useState([]);
	const [token, setToken] = useState(localStorage.getItem("token"));
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState("");
	const [editingCustomer, setEditingCustomer] = useState({});
	const navigate = useNavigate();

	useEffect(() => {
		// Check if user is authenticated
		if (!token) {
			navigate("/admin/login");
			return;
		}
		fetchCustomers();
	}, [token, navigate]);

	const currentSEO = SEO.find((item) => item.page === "admin") || {};

	const fetchCustomers = async () => {
		try {
			setIsLoading(true);
			const API_URL =
				process.env.REACT_APP_API_URL || "http://localhost:5000";
			const res = await axios.get(`${API_URL}/api/customers`, {
				headers: { Authorization: `Bearer ${token}` },
			});
			setCustomers(res.data);
			setError("");
		} catch (err) {
			console.error("Gagal fetch customer", err);
			setError("Gagal memuat data pelanggan");
			// If unauthorized, redirect to login
			if (err.response?.status === 401) {
				localStorage.removeItem("token");
				navigate("/admin/login");
			}
		} finally {
			setIsLoading(false);
		}
	};

	const handleInputChange = (id, field, value) => {
		setEditingCustomer((prev) => ({
			...prev,
			[id]: {
				...prev[id],
				[field]: value,
			},
		}));
	};

	const handleUpdate = async (id) => {
		try {
			const updates = editingCustomer[id];
			if (!updates) return;

			const API_URL =
				process.env.REACT_APP_API_URL || "http://localhost:5000";
			await axios.put(
				`${API_URL}/api/customers/${id}`,
				{
					status:
						updates.status ||
						customers.find((c) => c.id === id)?.status,
					notes:
						updates.notes ||
						customers.find((c) => c.id === id)?.notes,
				},
				{ headers: { Authorization: `Bearer ${token}` } }
			);

			// Clear editing state for this customer
			setEditingCustomer((prev) => {
				const newState = { ...prev };
				delete newState[id];
				return newState;
			});

			fetchCustomers();
		} catch (err) {
			console.error("Gagal update", err);
			setError("Gagal mengupdate data");
		}
	};

	const handleDelete = async (id) => {
		if (!window.confirm("Apakah Anda yakin ingin menghapus pesan ini?")) {
			return;
		}

		try {
			const API_URL =
				process.env.REACT_APP_API_URL || "http://localhost:5000";
			await axios.delete(`${API_URL}/api/customers/${id}`, {
				headers: { Authorization: `Bearer ${token}` },
			});
			fetchCustomers();
		} catch (err) {
			console.error("Gagal delete", err);
			setError("Gagal menghapus data");
		}
	};

	const handleLogout = () => {
		localStorage.removeItem("token");
		navigate("/admin/login");
	};

	if (isLoading) {
		return (
			<div className="page-content">
				<div className="content-wrapper">
					<div className="admin-loading">Loading...</div>
				</div>
			</div>
		);
	}

	return (
		<React.Fragment>
			<Helmet>
				<title>{`Admin Dashboard | ${INFO.main.title}`}</title>
				<meta
					name="description"
					content={currentSEO?.description || "Admin Dashboard"}
				/>
				<meta
					name="keywords"
					content={currentSEO?.keywords?.join(", ") || ""}
				/>
			</Helmet>

			<div className="page-content">
				<div className="content-wrapper">
					<div className="admin-logo-container">
						<div className="admin-logo">
							<Logo width={46} />
						</div>
					</div>
					<div className="admin-container">
						<div className="admin-header">
							<div className="title admin-title">
								Admin Dashboard
							</div>
							<div className="subtitle admin-subtitle">
								Kelola pesan dari pengunjung website Anda. Anda
								dapat mengubah status, menambahkan catatan, dan
								menghapus pesan yang tidak diperlukan.
							</div>
							<button
								className="logout-button"
								onClick={handleLogout}
							>
								Logout
							</button>
						</div>

						{error && (
							<div className="error-message admin-error">
								{error}
							</div>
						)}

						<div className="admin-stats">
							<div className="stat-item">
								<span className="stat-number">
									{customers.length}
								</span>
								<span className="stat-label">Total Pesan</span>
							</div>
							<div className="stat-item">
								<span className="stat-number">
									{
										customers.filter(
											(c) => c.status === "baru"
										).length
									}
								</span>
								<span className="stat-label">Pesan Baru</span>
							</div>
							<div className="stat-item">
								<span className="stat-number">
									{
										customers.filter(
											(c) => c.status === "selesai"
										).length
									}
								</span>
								<span className="stat-label">Selesai</span>
							</div>
						</div>

						<div className="admin-table">
							{customers.length === 0 ? (
								<div className="no-data">
									Tidak ada pesan dari pengunjung.
								</div>
							) : (
								customers.map((cust) => (
									<div className="admin-card" key={cust.id}>
										<div className="admin-info">
											<div className="customer-header">
												<h3>{cust.name}</h3>
												<span
													className={`status-badge ${cust.status}`}
												>
													{cust.status}
												</span>
											</div>
											<p className="customer-email">
												{cust.email}
											</p>
											<p className="customer-message">
												{cust.message}
											</p>
											<p className="timestamp">
												{new Date(
													cust.created_at
												).toLocaleString("id-ID")}
											</p>
											{cust.notes && (
												<p className="customer-notes">
													<strong>Catatan:</strong>{" "}
													{cust.notes}
												</p>
											)}
										</div>

										<div className="admin-form">
											<label>
												Status:
												<select
													value={
														editingCustomer[cust.id]
															?.status ||
														cust.status
													}
													onChange={(e) =>
														handleInputChange(
															cust.id,
															"status",
															e.target.value
														)
													}
												>
													<option value="baru">
														Baru
													</option>
													<option value="follow-up">
														Follow-up
													</option>
													<option value="selesai">
														Selesai
													</option>
												</select>
											</label>

											<label>
												Catatan:
												<textarea
													value={
														editingCustomer[cust.id]
															?.notes ||
														cust.notes ||
														""
													}
													onChange={(e) =>
														handleInputChange(
															cust.id,
															"notes",
															e.target.value
														)
													}
													placeholder="Tambahkan catatan..."
													rows="3"
												/>
											</label>

											<div className="admin-buttons">
												<button
													onClick={() =>
														handleUpdate(cust.id)
													}
													className="update-button"
												>
													Update
												</button>
												<button
													onClick={() =>
														handleDelete(cust.id)
													}
													className="delete-button"
												>
													Hapus
												</button>
											</div>
										</div>
									</div>
								))
							)}
						</div>
					</div>
				</div>
			</div>
		</React.Fragment>
	);
};

export default AdminDashboard;
