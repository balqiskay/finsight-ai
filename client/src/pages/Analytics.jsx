import { useEffect, useState } from "react";

import MainLayout from "../layouts/MainLayout";

import {
  PieChart,
  Pie,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

import {
  getCategoryBreakdown,
} from "../services/analyticsService";

function Analytics() {

  const [categoryData, setCategoryData] =
    useState([]);

  const fetchCategoryData =
    async () => {

      try {

        const data =
          await getCategoryBreakdown();

        setCategoryData(data);

      } catch (error) {

        console.error(error);

      }

  };

  useEffect(() => {

    fetchCategoryData();

  }, []);

  const COLORS = [
    "#3b82f6",
    "#22c55e",
    "#f59e0b",
    "#ef4444",
    "#a855f7",
  ];

  return (
    <MainLayout>

      <h1 className="text-2xl md:text-4xl font-bold mb-8">
        Analytics
      </h1>

      <div className="bg-zinc-900 p-6 md:p-8 rounded-2xl">

        <h2 className="text-2xl font-bold mb-6">
          Expense Categories
        </h2>

        <div className="w-full flex justify-center">

          <div className="w-[280px] h-[280px] md:w-[400px] md:h-[400px]">

            <ResponsiveContainer
              width="100%"
              height="100%"
            >

              <PieChart>

                <Pie
                  data={categoryData.map(item => ({
                    ...item,
                    total: Number(item.total)
                  }))}
                  dataKey="total"
                  nameKey="category"
                  cx="50%"
                  cy="50%"
                  outerRadius="70%"
                  label={false}
                >

                  {categoryData.map(
                    (entry, index) => (

                      <Cell
                        key={index}
                        fill={
                          COLORS[
                            index % COLORS.length
                          ]
                        }
                      />

                    )
                  )}

                </Pie>

                <Tooltip />

              </PieChart>

            </ResponsiveContainer>

          </div>

        </div>

      </div>

    </MainLayout>
  );
}

export default Analytics;