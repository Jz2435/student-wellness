import React, { useState } from "react";
import { useRouter } from "next/router";
import { useAuth } from "../hooks/useAuth";
import { FormInput } from "../components/FormInput";

export default function Home() {
  const router = useRouter();
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<{ [key: string]: string }>({});
  const [success, setSuccess] = useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const validateForm = () => {
    const errors: { [key: string]: string } = {};

    if (!email || email.indexOf("@") === -1) {
      errors.email = "Please enter a valid email address";
    }

    if (!password) {
      errors.password = "Please enter your password";
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSignIn = async (e?: React.FormEvent) => {
    e?.preventDefault();
    setError(null);
    setFieldErrors({});

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Login failed");
      if (!data.token || !data.user) throw new Error("Invalid login response");

      // Login and show success message
      login(data.token, data.user);
      setSuccess(true);

      // Use setTimeout to ensure localStorage is updated before redirect
      setTimeout(() => {
        router.push("/dashboard");
      }, 100);
    } catch (e: any) {
      setError(e?.message || "Login failed");
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#f9fafb",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "32px",
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      }}
    >
      <style jsx>{`
        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
      <div
        style={{
          width: "100%",
          maxWidth: "1200px",
          display: "flex",
          gap: "60px",
          alignItems: "center",
          backgroundColor: "#ffffff",
          padding: "48px",
          borderRadius: "16px",
          border: "2px solid #e5e7eb",
          boxShadow: "0 10px 30px rgba(0, 0, 0, 0.08)",
        }}
      >
        {/* Left Section - Introduction */}
        <div
          style={{
            flex: 1,
            textAlign: "left",
          }}
        >
          <div
            style={{
              width: "72px",
              height: "72px",
              backgroundColor: "#10b981",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: "20px",
              boxShadow: "0 6px 14px rgba(16, 185, 129, 0.4)",
            }}
          >
            <span style={{ fontSize: "32px", color: "white" }}>🌿</span>
          </div>
          <h1
            style={{
              fontSize: "36px",
              fontWeight: 700,
              color: "#1f2937",
              margin: "0 0 16px 0",
              letterSpacing: "-0.5px",
            }}
          >
            Welcome Back
          </h1>

          <h2
            style={{
              fontSize: "20px",
              fontWeight: 600,
              color: "#1f2937",
              margin: "0 0 16px 0",
            }}
          >
            Student Wellness & Stress Intelligence Platform
          </h2>
          <p
            style={{
              fontSize: "15px",
              color: "#6b7280",
              margin: "0 0 12px 0",
              lineHeight: "1.7",
            }}
          >
            Powered by daily self-reported data to deliver wellness trends, AI
            insights, and high-risk alerts for campus health professionals.
          </p>
          <p
            style={{
              fontSize: "15px",
              color: "#6b7280",
              margin: 0,
              lineHeight: "1.7",
            }}
          >
            Our platform helps you track your stress levels, mood patterns, and
            sleep quality while providing actionable insights to improve your
            overall wellbeing and academic success.
          </p>
        </div>

        {/* Right Section - Form */}
        <div
          style={{
            flex: 1,
            maxWidth: "480px",
          }}
        >
          {/* Administrator Login Button */}
          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              marginBottom: "20px",
            }}
          >
            <button
              onClick={() => router.push("/admin/login")}
              style={{
                padding: "8px 16px",
                fontSize: "12px",
                fontWeight: 600,
                color: "#6b7280",
                backgroundColor: "transparent",
                border: "1px solid #d1d5db",
                borderRadius: "6px",
                cursor: "pointer",
                transition: "all 0.2s ease",
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.backgroundColor = "#f9fafb";
                e.currentTarget.style.borderColor = "#9ca3af";
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.backgroundColor = "transparent";
                e.currentTarget.style.borderColor = "#d1d5db";
              }}
            >
              Admin Login
            </button>
          </div>

          <form onSubmit={handleSignIn} style={{ width: "100%" }}>
            <FormInput
              label="Email Address"
              type="email"
              value={email}
              onChange={setEmail}
              placeholder="you@university.edu"
              error={fieldErrors.email}
              required
              accentColor="#10b981"
              autoComplete="email"
            />

            <FormInput
              label="Password"
              type="password"
              value={password}
              onChange={setPassword}
              placeholder="Enter your password"
              error={fieldErrors.password}
              required
              showPasswordToggle
              accentColor="#10b981"
              autoComplete="current-password"
            />

            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                marginBottom: "24px",
                marginTop: "-12px",
              }}
            >
              <a
                href="/forgot-password"
                style={{
                  fontSize: "13px",
                  color: "#6b7280",
                  textDecoration: "none",
                  fontWeight: 500,
                  transition: "color 0.2s ease",
                }}
                onMouseOver={(e) => (e.currentTarget.style.color = "#10b981")}
                onMouseOut={(e) => (e.currentTarget.style.color = "#6b7280")}
              >
                Forgot password?
              </a>
            </div>

            <button
              type="submit"
              disabled={loading || success}
              style={{
                width: "100%",
                padding: "14px 0",
                fontSize: "16px",
                fontWeight: 600,
                color: "white",
                backgroundColor: success
                  ? "#10b981"
                  : loading
                  ? "#9ca3af"
                  : "#10b981",
                border: "none",
                borderRadius: "10px",
                cursor: loading || success ? "not-allowed" : "pointer",
                transition: "all 0.25s ease",
                boxShadow:
                  loading || success
                    ? "none"
                    : "0 6px 16px rgba(16, 185, 129, 0.3)",
                marginBottom: "0px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
              }}
              onMouseOver={(e) => {
                if (!loading && !success) {
                  e.currentTarget.style.backgroundColor = "#059669";
                  e.currentTarget.style.transform = "translateY(-1px)";
                  e.currentTarget.style.boxShadow =
                    "0 8px 20px rgba(16,185,129,0.35)";
                }
              }}
              onMouseOut={(e) => {
                if (!loading && !success) {
                  e.currentTarget.style.backgroundColor = "#10b981";
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow =
                    "0 6px 16px rgba(16, 185, 129, 0.3)";
                }
              }}
              aria-live="polite"
            >
              {success ? (
                <>
                  <span>✓</span> Success! Redirecting...
                </>
              ) : loading ? (
                <>
                  <span
                    style={{
                      display: "inline-block",
                      width: "16px",
                      height: "16px",
                      border: "2px solid rgba(255,255,255,0.3)",
                      borderTopColor: "white",
                      borderRadius: "50%",
                      animation: "spin 0.8s linear infinite",
                    }}
                  />
                  Signing In...
                </>
              ) : (
                "Sign In"
              )}
            </button>

            <a
              href="/signup"
              aria-label="Create a new student account"
              style={{
                fontSize: "13px",
                fontWeight: 400,
                color: "#808080",
                textAlign: "center",
                margin: "10px 0 0 0",
                letterSpacing: "normal",
                textDecoration: "none",
                cursor: "pointer",
                display: "block",
              }}
              onMouseOver={(e) =>
                (e.currentTarget.style.textDecoration = "underline")
              }
              onMouseOut={(e) =>
                (e.currentTarget.style.textDecoration = "none")
              }
              onFocus={(e) =>
                (e.currentTarget.style.outline = "2px solid #10b981")
              }
              onBlur={(e) => (e.currentTarget.style.outline = "none")}
              onMouseDown={(e) => (e.currentTarget.style.opacity = "0.8")}
              onMouseUp={(e) => (e.currentTarget.style.opacity = "1")}
            >
              Create account
            </a>

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
          </form>
        </div>
      </div>
    </div>
  );
}
