import React from "react";
import {
  DollarSign,
  TrendingUp,
  Leaf,
  Package,
  ArrowUpRight,
  MoreHorizontal,
  BrainCircuit,
} from "lucide-react";

export default function Dashboard() {
  return (
    <div className="flex flex-col gap-8 animate-in fade-in duration-500">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Overview
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            Your platform metrics, demand forecasts, and operational insights.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm font-medium text-muted-foreground bg-muted/50 px-3 py-1.5 rounded-md border border-border">
            Oct 24 - Nov 24
          </span>
          <button className="px-4 py-2 bg-primary text-primary-foreground flex items-center gap-2 text-sm rounded-lg hover:opacity-90 transition-opacity shadow-sm">
            Download Report
            <ArrowUpRight size={16} />
          </button>
        </div>
      </div>

      {/* Top KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <MetricCard
          title="Total Revenue"
          value="Rs. 452,318"
          trend="+12.5%"
          isPositive={true}
          icon={<DollarSign size={20} className="text-primary" />}
        />
        <MetricCard
          title="AI Demand Forecast"
          value="94.2%"
          subtitle="Accuracy"
          trend="+2.1%"
          isPositive={true}
          icon={<BrainCircuit size={20} className="text-indigo-500" />}
        />
        <MetricCard
          title="Waste Prevented"
          value="124 kg"
          subtitle="Saved"
          trend="+18.2%"
          isPositive={true}
          icon={<Leaf size={20} className="text-emerald-500" />}
        />
        <MetricCard
          title="Active Orders"
          value="342"
          subtitle="Processing"
          trend="-4.0%"
          isPositive={false}
          icon={<Package size={20} className="text-orange-500" />}
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart Section */}
        <div className="lg:col-span-2 bg-card rounded-xl border border-border shadow-sm p-6 flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-lg font-semibold text-foreground">
                Revenue vs. Forecast
              </h2>
              <p className="text-sm text-muted-foreground">
                Actual sales against predictions
              </p>
            </div>
            <select className="bg-background border border-border text-sm rounded-md px-3 py-1.5 text-foreground outline-none focus:ring-1 focus:ring-primary">
              <option>Last 7 Days</option>
              <option>This Month</option>
              <option>This Year</option>
            </select>
          </div>

          <div className="flex-1 min-h-[300px] w-full bg-muted/20 rounded-lg border border-dashed border-border flex flex-col items-center justify-center relative overflow-hidden">
            <TrendingUp size={32} className="text-muted-foreground/30 mb-2" />
            <span className="text-muted-foreground text-sm font-medium">
              Chart Area Ready
            </span>
            <span className="text-xs text-muted-foreground/70 mt-1">
              For Recharts integration
            </span>
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-card rounded-xl border border-border shadow-sm p-6 flex flex-col">
          <h3 className="text-lg font-semibold text-foreground mb-6">
            Recent Activity
          </h3>
          <div className="space-y-3">
            {[
              {
                type: "📦",
                text: "Order #OD-2456 received",
                time: "5 mins ago",
              },
              {
                type: "✅",
                text: "Order #OD-2455 shipped",
                time: "2 hours ago",
              },
              { type: "⚠️", text: "Low stock alert", time: "4 hours ago" },
              { type: "💰", text: "Payment received", time: "1 day ago" },
            ].map((item, idx) => (
              <div
                key={idx}
                className="flex gap-3 pb-3 border-b border-border/40 last:border-0"
              >
                <span className="text-xl w-6 flex-shrink-0">{item.type}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground">
                    {item.text}
                  </p>
                  <p className="text-xs text-muted-foreground">{item.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Orders Table */}
        <div className="bg-card rounded-xl border border-border shadow-sm p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-semibold text-foreground">
              Recent Orders
            </h3>
            <a href="#" className="text-sm text-primary hover:underline">
              View All
            </a>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-2 px-2 font-medium">Order ID</th>
                  <th className="text-left py-2 px-2 font-medium">Customer</th>
                  <th className="text-left py-2 px-2 font-medium">Amount</th>
                  <th className="text-left py-2 px-2 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {[
                  {
                    id: "#2456",
                    name: "John Doe",
                    amount: "Rs. 12,450",
                    status: "Processing",
                  },
                  {
                    id: "#2455",
                    name: "Jane Smith",
                    amount: "Rs. 8,920",
                    status: "Shipped",
                  },
                  {
                    id: "#2454",
                    name: "Mike Johnson",
                    amount: "Rs. 5,680",
                    status: "Delivered",
                  },
                  {
                    id: "#2453",
                    name: "Sarah Lee",
                    amount: "Rs. 15,320",
                    status: "Processing",
                  },
                ].map((row, idx) => (
                  <tr
                    key={idx}
                    className="border-b border-border/40 hover:bg-muted/30"
                  >
                    <td className="py-3 px-2 font-medium">{row.id}</td>
                    <td className="py-3 px-2">{row.name}</td>
                    <td className="py-3 px-2">{row.amount}</td>
                    <td className="py-3 px-2">
                      <span
                        className={`px-2 py-1 rounded text-xs font-medium ${
                          row.status === "Processing"
                            ? "bg-yellow-100 text-yellow-700"
                            : row.status === "Shipped"
                              ? "bg-blue-100 text-blue-700"
                              : "bg-green-100 text-green-700"
                        }`}
                      >
                        {row.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Inventory */}
        <div className="bg-card rounded-xl border border-border shadow-sm p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-semibold text-foreground">Inventory</h3>
            <a href="#" className="text-sm text-primary hover:underline">
              Manage
            </a>
          </div>
          <div className="space-y-4">
            {[
              {
                name: "Winter Jacket",
                stock: 245,
                total: 500,
                color: "bg-blue-500",
              },
              {
                name: "Casual Shirt",
                stock: 89,
                total: 300,
                color: "bg-yellow-500",
              },
              {
                name: "Running Shoes",
                stock: 12,
                total: 200,
                color: "bg-red-500",
              },
              {
                name: "Jeans Blue",
                stock: 423,
                total: 450,
                color: "bg-green-500",
              },
            ].map((item, idx) => (
              <div key={idx}>
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium">{item.name}</span>
                  <span className="text-xs text-muted-foreground">
                    {item.stock}/{item.total}
                  </span>
                </div>
                <div className="w-full h-2 bg-muted/40 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${item.color}`}
                    style={{ width: `${(item.stock / item.total) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function MetricCard({ title, value, subtitle, trend, isPositive, icon }) {
  return (
    <div className="bg-card rounded-xl border border-border shadow-sm p-6 hover:shadow-md transition-all">
      <div className="flex justify-between items-start mb-4">
        <div className="h-10 w-10 rounded-lg bg-muted/50 flex items-center justify-center">
          {icon}
        </div>
        <button className="text-muted-foreground hover:text-foreground p-1">
          <MoreHorizontal size={18} />
        </button>
      </div>
      <p className="text-sm text-muted-foreground mb-1">{title}</p>
      <p className="text-2xl font-bold mb-2">{value}</p>
      {subtitle && (
        <p className="text-xs text-muted-foreground mb-3">{subtitle}</p>
      )}
      <div className="flex items-center gap-2">
        <ArrowUpRight
          size={16}
          className={
            isPositive ? "text-emerald-500" : "text-rose-500 rotate-180"
          }
        />
        <span className={isPositive ? "text-emerald-600" : "text-rose-600"}>
          {trend}
        </span>
        <span className="text-xs text-muted-foreground">vs period</span>
      </div>
    </div>
  );
}
