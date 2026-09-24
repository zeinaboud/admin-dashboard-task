"use client";

import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

type UserGrowthPoint = {
  date: string;
  value: number;
};

type UserGrowthChartProps = {
  data: UserGrowthPoint[];
};

function formatDate(date: string) {
  return new Date(`${date}T00:00:00`).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

export function UserGrowthChart({ data }: UserGrowthChartProps) {
  const chartRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (!chartRef.current) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        "[data-growth-chart]",
        {
          opacity: 0,
          y: 20,
        },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          ease: "power3.out",
        },
      );
    }, chartRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={chartRef} data-growth-chart className="h-[340px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={data}
          margin={{
            top: 10,
            right: 0,
            left: -20,
            bottom: 0,
          }}
        >
          <defs>
            <linearGradient id="userGrowthGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#0f172a" stopOpacity={0.18} />

              <stop offset="100%" stopColor="#0f172a" stopOpacity={0} />
            </linearGradient>
          </defs>

          <CartesianGrid
            vertical={false}
            stroke="#e2e8f0"
            strokeDasharray="4 4"
          />

          <XAxis
            dataKey="date"
            axisLine={false}
            tickLine={false}
            tick={{ fill: "#94a3b8", fontSize: 11 }}
            tickFormatter={formatDate}
          />

          <YAxis
            allowDecimals={false}
            axisLine={false}
            tickLine={false}
            tick={{ fill: "#94a3b8", fontSize: 11 }}
          />

          <Tooltip
            labelFormatter={(value) => formatDate(String(value))}
            formatter={(value) => [`${value} users`, "New users"]}
            cursor={{
              stroke: "#cbd5e1",
              strokeDasharray: "4 4",
            }}
            contentStyle={{
              border: "1px solid #e2e8f0",
              borderRadius: "12px",
              boxShadow: "0 10px 30px rgba(15, 23, 42, 0.08)",
            }}
          />

          <Area
            type="monotone"
            dataKey="value"
            stroke="#0f172a"
            strokeWidth={2}
            fill="url(#userGrowthGradient)"
            dot={false}
            activeDot={{
              r: 4,
            }}
            animationDuration={1000}
            animationEasing="ease-out"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
