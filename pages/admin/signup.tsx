import React, { useState } from "react";
import { useRouter } from "next/router";

export default function AdminSignup() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<{ [key: string]: string }>({});

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [consent, setConsent] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const validateForm = () => {
    const errors: { [key: string]: string } = {};

    if (!fullName.trim()) {
      errors.fullName = "Full name is required";
    }

    if (!email || email.indexOf("@") === -1) {
      errors.email = "Please enter a valid email address";
    }

    if (!password) {
      errors.password = "Password is required";
    } else if (
      password.length < 8 ||
      !/[a-zA-Z]/.test(password) ||
      !/\d/.test(password)
    ) {
      errors.password =
        "Password must be at least 8 characters with 1 letter and 1 number";
    }

    if (password !== confirmPassword) {
      errors.confirmPassword = "Passwords do not match";
    }

    if (!consent) {
      errors.consent = "You must agree to the terms";
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setFieldErrors({});

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/admin/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: fullName,
          email,
          password,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Signup failed");
      if (!data.token || !data.user) throw new Error("Invalid signup response");

      // Store admin token and redirect to admin dashboard
      localStorage.setItem("adminToken", data.token);
      localStorage.setItem("adminUser", JSON.stringify(data.user));

      // Use setTimeout to ensure localStorage is updated before redirect
      setTimeout(() => {
        router.push("/admin/dashboard");
      }, 100);
    } catch (e: any) {
      setError(e?.message || "Signup failed");
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background:
          "linear-gradient(135deg, #8b5cf6 0%, #7c3aed 50%, #5b21b6 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "32px",
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      }}
    >
      <div
        style={{
          backgroundColor: "white",
          borderRadius: "20px",
          boxShadow: "0 12px 40px rgba(0, 0, 0, 0.12)",
          padding: "56px 48px",
          width: "100%",
          maxWidth: "420px",
          textAlign: "center",
        }}
      >
        {/* Header Section */}
        <div style={{ marginBottom: "40px" }}>
          <div
            style={{
              width: "72px",
              height: "72px",
              backgroundColor: "#7c3aed",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 20px",
              boxShadow: "0 6px 14px rgba(124, 58, 237, 0.4)",
            }}
          >
            <span style={{ fontSize: "32px", color: "white" }}>⚙️</span>
          </div>
          <h1
            style={{
              fontSize: "30px",
              fontWeight: 700,
              color: "#1f2937",
              margin: "0 0 10px 0",
              letterSpacing: "-0.5px",
            }}
          >
            Create admin account
          </h1>
          <p
            style={{
              fontSize: "15px",
              color: "#6b7280",
              margin: 0,
              lineHeight: "1.6",
              maxWidth: "320px",
              marginInline: "auto",
            }}
          >
            Administrative access for managing student wellness systems.
          </p>
        </div>

        {/* Form Section */}
        <form onSubmit={handleSignup} style={{ width: "100%" }}>
          <div style={{ marginBottom: "28px" }}>
            <label
              style={{
                display: "block",
                fontSize: "14px",
                fontWeight: 600,
                color: "#374151",
                marginBottom: "10px",
                textAlign: "left",
              }}
            >
              Full Name
            </label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Your full name"
              style={{
                width: "100%",
                padding: "14px 16px",
                fontSize: "15px",
                border: `2px solid ${
                  fieldErrors.fullName ? "#dc2626" : "#e5e7eb"
                }`,
                borderRadius: "10px",
                outline: "none",
                transition: "border-color 0.2s ease, box-shadow 0.2s ease",
                boxSizing: "border-box",
              }}
              onFocus={(e) => {
                e.target.style.borderColor = "#7c3aed";
                e.target.style.boxShadow = "0 0 0 2px rgba(124,58,237,0.2)";
              }}
              onBlur={(e) => {
                e.target.style.borderColor = fieldErrors.fullName
                  ? "#dc2626"
                  : "#e5e7eb";
                e.target.style.boxShadow = "none";
              }}
              required
              aria-describedby={
                fieldErrors.fullName ? "fullName-error" : undefined
              }
            />
            {fieldErrors.fullName && (
              <p
                id="fullName-error"
                style={{
                  fontSize: "12px",
                  color: "#dc2626",
                  margin: "4px 0 0 0",
                  textAlign: "left",
                }}
              >
                {fieldErrors.fullName}
              </p>
            )}
          </div>

          <div style={{ marginBottom: "28px" }}>
            <label
              style={{
                display: "block",
                fontSize: "14px",
                fontWeight: 600,
                color: "#374151",
                marginBottom: "10px",
                textAlign: "left",
              }}
            >
              Admin Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@university.edu"
              style={{
                width: "100%",
                padding: "14px 16px",
                fontSize: "15px",
                border: `2px solid ${
                  fieldErrors.email ? "#dc2626" : "#e5e7eb"
                }`,
                borderRadius: "10px",
                outline: "none",
                transition: "border-color 0.2s ease, box-shadow 0.2s ease",
                boxSizing: "border-box",
              }}
              onFocus={(e) => {
                e.target.style.borderColor = "#7c3aed";
                e.target.style.boxShadow = "0 0 0 2px rgba(124,58,237,0.2)";
              }}
              onBlur={(e) => {
                e.target.style.borderColor = fieldErrors.email
                  ? "#dc2626"
                  : "#e5e7eb";
                e.target.style.boxShadow = "none";
              }}
              required
              aria-describedby={fieldErrors.email ? "email-error" : undefined}
            />
            {fieldErrors.email && (
              <p
                id="email-error"
                style={{
                  fontSize: "12px",
                  color: "#dc2626",
                  margin: "4px 0 0 0",
                  textAlign: "left",
                }}
              >
                {fieldErrors.email}
              </p>
            )}
          </div>

          <div style={{ marginBottom: "28px" }}>
            <label
              style={{
                display: "block",
                fontSize: "14px",
                fontWeight: 600,
                color: "#374151",
                marginBottom: "10px",
                textAlign: "left",
              }}
            >
              Password
            </label>
            <div style={{ position: "relative" }}>
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Create a password"
                style={{
                  width: "100%",
                  padding: "14px 16px",
                  fontSize: "15px",
                  border: `2px solid ${
                    fieldErrors.password ? "#dc2626" : "#e5e7eb"
                  }`,
                  borderRadius: "10px",
                  outline: "none",
                  transition: "border-color 0.2s ease, box-shadow 0.2s ease",
                  boxSizing: "border-box",
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = "#7c3aed";
                  e.target.style.boxShadow = "0 0 0 2px rgba(124,58,237,0.2)";
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = fieldErrors.password
                    ? "#dc2626"
                    : "#e5e7eb";
                  e.target.style.boxShadow = "none";
                }}
                required
                aria-describedby={
                  fieldErrors.password ? "password-error" : undefined
                }
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: "absolute",
                  right: "12px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  background: "none",
                  border: "none",
                  color: "#6b7280",
                  cursor: "pointer",
                  fontSize: "14px",
                }}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
            {fieldErrors.password && (
              <p
                id="password-error"
                style={{
                  fontSize: "12px",
                  color: "#dc2626",
                  margin: "4px 0 0 0",
                  textAlign: "left",
                }}
              >
                {fieldErrors.password}
              </p>
            )}
          </div>

          <div style={{ marginBottom: "28px" }}>
            <label
              style={{
                display: "block",
                fontSize: "14px",
                fontWeight: 600,
                color: "#374151",
                marginBottom: "10px",
                textAlign: "left",
              }}
            >
              Confirm Password
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm your password"
              style={{
                width: "100%",
                padding: "14px 16px",
                fontSize: "15px",
                border: `2px solid ${
                  fieldErrors.confirmPassword ? "#dc2626" : "#e5e7eb"
                }`,
                borderRadius: "10px",
                outline: "none",
                transition: "border-color 0.2s ease, box-shadow 0.2s ease",
                boxSizing: "border-box",
              }}
              onFocus={(e) => {
                e.target.style.borderColor = "#7c3aed";
                e.target.style.boxShadow = "0 0 0 2px rgba(124,58,237,0.2)";
              }}
              onBlur={(e) => {
                e.target.style.borderColor = fieldErrors.confirmPassword
                  ? "#dc2626"
                  : "#e5e7eb";
                e.target.style.boxShadow = "none";
              }}
              required
              aria-describedby={
                fieldErrors.confirmPassword
                  ? "confirmPassword-error"
                  : undefined
              }
            />
            {fieldErrors.confirmPassword && (
              <p
                id="confirmPassword-error"
                style={{
                  fontSize: "12px",
                  color: "#dc2626",
                  margin: "4px 0 0 0",
                  textAlign: "left",
                }}
              >
                {fieldErrors.confirmPassword}
              </p>
            )}
          </div>

          <div style={{ marginBottom: "36px" }}>
            <label
              style={{
                display: "flex",
                alignItems: "flex-start",
                fontSize: "14px",
                color: "#374151",
              }}
            >
              <input
                type="checkbox"
                checked={consent}
                onChange={(e) => setConsent(e.target.checked)}
                style={{ marginRight: "8px", marginTop: "2px" }}
                required
                aria-describedby={
                  fieldErrors.consent ? "consent-error" : undefined
                }
              />
              <span>
                I agree to the{" "}
                <a
                  href="/privacy"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: "#7c3aed", textDecoration: "underline" }}
                >
                  data processing and privacy policy
                </a>{" "}
                and{" "}
                <a
                  href="/terms"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: "#7c3aed", textDecoration: "underline" }}
                >
                  terms of service
                </a>
                .
              </span>
            </label>
            {fieldErrors.consent && (
              <p
                id="consent-error"
                style={{
                  fontSize: "12px",
                  color: "#dc2626",
                  margin: "4px 0 0 0",
                  textAlign: "left",
                }}
              >
                {fieldErrors.consent}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              padding: "14px 0",
              fontSize: "16px",
              fontWeight: 600,
              color: "white",
              backgroundColor: loading ? "#9ca3af" : "#7c3aed",
              border: "none",
              borderRadius: "10px",
              cursor: loading ? "not-allowed" : "pointer",
              transition: "all 0.25s ease",
              boxShadow: loading
                ? "none"
                : "0 6px 16px rgba(124, 58, 237, 0.3)",
              marginBottom: "20px",
            }}
            onMouseOver={(e) => {
              if (!loading) {
                e.currentTarget.style.backgroundColor = "#6d28d9";
                e.currentTarget.style.transform = "translateY(-1px)";
                e.currentTarget.style.boxShadow =
                  "0 8px 20px rgba(124,58,237,0.35)";
              }
            }}
            onMouseOut={(e) => {
              if (!loading) {
                e.currentTarget.style.backgroundColor = "#7c3aed";
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow =
                  "0 6px 16px rgba(124, 58, 237, 0.3)";
              }
            }}
          >
            {loading ? "Creating Account..." : "Create Admin Account"}
          </button>

          <a
            href="/admin/login"
            style={{
              fontSize: "14px",
              color: "#6b7280",
              textDecoration: "none",
              display: "inline-block",
              marginTop: "10px",
            }}
            onMouseOver={(e) =>
              (e.currentTarget.style.textDecoration = "underline")
            }
            onMouseOut={(e) => (e.currentTarget.style.textDecoration = "none")}
          >
            Back to admin sign in
          </a>
        </form>

        {/* Error Message */}
        {error && (
          <div
            style={{
              backgroundColor: "#fef2f2",
              border: "1px solid #fecaca",
              borderRadius: "10px",
              padding: "12px 16px",
              marginTop: "18px",
            }}
          >
            <p
              style={{
                fontSize: "14px",
                color: "#dc2626",
                margin: 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
              }}
            >
              ⚠️ {error}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
