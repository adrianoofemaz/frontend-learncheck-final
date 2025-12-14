import React from "react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

const SubmoduleScoreChart = ({ data = [] }) => (
  <div className="w-full" style={{ minWidth: 0, height: 280, minHeight: 280 }}>
    <ResponsiveContainer width="100%" height={280}>
      <AreaChart data={data} margin={{ top: 10, right: 10, bottom: 10, left: 0 }}>
        <defs>
          <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#1e7bff" stopOpacity={0.6} />
            <stop offset="100%" stopColor="#1e7bff" stopOpacity={0.05} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
        <XAxis dataKey="name" tick={{ fontSize: 11 }} />
        <YAxis domain={[0, 100]} tick={{ fontSize: 11 }} />
        <Tooltip />
        <Area
          type="monotone"
          dataKey="score"
          stroke="#1e7bff"
          strokeWidth={2}
          fill="url(#colorScore)"
          activeDot={{ r: 5 }}
        />
      </AreaChart>
    </ResponsiveContainer>
  </div>
);

export default SubmoduleScoreChart;