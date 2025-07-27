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
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const currentSEO = SEO.find((item) => item.page === "login");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      console.log("Attempting login with:", {
        email: formData.email,
        password: "***hidden***",
      });
      console.log("API URL:", process.env.REACT_APP_API_URL);

      const res = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/admins/login`,
        formData
      );

      console.log("Login successful:", res.data);
      localStorage.setItem("token", res.data.token);
      window.location.href = "/admin";
    } catch (err) {
      console.error("Login error details:", {
        status: err.response?.status,
        data: err.response?.data,
        message: err.message,
      });

      // More specific error messages
      if (err.response?.status === 401) {
        setError("Username atau password salah.");
      } else if (err.response?.status === 500) {
        setError("Server error. Coba lagi nanti.");
      } else if (err.response?.data?.error) {
        setError(err.response.data.error);
      } else {
        setError("Login gagal. Periksa email atau password.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="page-content">
      <Helmet>
        <title>{`Login Admin | ${INFO.main.title}`}</title>
        <meta name="description" content={currentSEO.description} />
        <meta name="keywords" content={currentSEO.keywords.join(", ")} />
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
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              required
              disabled={isLoading}
            />
            <input
              type="text"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
              disabled={isLoading}
            />
            <button type="submit" disabled={isLoading}>
              {isLoading ? "Loading..." : "Login"}
            </button>
          </form>
        </div>

        <div className="page-footer">
          <Footer />
        </div>
      </div>
    </div>
  );
}
