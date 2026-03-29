"use client";

import React from "react";
import {
  DollarSign,
  Users,
  Package,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  MoreHorizontal,
  Download,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function DashboardPage() {
  // Mock Data for the UI
  const recentOrders = [
    {
      id: "ORD-7352",
      customer: "Acme Corp",
      amount: "$2,500.00",
      status: "Completed",
      date: "Today, 10:23 AM",
    },
    {
      id: "ORD-7351",
      customer: "Globex Inc",
      amount: "$850.00",
      status: "Processing",
      date: "Today, 09:15 AM",
    },
    {
      id: "ORD-7350",
      customer: "Soylent Corp",
      amount: "$12,400.00",
      status: "Completed",
      date: "Yesterday",
    },
    {
      id: "ORD-7349",
      customer: "Initech",
      amount: "$340.00",
      status: "Failed",
      date: "Yesterday",
    },
    {
      id: "ORD-7348",
      customer: "Umbrella Corp",
      amount: "$9,200.00",
      status: "Processing",
      date: "Oct 24, 2023",
    },
  ];

  // Pure Tailwind Mock Chart Data
  const chartData = [40, 70, 45, 90, 65, 85, 100, 60, 80, 55, 75, 95];

  return (
    <div className="space-y-8 pb-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Dashboard
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Here&apos;s what&apos;s happening with your store today.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            className="bg-background border-border shadow-sm text-sm h-9"
          >
            Select Date
          </Button>
          <Button className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg shadow-primary/25 h-9 gap-2">
            <Download size={16} />
            Download Report
          </Button>
        </div>
      </div>

      {/* Top Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {/* Metric 1 */}
        <Card className="bg-card shadow-premium border-border">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Revenue
            </CardTitle>
            <div className="h-8 w-8 rounded-md bg-primary/10 flex items-center justify-center text-primary">
              <DollarSign size={16} />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">$45,231.89</div>
            <p className="text-xs font-medium text-emerald-600 flex items-center mt-1">
              <ArrowUpRight size={14} className="mr-1" />
              +20.1% from last month
            </p>
          </CardContent>
        </Card>

        {/* Metric 2 */}
        <Card className="bg-card shadow-premium border-border">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Active Customers
            </CardTitle>
            <div className="h-8 w-8 rounded-md bg-blue-500/10 flex items-center justify-center text-blue-600">
              <Users size={16} />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">+2,350</div>
            <p className="text-xs font-medium text-emerald-600 flex items-center mt-1">
              <ArrowUpRight size={14} className="mr-1" />
              +180 new this week
            </p>
          </CardContent>
        </Card>

        {/* Metric 3 */}
        <Card className="bg-card shadow-premium border-border">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Low Stock Alerts
            </CardTitle>
            <div className="h-8 w-8 rounded-md bg-amber-500/10 flex items-center justify-center text-amber-600">
              <Package size={16} />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">12</div>
            <p className="text-xs font-medium text-destructive flex items-center mt-1">
              <ArrowDownRight size={14} className="mr-1" />
              Requires immediate attention
            </p>
          </CardContent>
        </Card>

        {/* Metric 4 */}
        <Card className="bg-card shadow-premium border-border">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              AI Forecast Accuracy
            </CardTitle>
            <div className="h-8 w-8 rounded-md bg-emerald-500/10 flex items-center justify-center text-emerald-600">
              <TrendingUp size={16} />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">94.2%</div>
            <Progress value={94.2} className="h-1.5 mt-3" />
          </CardContent>
        </Card>
      </div>

      {/* Middle Section: Chart & Side Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Main Chart Area */}
        <Card className="lg:col-span-2 bg-card shadow-premium border-border flex flex-col">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-foreground">
              Revenue Overview
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Monthly revenue performance for 2024
            </p>
          </CardHeader>
          <CardContent className="flex-1 flex items-end min-h-[250px] gap-2 pt-4">
            {/* Simulated CSS Bar Chart */}
            {chartData.map((height, i) => (
              <div
                key={i}
                className="flex-1 flex flex-col justify-end group h-full"
              >
                <div
                  className="w-full bg-primary/20 rounded-t-sm group-hover:bg-primary transition-all duration-300 relative cursor-pointer"
                  style={{ height: `${height}%` }}
                >
                  {/* Tooltip on hover */}
                  <div className="opacity-0 group-hover:opacity-100 absolute -top-8 left-1/2 -translate-x-1/2 bg-foreground text-background text-xs py-1 px-2 rounded font-medium transition-opacity pointer-events-none whitespace-nowrap">
                    ${(height * 450).toLocaleString()}
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Side Action List */}
        <Card className="bg-card shadow-premium border-border">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-foreground">
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="h-2 w-2 rounded-full bg-primary ring-4 ring-primary/10 shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">
                  AI Model re-trained
                </p>
                <p className="text-xs text-muted-foreground">
                  Forecast accuracy improved by 2%
                </p>
              </div>
              <span className="text-xs text-muted-foreground shrink-0">2m</span>
            </div>
            <div className="flex items-center gap-4">
              <div className="h-2 w-2 rounded-full bg-amber-500 ring-4 ring-amber-500/10 shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">
                  Inventory Alert
                </p>
                <p className="text-xs text-muted-foreground">
                  Organic Avocados running low
                </p>
              </div>
              <span className="text-xs text-muted-foreground shrink-0">1h</span>
            </div>
            <div className="flex items-center gap-4">
              <div className="h-2 w-2 rounded-full bg-emerald-500 ring-4 ring-emerald-500/10 shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">
                  Payout Processed
                </p>
                <p className="text-xs text-muted-foreground">
                  $12,450 sent to bank account
                </p>
              </div>
              <span className="text-xs text-muted-foreground shrink-0">4h</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Bottom Section: Data Table */}
      <Card className="bg-card shadow-premium border-border overflow-hidden">
        <CardHeader className="flex flex-row items-center justify-between bg-muted/20 border-b border-border py-4">
          <div>
            <CardTitle className="text-lg font-semibold text-foreground">
              Recent Orders
            </CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              Your latest 5 transactions.
            </p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="text-muted-foreground hover:text-foreground"
          >
            <MoreHorizontal size={18} />
          </Button>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-muted/30">
              <TableRow className="border-border hover:bg-transparent">
                <TableHead className="font-medium text-muted-foreground w-[100px]">
                  Order ID
                </TableHead>
                <TableHead className="font-medium text-muted-foreground">
                  Customer
                </TableHead>
                <TableHead className="font-medium text-muted-foreground">
                  Status
                </TableHead>
                <TableHead className="font-medium text-muted-foreground">
                  Date
                </TableHead>
                <TableHead className="font-medium text-muted-foreground text-right">
                  Amount
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentOrders.map((order) => (
                <TableRow
                  key={order.id}
                  className="border-border hover:bg-muted/30 cursor-pointer transition-colors"
                >
                  <TableCell className="font-medium text-foreground">
                    {order.id}
                  </TableCell>
                  <TableCell className="text-foreground/80">
                    {order.customer}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={
                        order.status === "Completed"
                          ? "border-emerald-500/30 text-emerald-600 bg-emerald-500/10"
                          : order.status === "Processing"
                            ? "border-blue-500/30 text-blue-600 bg-blue-500/10"
                            : "border-destructive/30 text-destructive bg-destructive/10"
                      }
                    >
                      {order.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground text-sm">
                    {order.date}
                  </TableCell>
                  <TableCell className="text-right font-medium text-foreground">
                    {order.amount}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
