import React from 'react';
import { 
  DollarSign, 
  TrendingUp, 
  Leaf, 
  Package, 
  ArrowUpRight, 
  MoreHorizontal,
  BrainCircuit
} from 'lucide-react';

export default function Dashboard() {
  return (
    <div className="flex flex-col gap-8 animate-in fade-in duration-500">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Overview</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Your platform metrics, demand forecasts, and operational insights.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm font-medium text-muted-foreground bg-muted/50 px-3 py-1.5 rounded-md border border-border">
            Oct 24 - Nov 24
          </span>
          <button className="btn-primary px-4 py-2 flex items-center gap-2 text-sm">
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
          subtitle="Accuracy this week"
          trend="+2.1%" 
          isPositive={true}
          icon={<BrainCircuit size={20} className="text-indigo-500" />} 
        />
        <MetricCard 
          title="Waste Prevented" 
          value="124 kg" 
          subtitle="Inventory saved"
          trend="+18.2%" 
          isPositive={true}
          icon={<Leaf size={20} className="text-emerald-500" />} 
        />
        <MetricCard 
          title="Active Orders" 
          value="342" 
          subtitle="Processing currently"
          trend="-4.0%" 
          isPositive={false}
          icon={<Package size={20} className="text-orange-500" />} 
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Chart Section (Spans 2 columns) */}
        <div className="lg:col-span-2 bg-card rounded-xl border border-border shadow-premium p-6 flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-lg font-semibold text-foreground">Revenue vs. Forecast</h2>
              <p className="text-sm text-muted-foreground">Comparing actual sales against AI predictions</p>
            </div>
            <select className="bg-background border border-border text-sm rounded-md px-3 py-1.5 text-foreground outline-none focus:ring-1 focus:ring-primary">
              <option>Last 7 Days</option>
              <option>This Month</option>
              <option>This Year</option>
            </select>
          </div>
          
          {/* CSS Chart Placeholder (Ready for Recharts or Chart.js) */}
          <div className="flex-1 min-h-[300px] w-full bg-muted/20 rounded-lg border border-dashed border-border flex flex-col items-center justify-center relative overflow-hidden">
            <TrendingUp size={32} className="text-muted-foreground/30 mb-2" />
            <span className="text-muted-foreground text-sm font-medium">Chart Visualization Area</span>
            <span className="text-xs text-muted-foreground/70 mt-1">Insert Recharts `LineChart` here</span>
            
            {/* Decorative background grid to make it look like a chart area */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
          </div>
        </div>

        {/* Recent Activity/Alerts (Spans 1 column) */}
        <div className="bg-card rounded-xl border border-border shadow-premium p-6 flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-semibold text-foreground">System Alerts</h2>
            <button className="text-muted-foreground hover:text-foreground transition-colors">
              <MoreHorizontal size={20} />
            </button>
          </div>
          
          <div className="space-y-6 flex-1">
            <AlertItem 
              title="Inventory Low: Mozzarella" 
              time="10 mins ago" 
              type="warning" 
            />
            <AlertItem 
              title="Surge predicted at 7:00 PM" 
              time="1 hour ago" 
              type="info" 
            />
            <AlertItem 
              title="Waste threshold exceeded: Prep Station B" 
              time="2 hours ago" 
              type="danger" 
            />
            <AlertItem 
              title="Weekly forecast generated successfully" 
              time="5 hours ago" 
              type="success" 
            />
          </div>
          
          <button className="w-full mt-6 py-2 text-sm font-medium text-primary hover:bg-primary/5 rounded-md transition-colors">
            View All Alerts
          </button>
        </div>
      </div>

      {/* Data Table Section */}
      <div className="bg-card rounded-xl border border-border shadow-premium overflow-hidden">
        <div className="p-6 border-b border-border flex justify-between items-center bg-background/50">
          <h2 className="text-lg font-semibold text-foreground">Recent Transactions</h2>
          <button className="text-sm font-medium text-primary hover:underline">View All</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-muted-foreground uppercase bg-muted/30 border-b border-border">
              <tr>
                <th className="px-6 py-4 font-medium">Order ID</th>
                <th className="px-6 py-4 font-medium">Customer</th>
                <th className="px-6 py-4 font-medium">Date</th>
                <th className="px-6 py-4 font-medium">Amount</th>
                <th className="px-6 py-4 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              <TableRow id="#ORD-7352" customer="Nuwan Perera" date="Oct 24, 2025" amount="Rs. 4,500" status="Completed" />
              <TableRow id="#ORD-7351" customer="Kasun Silva" date="Oct 24, 2025" amount="Rs. 12,200" status="Processing" />
              <TableRow id="#ORD-7350" customer="Amaya Fernando" date="Oct 24, 2025" amount="Rs. 3,150" status="Completed" />
              <TableRow id="#ORD-7349" customer="Corporate Event Catering" date="Oct 23, 2025" amount="Rs. 85,000" status="Pending" />
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}

// --- Helper Components for cleaner code ---

function MetricCard({ title, value, subtitle, trend, isPositive, icon }) {
  return (
    <div className="bg-card rounded-xl border border-border shadow-premium p-5 hover:border-primary/30 transition-all duration-300 group">
      <div className="flex justify-between items-start mb-4">
        <div className="h-10 w-10 rounded-lg bg-background border border-border flex items-center justify-center group-hover:scale-110 transition-transform">
          {icon}
        </div>
        <span className={`text-xs font-semibold px-2 py-1 rounded-full flex items-center gap-1 ${
          isPositive ? 'bg-emerald-500/10 text-emerald-600' : 'bg-rose-500/10 text-rose-600'
        }`}>
          {isPositive ? '↑' : '↓'} {trend}
        </span>
      </div>
      <div>
        <h3 className="text-muted-foreground text-sm font-medium">{title}</h3>
        <div className="text-2xl font-bold text-foreground mt-1 tracking-tight">{value}</div>
        {subtitle && <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>}
      </div>
    </div>
  );
}

function AlertItem({ title, time, type }) {
  const typeStyles = {
    warning: "bg-orange-500/20 text-orange-600",
    info: "bg-blue-500/20 text-blue-600",
    danger: "bg-rose-500/20 text-rose-600",
    success: "bg-emerald-500/20 text-emerald-600"
  };

  const dotStyles = {
    warning: "bg-orange-500",
    info: "bg-blue-500",
    danger: "bg-rose-500",
    success: "bg-emerald-500"
  };

  return (
    <div className="flex gap-4 items-start">
      <div className={`mt-1 h-2.5 w-2.5 rounded-full ${dotStyles[type]} shadow-sm`}></div>
      <div>
        <p className="text-sm font-medium text-foreground">{title}</p>
        <p className="text-xs text-muted-foreground mt-0.5">{time}</p>
      </div>
    </div>
  );
}

function TableRow({ id, customer, date, amount, status }) {
  const statusColors = {
    "Completed": "bg-emerald-500/10 text-emerald-600 border-emerald-200/50",
    "Processing": "bg-blue-500/10 text-blue-600 border-blue-200/50",
    "Pending": "bg-orange-500/10 text-orange-600 border-orange-200/50",
  };

  return (
    <tr className="hover:bg-muted/30 transition-colors group">
      <td className="px-6 py-4 font-medium text-foreground">{id}</td>
      <td className="px-6 py-4 text-muted-foreground">{customer}</td>
      <td className="px-6 py-4 text-muted-foreground">{date}</td>
      <td className="px-6 py-4 font-medium text-foreground">{amount}</td>
      <td className="px-6 py-4">
        <span className={`text-xs font-medium px-2.5 py-1 rounded-full border ${statusColors[status]}`}>
          {status}
        </span>
      </td>
    </tr>
  );
}