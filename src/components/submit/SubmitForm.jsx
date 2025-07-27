import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet";
import axios from "axios";

import NavBar from "../components/common/navBar";
import Footer from "../components/common/footer";
import Logo from "../components/common/logo";
import INFO from "../data/user";
import SEO from "../data/seo";

import "./styles/SubmitForm.css";

const SubmitForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const currentSEO = SEO.find((item) => item.page === "submit");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (success) setSuccess(false);
    if (error) setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setSuccess(false);

    try {
      const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";
      await axios.post(`${API_URL}/api/customers`, formData);

      setSuccess(true);
      setFormData({ name: "", email: "", message: "" });

      setTimeout(() => {
        setSuccess(false);
      }, 3000);
    } catch (err) {
      console.error("Gagal mengirim pesan:", err);
      setError("Gagal mengirim pesan. Silakan coba lagi.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <React.Fragment>
      <Helmet>
        <title>{`Submit | ${INFO.main.title}`}</title>
        <meta name="description" content={currentSEO?.description || ""} />
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
            <div className="submit-main">
              <div className="submit-right-side">
                <div className="title submit-title">Diskusikan Proyek Anda</div>

                <div className="subtitle submit-subtitle">
                  Silakan isi formulir di bawah ini. Saya akan menghubungi Anda
                  secepat mungkin.
                </div>

                <form className="submit-form" onSubmit={handleSubmit}>
                  <input
                    type="text"
                    name="name"
                    placeholder="Nama Anda"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    disabled={isLoading}
                  />

                  <input
                    type="email"
                    name="email"
                    placeholder="Email Anda"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    disabled={isLoading}
                  />

                  <textarea
                    name="message"
                    placeholder="Pesan Anda"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    disabled={isLoading}
                  ></textarea>

                  <button type="submit" disabled={isLoading}>
                    {isLoading ? "Mengirim..." : "Kirim Pesan"}
                  </button>

                  {success && (
                    <p className="success-message">Pesan berhasil dikirim!</p>
                  )}

                  {error && (
                    <p
                      className="error-message"
                      style={{ color: "red", marginTop: "10px" }}
                    >
                      {error}
                    </p>
                  )}
                </form>
              </div>

              <div className="submit-left-side">
                <div className="submit-image-container">
                  <div className="submit-image-wrapper"></div>
                </div>
              </div>
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

export default SubmitForm;
