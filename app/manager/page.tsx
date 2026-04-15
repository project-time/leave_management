"use client";

import { useLeaves } from "@/context/LeaveContext";
import { useAuth } from "@/context/AuthContext";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function ManagerPage() {
  const { leaves, updateStatus } = useLeaves();
  const { user } = useAuth();
  const router = useRouter();

  
  useEffect(() => {
    if (!user) {
      router.push("/login");
    } else if (user.role !== "MANAGER") {
      router.push("/login"); 
    }
  }, [user, router]);

  
  if (!user || user.role !== "MANAGER") return null;

  return (
    <div>
      <h1 style={{ marginBottom: "2rem" }}>Manager Approval Inbox</h1>

      <div className="card">
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