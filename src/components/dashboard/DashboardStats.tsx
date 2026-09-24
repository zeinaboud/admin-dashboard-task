"use client";

import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import {
  ArrowDownRight,
  ArrowUpRight,
  DollarSign,
  ShoppingCart,
  UserCheck,
  Users,
} from "lucide-react";

type Stat = {
  label: string;
  value: number;
  change: number;
  prefix?: string;
};

type DashboardStatsProps = {
  stats: {
    totalUsers: Stat;
    activeUsers: Stat;
    totalOrders: Stat;
    revenue: Stat;
  };
};

export function DashboardStats({ stats }: DashboardStatsProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (!containerRef.current) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        "[data-stat-card]",
        {
          opacity: 0,
          y: 24,
        },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          stagger: 0.08,
          ease: "power3.out",
        },
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  const cards = [
    {
      key: "totalUsers",
      stat: stats.totalUsers,
      icon: Users,
    },
    {
      key: "activeUsers",
      stat: stats.activeUsers,
      icon: UserCheck,
    },
    {
      key: "totalOrders",
      stat: stats.totalOrders,
      icon: ShoppingCart,
    },
    {
      key: "revenue",
      stat: stats.revenue,
      icon: DollarSign,
    },
  ];

  return (
    <div
      ref={containerRef}
      className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4"
    >
      {cards.map(({ key, stat, icon: Icon }) => {
        const isPositive = stat.change >= 0;

        const value =
          stat.prefix === "$"
            ? `$${stat.value.toLocaleString("en-US")}`
            : stat.value.toLocaleString("en-US");

        return (
          <div
            key={key}
            data-stat-card
            className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">
                  {stat.label}
                </p>

                <h3 className="mt-3 text-2xl font-semibold tracking-tight text-slate-950">
                  {value}
                </h3>
              </div>

              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-600 transition-all duration-300 group-hover:bg-slate-900 group-hover:text-white">
                <Icon className="h-5 w-5" />
              </div>
            </div>

            <div className="mt-4 flex items-center gap-2">
              <span
                className={`inline-flex items-center gap-0.5 text-xs font-semibold ${
                  isPositive ? "text-emerald-600" : "text-red-500"
                }`}
              >
                {isPositive ? (
                  <ArrowUpRight className="h-3.5 w-3.5" />
                ) : (
                  <ArrowDownRight className="h-3.5 w-3.5" />
                )}
                {Math.abs(stat.change).toFixed(1)}%
              </span>

              <span className="text-xs text-slate-400">vs previous period</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
