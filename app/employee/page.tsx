// "use client";

// import { useLeaves } from "@/context/LeaveContext";
// import { useAuth } from "@/context/AuthContext";
// import StatCard from "@/components/StatCard";
// import { useState, useEffect, useMemo } from "react";
// import { useRouter } from "next/navigation";

// export default function EmployeePage() {
//   const { leaves, addLeave } = useLeaves();
//   const { user } = useAuth();
//   const router = useRouter();
//   const today = new Date().toISOString().split("T")[0];

//   const [form, setForm] = useState({
//     type: "Vacation",
//     startDate: "",
//     endDate: "",
//     reason: "",
//   });

//   useEffect(() => {
//     if (!user || user.role !== "EMPLOYEE") {
//       router.push("/login");
//     }
//   }, [user, router]);

//   // --- Logic to calculate Used Leaves for the Progress Cards ---
//   const stats = useMemo(() => {
//     const userLeaves = leaves.filter(
//       (l) => l.employee.includes(user?.name || "") && l.status === "Approved"
//     );

//     const calculateDays = (type: string) => {
//       return userLeaves
//         .filter((l) => l.type === type)
//         .reduce((acc, curr) => {
//           const start = new Date(curr.startDate);
//           const end = new Date(curr.endDate);
//           const diffTime = Math.abs(end.getTime() - start.getTime());
//           const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
//           return acc + diffDays;
//         }, 0);
//     };

//     return {
//       vacationUsed: calculateDays("Vacation"),
//       sickUsed: calculateDays("Sick Leave"),
//       personalUsed: calculateDays("Personal"),
//     };
//   }, [leaves, user]);

//   if (!user || user.role !== "EMPLOYEE") return null;

//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault();

//     // Final validation check: End Date must be after Start Date
//     if (new Date(form.endDate) < new Date(form.startDate)) {
//       alert("End date cannot be earlier than start date!");
//       return;
//     }

//     addLeave({
//       ...form,
//       employee: `${user.name} (You)`,
//       status: "Pending", // Default status
//       id: Date.now(),    // Temporary ID generation
//     });

//     alert("Leave Request Submitted!");
//     // Reset form
//     setForm({ type: "Vacation", startDate: "", endDate: "", reason: "" });
//   };

//   return (
//     <div>
//       <h1 style={{ marginBottom: "2rem" }}>My Dashboard</h1>

//       <div className="grid-3">
//         <StatCard title="Vacation" used={stats.vacationUsed} total={20} colorHex="var(--primary)" />
//         <StatCard title="Sick Leave" used={stats.sickUsed} total={10} colorHex="var(--danger)" />
//         <StatCard title="Personal" used={stats.personalUsed} total={5} colorHex="var(--success)" />
//       </div>

//       <div className="grid-layout">
//         <div className="card">
//           <h2>Request Leave</h2>
//           <form onSubmit={handleSubmit}>
//             <div className="form-group">
//               <label>Leave Type</label>
//               <select
//                 className="form-control"
//                 value={form.type}
//                 onChange={(e) => setForm({ ...form, type: e.target.value })}
//               >
//                 <option value="Vacation">Vacation</option>
//                 <option value="Sick Leave">Sick Leave</option>
//                 <option value="Personal">Personal</option>
//               </select>
//             </div>

//             <div className="form-group">
//               <label>Start Date</label>
//               <input
//                 type="date"
//                 required
//                 min={today} // Prevents selecting past dates
//                 className="form-control"
//                 value={form.startDate}
//                 onChange={(e) => setForm({ ...form, startDate: e.target.value })}
//               />
//             </div>

//             <div className="form-group">
//               <label>End Date</label>
//               <input
//                 type="date"
//                 required
//                 min={form.startDate || today}
//                 className="form-control"
//                 value={form.endDate}
//                 onChange={(e) => setForm({ ...form, endDate: e.target.value })}
//               />
//             </div>

//             <div className="form-group">
//               <label>Reason</label>
//               <textarea
//                 required
//                 className="form-control"
//                 value={form.reason}
//                 onChange={(e) => setForm({ ...form, reason: e.target.value })}
//               />
//               <p style={{ fontSize: '0.8rem', marginTop: '10px' }}>
//                 Upload Supporting Documents (optional) - (Max 5MB - PDF only)
//               </p>
//               <input type="file" accept=".pdf" />
//             </div>

//             <button type="submit" className="btn btn-primary">
//               Submit Application
//             </button>
//           </form>
//         </div>

//         <div className="card">
//           <h2>My Leave History</h2>
//           <div className="table-wrapper">
//             <table>
//               <thead>
//                 <tr>
//                   <th>Type</th>
//                   <th>Dates</th>
//                   <th>Status</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {leaves
//                   .filter((l) => l.employee.includes(user.name))
//                   .map((l) => (
//                     <tr key={l.id}>
//                       <td>{l.type}</td>
//                       <td>{l.startDate} to {l.endDate}</td>
//                       <td>
//                         <span className={`badge badge-${l.status.toLowerCase()}`}>
//                           {l.status}
//                         </span>
//                       </td>
//                     </tr>
//                   ))}
//               </tbody>
//             </table>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

