"use client";

import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

type UserStatusChartProps = {
  data: {
    ACTIVE: number;
    PENDING: number;
    INACTIVE: number;
  };
};

const statusConfig = {
  ACTIVE: {
    label: "Active",
  },
  PENDING: {
    label: "Pending",
  },
  INACTIVE: {
    label: "Inactive",
  },
} as const;

export function UserStatusChart({ data }: UserStatusChartProps) {
  const chartRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (!chartRef.current) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        "[data-status-chart]",
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

  const chartData = Object.entries(data).map(([status, value]) => ({
    status: status as keyof typeof statusConfig,
    value,
    label: statusConfig[status as keyof typeof statusConfig].label,
  }));

  const total = chartData.reduce((sum, item) => sum + item.value, 0);

  return (
    <div ref={chartRef} data-status-chart className="w-full">
      <div className="relative mx-auto h-[280px] w-full max-w-[320px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              dataKey="value"
              nameKey="label"
              cx="50%"
              cy="50%"
              innerRadius={82}
              outerRadius={110}
              paddingAngle={3}
              stroke="none"
              animationDuration={1000}
              animationEasing="ease-out"
            >
              {chartData.map((entry) => (
                <Cell
                  key={entry.status}
                  fill={
                    entry.status === "ACTIVE"
                      ? "#0f172a"
                      : entry.status === "PENDING"
                        ? "#94a3b8"
                        : "#e2e8f0"
                  }
                />
              ))}
            </Pie>

            <Tooltip
              formatter={(value, _name, item) => {
                const percentage =
                  total > 0 ? ((Number(value) / total) * 100).toFixed(1) : "0";

                return [`${value} users (${percentage}%)`, item.payload.label];
              }}
              contentStyle={{
                border: "1px solid #e2e8f0",
                borderRadius: "12px",
                boxShadow: "0 10px 30px rgba(15, 23, 42, 0.08)",
              }}
            />
          </PieChart>
        </ResponsiveContainer>

        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-3xl font-semibold tracking-tight text-slate-950">
            {total.toLocaleString("en-US")}
          </span>

          <span className="mt-1 text-xs font-medium text-slate-400">
            Total users
          </span>
        </div>
      </div>

      <div className="mt-2 grid grid-cols-3 gap-3">
        {chartData.map((item) => {
          const percentage = total > 0 ? (item.value / total) * 100 : 0;

          return (
            <div key={item.status} className="text-center">
              <p className="text-sm font-semibold text-slate-950">
                {percentage.toFixed(1)}%
              </p>

              <p className="mt-1 text-xs text-slate-400">{item.label}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
