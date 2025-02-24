import React from "react";

const DashboardOverview = ({ admin }) => {
  return (
    <div>
      <h1>Welcome Admin, {admin.username}!</h1>
      <p>Admin ID: {admin.adminId}</p>
      <div className="dashboard-stats">
        {/* Add your dashboard metrics here */}
      </div>
    </div>
  );
};

export default DashboardOverview;