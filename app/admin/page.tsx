"use client";

import { useLeaves } from "@/context/LeaveContext";
import { useAuth } from "@/context/AuthContext";
import StatCard from "@/components/StatCard";
import { useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";

export default function AdminPage() {
  const { leaves, updateStatus } = useLeaves();
  const { user } = useAuth();
  const router = useRouter();

  
  useEffect(() => {
    if (!user) {
      router.push("/login");
    } else if (user.role !== "ADMIN") {
      router.push("/login"); 
    }
  }, [user, router]);

  
  if (!user || user.role !== "ADMIN") return null;

  // Calculate stats for all leaves
  const stats = useMemo(() => {
    const approvedLeaves = leaves.filter(l => l.status === "Approved");
    const pendingLeaves = leaves.filter(l => l.status === "Pending");
    const rejectedLeaves = leaves.filter(l => l.status === "Rejected");

    return {
      totalApproved: approvedLeaves.length,
      totalPending: pendingLeaves.length,
      totalRejected: rejectedLeaves.length,
    };
  }, [leaves]);

  return (
    <div>
      <h1 style={{ marginBottom: "2rem" }}>Admin Dashboard</h1>

      <div className="grid-3">
        <StatCard title="Approved Leaves" used={stats.totalApproved} total={leaves.length} colorHex="var(--success)" />
        <StatCard title="Pending Leaves" used={stats.totalPending} total={leaves.length} colorHex="var(--primary)" />
        <StatCard title="Rejected Leaves" used={stats.totalRejected} total={leaves.length} colorHex="var(--danger)" />
      </div>

      <div className="card">
        <h2>Leave Approval Inbox</h2>
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Employee</th>
                <th>Leave Type</th>
                <th>Dates</th>
                <th>Reason</th>
                <th>Actions / Status</th>
              </tr>
            </thead>
            <tbody>
              {leaves.map((l) => (
                <tr key={l.id}>
                  <td><strong>{l.employee}</strong></td>
                  <td>{l.type}</td>
                  <td>{l.startDate} - {l.endDate}</td>
                  <td style={{ color: "var(--text-muted)" }}>{l.reason}</td>
                  <td>
                    {l.status === "Pending" ? (
                      <div style={{ display: "flex", gap: "0.5rem" }}>
                        <button
                          onClick={() => updateStatus(l.id, "Approved")}
                          className="btn btn-success"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => updateStatus(l.id, "Rejected")}
                          className="btn btn-danger"
                        >
                          Reject
                        </button>
                      </div>
                    ) : (
                      <span className={`badge badge-${l.status.toLowerCase()}`}>
                        {l.status}
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}