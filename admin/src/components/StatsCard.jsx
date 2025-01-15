import React from "react";

const StatsCard = ({ title, value, color }) => (
  <div className={`p-4 rounded-lg shadow text-white ${color}`}>
    <p>{title}</p>
    <h3 className="text-2xl font-bold">{value}</h3>
  </div>
);

export default StatsCard;