"use client";

import { useLeaves } from "@/context/LeaveContext";
import { useAuth } from "@/context/AuthContext";
import StatCard from "@/components/StatCard";
import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";

export default function EmployeePage() {
  const { leaves, addLeave } = useLeaves();
  const { user } = useAuth();
  const router = useRouter();
  const today = new Date().toISOString().split("T")[0];

  const [form, setForm] = useState({
    type: "Vacation",
    startDate: "",
    endDate: "",
    reason: "",
  });

  // --- Helper: Check if a date is a Sunday ---
  const isSunday = (dateString: string) => {
    if (!dateString) return false;
    const date = new Date(dateString);
    // getUTCDay prevents timezone shifts for YYYY-MM-DD strings
    return date.getUTCDay() === 0; 
  };

  // --- Helper: Calculate working days (excluding Sundays) ---
  const countWorkingDays = (startStr: string, endStr: string) => {
    if (!startStr || !endStr) return 0;
    let count = 0;
    const cur = new Date(startStr);
    const end = new Date(endStr);

    while (cur <= end) {
      if (cur.getUTCDay() !== 0) { // If not Sunday
        count++;
      }
      cur.setUTCDate(cur.getUTCDate() + 1);
    }
    return count;
  };

  // Handle Date Selection Change
  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>, field: "startDate" | "endDate") => {
    const value = e.target.value;
    if (isSunday(value)) {
      alert("Sundays are non-working days and cannot be selected as a start or end date.");
      setForm({ ...form, [field]: "" });
    } else {
      setForm({ ...form, [field]: value });
    }
  };

  useEffect(() => {
    if (!user || user.role !== "EMPLOYEE") {
      router.push("/login");
    }
  }, [user, router]);

  // --- Updated Stats: Subtract Sundays from used days ---
  const stats = useMemo(() => {
    const userLeaves = leaves.filter(
      (l) => l.employee.includes(user?.name || "") && l.status === "Approved"
    );

    const calculateUsedDays = (type: string) => {
      return userLeaves
        .filter((l) => l.type === type)
        .reduce((acc, curr) => {
          return acc + countWorkingDays(curr.startDate, curr.endDate);
        }, 0);
    };

    return {
      vacationUsed: calculateUsedDays("Vacation"),
      sickUsed: calculateUsedDays("Sick Leave"),
      personalUsed: calculateUsedDays("Personal"),
    };
  }, [leaves, user]);

  if (!user || user.role !== "EMPLOYEE") return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (new Date(form.endDate) < new Date(form.startDate)) {
      alert("End date cannot be earlier than start date!");
      return;
    }

    addLeave({
      ...form,
      employee: `${user.name}`,
    });

    alert("Leave Request Submitted!");
    setForm({ type: "Vacation", startDate: "", endDate: "", reason: "" });
  };

  return (
    <div>
      <h1 style={{ marginBottom: "2rem" }}>My Dashboard</h1>

      <div className="grid-3">
        <StatCard title="Vacation" used={stats.vacationUsed} total={20} colorHex="var(--primary)" />
        <StatCard title="Sick Leave" used={stats.sickUsed} total={10} colorHex="var(--danger)" />
        <StatCard title="Personal" used={stats.personalUsed} total={5} colorHex="var(--success)" />
      </div>

      <div className="grid-layout">
        <div className="card">
          <h2>Request Leave</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Leave Type</label>
              <select
                className="form-control"
                value={form.type}
                onChange={(e) => setForm({ ...form, type: e.target.value })}
              >
                <option value="Vacation">Vacation</option>
                <option value="Sick Leave">Sick Leave</option>
                <option value="Personal">Personal</option>
              </select>
            </div>

            <div className="form-group">
              <label>Start Date</label>
              <input
                type="date"
                required
                min={today}
                className="form-control"
                value={form.startDate}
                onChange={(e) => handleDateChange(e, "startDate")}
              />
            </div>

            <div className="form-group">
              <label>End Date</label>
              <input
                type="date"
                required
                min={form.startDate || today}
                className="form-control"
                value={form.endDate}
                onChange={(e) => handleDateChange(e, "endDate")}
              />
            </div>

            <div className="form-group">
              <label>Reason</label>
              <textarea
                required
                className="form-control"
                value={form.reason}
                onChange={(e) => setForm({ ...form, reason: e.target.value })}
              />
            </div>

            <button type="submit" className="btn btn-primary">
              Submit Application
            </button>
          </form>
        </div>

        <div className="card">
          <h2>My Leave History</h2>
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Type</th>
                  <th>Dates</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {leaves
                  .filter((l) => l.employee.includes(user.name))
                  .map((l) => (
                    <tr key={l.id}>
                      <td>{l.type}</td>
                      <td>{l.startDate} to {l.endDate}</td>
                      <td>
                        <span className={`badge badge-${l.status.toLowerCase()}`}>
                          {l.status}
                        </span>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}