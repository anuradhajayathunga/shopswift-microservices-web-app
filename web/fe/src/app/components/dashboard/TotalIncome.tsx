"use client";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import type { ApexOptions } from "apexcharts";
const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });
import { Icon } from "@iconify/react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { HiOutlineDotsVertical } from "react-icons/hi";
import { orderAPI, type Order } from "@/lib/orders";

type IncomeStats = {
  currentMonthIncome: number;
  previousMonthIncome: number;
  chartData: number[];
};

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "LKR",
    maximumFractionDigits: 0,
  }).format(value);
};

const buildIncomeStats = (orders: Order[]): IncomeStats => {
  const now = new Date();
  const chartData = Array.from({ length: 7 }, (_, index) => {
    const date = new Date(now.getFullYear(), now.getMonth() - (6 - index), 1);
    const monthKey = `${date.getFullYear()}-${date.getMonth()}`;

    return orders.reduce((sum, order) => {
      const orderDate = new Date(order.created_at);
      const orderMonthKey = `${orderDate.getFullYear()}-${orderDate.getMonth()}`;

      return orderMonthKey === monthKey ? sum + order.total_price : sum;
    }, 0);
  });

  const currentMonthKey = `${now.getFullYear()}-${now.getMonth()}`;
  const previousMonthDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const previousMonthKey = `${previousMonthDate.getFullYear()}-${previousMonthDate.getMonth()}`;

  const currentMonthIncome = orders.reduce((sum, order) => {
    const orderDate = new Date(order.created_at);
    const orderMonthKey = `${orderDate.getFullYear()}-${orderDate.getMonth()}`;

    return orderMonthKey === currentMonthKey ? sum + order.total_price : sum;
  }, 0);

  const previousMonthIncome = orders.reduce((sum, order) => {
    const orderDate = new Date(order.created_at);
    const orderMonthKey = `${orderDate.getFullYear()}-${orderDate.getMonth()}`;

    return orderMonthKey === previousMonthKey ? sum + order.total_price : sum;
  }, 0);

  return {
    currentMonthIncome,
    previousMonthIncome,
    chartData,
  };
};

const TotalIncome = () => {
  const Action = [
    {
      icon: "solar:add-circle-outline",
      listtitle: "Add",
    },
    {
      icon: "solar:pen-new-square-broken",
      listtitle: "Edit",
    },
    {
      icon: "solar:trash-bin-minimalistic-outline",
      listtitle: "Delete",
    },
  ];

  const [stats, setStats] = useState<IncomeStats>({
    currentMonthIncome: 0,
    previousMonthIncome: 0,
    chartData: [0, 0, 0, 0, 0, 0, 0],
  });

  useEffect(() => {
    let isMounted = true;

    const loadIncome = async () => {
      try {
        const orders = await orderAPI.list();

        if (!isMounted) {
          return;
        }

        setStats(buildIncomeStats(orders));
      } catch {
        if (!isMounted) {
          return;
        }

        setStats({
          currentMonthIncome: 0,
          previousMonthIncome: 0,
          chartData: [0, 0, 0, 0, 0, 0, 0],
        });
      }
    };

    void loadIncome();

    return () => {
      isMounted = false;
    };
  }, []);

  const chartSeries = [
    {
      name: "monthly earnings",
      color: "var(--color-secondary)",
      data: stats.chartData,
    },
  ];

  const chartOptions: ApexOptions = {
    chart: {
      id: "total-income",
      type: "area",
      height: 70,
      sparkline: {
        enabled: true,
      },
      group: "sparklines",
      fontFamily: "inherit",
      foreColor: "#adb0bb",
    },
    stroke: {
      curve: "smooth",
      width: 2,
    },
    fill: {
      type: "gradient",
      gradient: {
        shadeIntensity: 0,
        inverseColors: false,
        opacityFrom: 0,
        opacityTo: 0,
        stops: [20, 180],
      },
    },
    markers: {
      size: 0,
    },
    tooltip: {
      theme: "dark",
      fixed: {
        enabled: true,
        position: "right",
      },
      x: {
        show: false,
      },
    },
  };

  return (
    <div className="bg-lightsecondary rounded-3xl p-6 relative w-full break-words">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="w-14 h-10 rounded-full flex items-center justify-center bg-secondary text-white">
            <Icon icon="solar:wallet-2-line-duotone" height={24} />
          </span>
          <h5 className="text-base opacity-70">Total Income</h5>
        </div>

        {/* ✅ Shadcn Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <span className="h-9 w-9 flex justify-center items-center rounded-full cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800">
              <HiOutlineDotsVertical size={22} />
            </span>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end" className="w-40">
            {Action.map((items, index) => (
              <DropdownMenuItem
                key={index}
                className="flex items-center gap-3 cursor-pointer focus:bg-accent focus:text-accent-foreground"
              >
                <Icon icon={items.icon} height={18} />
                <span>{items.listtitle}</span>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="grid grid-cols-12 gap-[24px] items-end mt-10">
        <div className="xl:col-span-6 col-span-7">
          <h2 className="text-3xl mb-3">
            {formatCurrency(stats.currentMonthIncome)}
          </h2>
          <span className="font-semibold border rounded-full border-black/5 dark:border-white/10 py-0.5 px-[10px] leading-[normal] text-xs text-dark dark:text-darklink">
            <span className="opacity-70">
              {stats.previousMonthIncome > 0
                ? `${stats.currentMonthIncome >= stats.previousMonthIncome ? "+" : ""}${(
                    ((stats.currentMonthIncome - stats.previousMonthIncome) /
                      stats.previousMonthIncome) *
                    100
                  ).toFixed(0)}% last month`
                : "0% last month"}
            </span>
          </span>
        </div>
        <div className="xl:col-span-6 col-span-5">
          <div className="rounded-bars md:ps-7">
            <Chart
              options={chartOptions}
              series={chartSeries}
              type="area"
              height="70px"
              width="100%"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default TotalIncome;
