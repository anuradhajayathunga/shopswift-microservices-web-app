"use client";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import type { ApexOptions } from "apexcharts";
const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });
import { Icon } from "@iconify/react";
import { HiOutlineDotsVertical } from "react-icons/hi";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { userAPI } from "@/lib/users";

type UserStats = {
  total: number;
  admins: number;
  customers: number;
};

const TotalFollowers = () => {
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

  const [stats, setStats] = useState<UserStats>({
    total: 0,
    admins: 0,
    customers: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const loadUsers = async () => {
      try {
        setIsLoading(true);
        const users = await userAPI.list();

        if (!isMounted) {
          return;
        }

        const admins = users.filter((user) => user.role === "admin").length;
        const customers = users.filter(
          (user) => user.role === "customer",
        ).length;

        setStats({
          total: users.length,
          admins,
          customers,
        });
        setError(null);
      } catch (loadError) {
        if (!isMounted) {
          return;
        }

        setError(
          loadError instanceof Error
            ? loadError.message
            : "Failed to load users",
        );
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    void loadUsers();

    return () => {
      isMounted = false;
    };
  }, []);

  const chartSeries = [
    {
      name: "Admins",
      data: [stats.admins],
    },
    {
      name: "Customers",
      data: [stats.customers],
    },
  ];

  const chartOptions: ApexOptions = {
    chart: {
      fontFamily: "inherit",
      type: "bar",
      height: 100,
      stacked: true,
      toolbar: {
        show: false,
      },
      sparkline: {
        enabled: true,
      },
    },
    grid: {
      show: false,
      borderColor: "rgba(0,0,0,0.1)",
      strokeDashArray: 1,
      xaxis: {
        lines: {
          show: false,
        },
      },
      yaxis: {
        lines: {
          show: true,
        },
      },
      padding: {
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
      },
    },
    colors: ["var(--color-secondary)", "var(--color-error)"],
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: "45%",
        borderRadius: 3,
        borderRadiusApplication: "end",
        borderRadiusWhenStacked: "all",
      },
    },
    dataLabels: {
      enabled: false,
    },
    yaxis: {
      labels: {
        show: false,
      },
    },
    xaxis: {
      categories: ["Users"],
      labels: {
        show: false,
      },
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
    },
    tooltip: {
      theme: "dark",
    },
    legend: {
      show: false,
    },
  };
  return (
    <>
      <div className="bg-lighterror rounded-3xl p-6 relative w-full break-words">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="w-14 h-10 rounded-full flex items-center justify-center  bg-error text-white">
              <Icon icon="solar:users-group-rounded-bold-duotone" height={24} />
            </span>
            <h5 className="text-base opacity-70">Total users</h5>
          </div>
          <div>
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
                    className="flex items-center gap-3 cursor-pointer"
                  >
                    <Icon icon={items.icon} height={18} />
                    <span>{items.listtitle}</span>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <div className="grid grid-cols-12 gap-[24px] items-end mt-3">
          <div className="xl:col-span-6 col-span-7">
            <h2 className="text-3xl mb-3">
              {isLoading ? "..." : stats.total.toLocaleString()}
            </h2>
            <span className="font-semibold border rounded-full border-black/5 dark:border-white/10 py-0.5 px-[10px] leading-[normal] text-xs text-dark dark:text-darklink">
              <span className="opacity-70">
                {isLoading
                  ? "Loading live data"
                  : error
                    ? "Backend data unavailable"
                    : `${stats.admins} admins / ${stats.customers} customers`}
              </span>
            </span>
          </div>
          <div className="xl:col-span-6  col-span-5 ">
            <div className="rounded-bars md:ps-7">
              <Chart
                options={chartOptions}
                series={chartSeries}
                type="bar"
                height="100px"
                width="100%"
              />
            </div>
          </div>
        </div>
        {/* {error ? (
          <p className="mt-3 text-xs text-red-600 dark:text-red-400">{error}</p>
        ) : null} */}
      </div>
    </>
  );
};

export default TotalFollowers;
