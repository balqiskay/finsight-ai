import { useEffect, useState } from "react";

import MainLayout from "../layouts/MainLayout";

import {
  getAIInsights,
} from "../services/aiService";

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

  const [categoryData, setCategoryData] = useState([]);

  const [aiInsights, setAIInsights] = useState("");

  const [loadingAI, setLoadingAI] = useState(false);

  const scoreMatch =
  aiInsights.match(
    /SCORE:\s*(\d+)/
  );

const ratingMatch =
  aiInsights.match(
    /RATING:\s*(.*)/
  );

const insightsMatch =
  aiInsights.match(
    /INSIGHTS:\s*([\s\S]*)/
  );

const score =
  scoreMatch
    ? scoreMatch[1]
    : null;

const rating =
  ratingMatch
    ? ratingMatch[1]
    : "";

const insightsText =
  insightsMatch
    ? insightsMatch[1]
    : aiInsights;

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

  const handleGenerateInsights =
  async () => {
    
    try {
      
      setLoadingAI(true);
      
      const data = await getAIInsights();

      setAIInsights(
        data.insights
      );

    } catch (error) {
      
      console.error(error);

      alert(
        "Failed to generate AI insights"
      );

    } finally {
      
      setLoadingAI(false);

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

      <div className="mt-10 bg-zinc-900 p-6 md:p-8 rounded-2xl">
        
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          
          <h2 className="text-2xl font-bold">
            AI Financial Insights
          </h2>
          
          <button
          onClick={
            handleGenerateInsights
          }
          disabled={loadingAI}
          className="bg-white text-black px-6 py-3 rounded-lg font-semibold"
          >

          {loadingAI
          ? "Generating..."
          : "Generate AI Insights"}

          </button>

        </div>

      <div className="bg-zinc-800 p-6 rounded-xl min-h-[120px]">
        
        {aiInsights ? (
          
          <div className="space-y-6">
            
            <div className="flex flex-col md:flex-row gap-4">
              
              <div className="bg-zinc-900 p-6 rounded-2xl flex-1 text-center">
                
                <h3 className="text-zinc-400 mb-2">
                  Financial Health Score
                </h3>
                
                <p className="text-5xl font-bold">
                  {score}/100
                </p>

              </div>

              <div className="bg-zinc-900 p-6 rounded-2xl flex-1 text-center">
                
                <h3 className="text-zinc-400 mb-2">
                  Rating
                </h3>

                <p className="text-3xl font-bold">
                  {rating}
                </p>

              </div>

            </div>

          <div>
            <h3 className="text-xl font-bold mb-3">
              AI Insights
            </h3>

            <div className="whitespace-pre-line text-zinc-300">
              
              {insightsText}

            </div>

          </div>

        </div>

        ) : (
          "Generate AI insights to analyze your financial habits."
        )}

      </div>

     </div>

    </MainLayout>
  );
}

export default Analytics;