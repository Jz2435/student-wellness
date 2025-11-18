import React, { useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { FormInput } from "../../components/FormInput";

export default function AdminLogin() {
  const router = useRouter();
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
      // Use admin-specific login API
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Login failed");
      if (!data.token || !data.user) throw new Error("Invalid login response");

      // Store admin credentials
      localStorage.setItem("adminToken", data.token);
      localStorage.setItem("adminUser", JSON.stringify(data.user));
      setSuccess(true);

      // Redirect to admin dashboard
      setTimeout(() => {
        router.push("/admin/dashboard");
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
        background:
          "linear-gradient(135deg, #7c3aed 0%, #a855f7 50%, #581c87 100%)",
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
        <div style={{ marginBottom: "40px", position: "relative" }}>
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
            Administrator Login
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
            Access the administrative dashboard to manage student wellness data
            and system settings.
          </p>

          {/* Back to Student Login */}
          <Link href="/" legacyBehavior>
            <a
              style={{
                position: "absolute",
                top: 0,
                right: 0,
                padding: "8px 16px",
                fontSize: "12px",
                fontWeight: 600,
                color: "#6b7280",
                backgroundColor: "transparent",
                border: "1px solid #d1d5db",
                borderRadius: "6px",
                textDecoration: "none",
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
              Student Login
            </a>
          </Link>
        </div>

        {/* Form Section */}
        <form onSubmit={handleSignIn} style={{ width: "100%" }}>
          <FormInput
            label="Admin Email Address"
            type="email"
            value={email}
            onChange={setEmail}
            placeholder="admin@university.edu"
            error={fieldErrors.email}
            required
            accentColor="#7c3aed"
            autoComplete="email"
          />

          <FormInput
            label="Password"
            type="password"
            value={password}
            onChange={setPassword}
            placeholder="Enter admin password"
            error={fieldErrors.password}
            required
            showPasswordToggle
            accentColor="#7c3aed"
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
              href="/admin/forgot-password"
              style={{
                fontSize: "13px",
                color: "#6b7280",
                textDecoration: "none",
                fontWeight: 500,
                transition: "color 0.2s ease",
              }}
              onMouseOver={(e) => (e.currentTarget.style.color = "#7c3aed")}
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
                ? "#7c3aed"
                : loading
                ? "#9ca3af"
                : "#7c3aed",
              border: "none",
              borderRadius: "10px",
              cursor: loading || success ? "not-allowed" : "pointer",
              transition: "all 0.25s ease",
              boxShadow:
                loading || success
                  ? "none"
                  : "0 6px 16px rgba(124, 58, 237, 0.3)",
              marginBottom: "0px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
            }}
            onMouseOver={(e) => {
              if (!loading && !success) {
                e.currentTarget.style.backgroundColor = "#6d28d9";
                e.currentTarget.style.transform = "translateY(-1px)";
                e.currentTarget.style.boxShadow =
                  "0 8px 20px rgba(124,58,237,0.35)";
              }
            }}
            onMouseOut={(e) => {
              if (!loading && !success) {
                e.currentTarget.style.backgroundColor = "#7c3aed";
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow =
                  "0 6px 16px rgba(124, 58, 237, 0.3)";
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
              "Admin Sign In"
            )}
          </button>

          <a
            href="/admin/signup"
            aria-label="Create a new admin account"
            style={{
              fontSize: "13px",
              fontWeight: 400,
              color: "#808080",
              textAlign: "center",
              margin: "10px 0 0 0",
              letterSpacing: "normal",
              textDecoration: "none",
              cursor: "pointer",
            }}
            onMouseOver={(e) =>
              (e.currentTarget.style.textDecoration = "underline")
            }
            onMouseOut={(e) => (e.currentTarget.style.textDecoration = "none")}
            onFocus={(e) =>
              (e.currentTarget.style.outline = "2px solid #7c3aed")
            }
            onBlur={(e) => (e.currentTarget.style.outline = "none")}
            onMouseDown={(e) => (e.currentTarget.style.opacity = "0.8")}
            onMouseUp={(e) => (e.currentTarget.style.opacity = "1")}
          >
            Create account
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

        {/* Footer */}
        <div
          style={{
            marginTop: "28px",
            paddingTop: "28px",
            borderTop: "1px solid #e5e7eb",
          }}
        >
          <p
            style={{
              fontSize: "14px",
              color: "#6b7280",
              margin: 0,
              lineHeight: "1.5",
            }}
          >
            Administrative access for managing student wellness systems and
            data.
          </p>
        </div>
      </div>
    </div>
  );
}
