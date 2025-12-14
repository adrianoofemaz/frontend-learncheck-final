import React, { useEffect, useRef, useState } from "react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

const CHART_HEIGHT = 280;

const SubmoduleScoreChart = ({ data = [] }) => {
  const containerRef = useRef(null);
  const [width, setWidth] = useState(0);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const update = (entry) => {
      const rect = entry?.contentRect || el.getBoundingClientRect();
      const w = rect?.width ?? 0;
      if (w > 8) setWidth(w);
    };

    const observer = new ResizeObserver((entries) => entries.forEach(update));
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const ready = width > 8;

  return (
    <div
      ref={containerRef}
      className="w-full"
      style={{ minWidth: 0, height: CHART_HEIGHT, minHeight: CHART_HEIGHT }}
    >
      {ready ? (
        <ResponsiveContainer width={width} height={CHART_HEIGHT}>
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
      ) : (
        <div className="h-full w-full bg-gray-50 rounded-2xl animate-pulse" />
      )}
    </div>
  );
};

export default SubmoduleScoreChart;