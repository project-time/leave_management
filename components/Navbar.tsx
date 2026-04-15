// src/components/Navbar.tsx
"use client";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <nav className="navbar" style={{ justifyContent: "space-between" }}>
      <div style={{ fontWeight: "bold", color: "var(--primary)", fontSize:"25px" }}>
        Leave Space
      </div>

      <div style={{ display: "flex", gap: "2rem", alignItems: "center" }}>
        {!user ? (
          <>
            <Link href="/">Home</Link>
            <Link href="/">About Us</Link>
            <Link href="/">Contact Us</Link>
            <Link href="/login">Login</Link>
            <Link href="/signup">Sign Up</Link>
          </>
        ) : (
          <>
            {user.role === "EMPLOYEE" && <Link href="/employee">Dashboard</Link>}
            {user.role === "MANAGER" && <Link href="/manager">Approvals</Link>}
            {user.role === "ADMIN" && <span style={{ color: "var(--text-muted)" }}>Admin View</span>}
            
            <div style={{ display: "flex", alignItems: "center", gap: "1rem", borderLeft: "1px solid var(--border)", paddingLeft: "1rem" }}>
              <span style={{ fontSize: "0.9rem", color: "var(--text-muted)" }}>
                Hi, {user.name} <span className="badge badge-pending" style={{ marginLeft: "0.5rem" }}>{user.role}</span>
              </span>
              <button onClick={logout} className="btn btn-danger" style={{ padding: "0.3rem 0.6rem" }}>Logout</button>
            </div>
          </>
        )}
      </div>
    </nav>
  );
}