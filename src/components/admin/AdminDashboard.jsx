// File: src/admin/AdminDashboard.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";

import "./styles/admin.css";

const AdminDashboard = () => {
	const [customers, setCustomers] = useState([]);
	const [token] = useState(localStorage.getItem("token"));

	useEffect(() => {
		fetchCustomers();
	}, []);

	const fetchCustomers = async () => {
		try {
			const res = await axios.get("http://localhost:5000/api/customers", {
				headers: { Authorization: `Bearer ${token}` },
			});
			setCustomers(res.data);
		} catch (err) {
			console.error("Gagal fetch customer", err);
		}
	};

	const handleUpdate = async (id, status, notes) => {
		try {
			await axios.put(
				`http://localhost:5000/api/customers/${id}`,
				{ status, notes },
				{ headers: { Authorization: `Bearer ${token}` } }
			);
			fetchCustomers();
		} catch (err) {
			console.error("Gagal update", err);
		}
	};

	const handleDelete = async (id) => {
		try {
			await axios.delete(`http://localhost:5000/api/customers/${id}`, {
				headers: { Authorization: `Bearer ${token}` },
			});
			fetchCustomers();
		} catch (err) {
			console.error("Gagal delete", err);
		}
	};

	return (
		<div className="dashboard-wrapper">
			<h2 className="admin-title">Customer Messages</h2>

			<div className="admin-list">
				{customers.map((cust) => (
					<div className="admin-card" key={cust.id}>
						<div className="admin-info">
							<p>
								<strong>{cust.name}</strong> ({cust.email})
							</p>
							<p>{cust.message}</p>
						</div>

						<div className="admin-actions">
							<label>
								Status:
								<select
									defaultValue={cust.status}
									onChange={(e) =>
										(cust.status = e.target.value)
									}
								>
									<option value="baru">Baru</option>
									<option value="follow-up">Follow-up</option>
									<option value="selesai">Selesai</option>
								</select>
							</label>

							<label>
								Catatan:
								<input
									type="text"
									defaultValue={cust.notes}
									onChange={(e) =>
										(cust.notes = e.target.value)
									}
								/>
							</label>

							<div className="admin-btns">
								<button
									onClick={() =>
										handleUpdate(
											cust.id,
											cust.status,
											cust.notes
										)
									}
								>
									Update
								</button>
								<button
									onClick={() => handleDelete(cust.id)}
									className="delete"
								>
									Delete
								</button>
							</div>
						</div>
					</div>
				))}
			</div>
		</div>
	);
};

export default AdminDashboard;
