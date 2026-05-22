import { useEffect, useState } from "react";

import MainLayout from "../layouts/MainLayout";

import jsPDF from "jspdf";

import {
  getAIInsights,
} from "../services/aiService";

import {
  PieChart,
  Pie,
  Tooltip,
  ResponsiveContainer,
  Cell,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
} from "recharts";

import {
  getCategoryBreakdown,
  getMonthlyAnalytics,
} from "../services/analyticsService";

function Analytics() {

  const [categoryData, setCategoryData] = useState([]);

  const [monthlyData, setMonthlyData] = useState([]);

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

  const fetchMonthlyData =
  async () => {
    
    try {
      
      const data =
      await getMonthlyAnalytics();

      setMonthlyData(data);

    } catch (error) {
      
      console.error(error);

    }

  };
  
  useEffect(() => {

    fetchCategoryData();
    fetchMonthlyData();

  }, []);

  const COLORS = [
    "#3b82f6",
    "#22c55e",
    "#f59e0b",
    "#ef4444",
    "#a855f7",
  ];

  const downloadPDF = () => {
    
    const doc = new jsPDF();
    
    doc.setFontSize(22);

    doc.text(
      "FinSight AI Financial Report",
      20,
      20
    );

    doc.setFontSize(16);

    doc.text(
      `Financial Health Score: ${score}/100`,
      20,
      40
    );

    doc.text(
      `Rating: ${rating}`,
      20,
      55
    );

    doc.setFontSize(14);

    doc.text(
      "AI Insights:",
      20,
      75
    );

    const splitText =
    doc.splitTextToSize(
      insightsText,
      170
    );

    doc.text(
      splitText,
      20,
      90
    );

    doc.save(
      "FinSight-AI-Report.pdf"
    );

  };

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
          
          {categoryData.length > 0 ? (
            
            <div className="w-full max-w-[400px] aspect-square">
              
              <ResponsiveContainer
              width="100%"
              height="100%"
              >
                
                <PieChart>
                  
                  <Pie
                  animationDuration={1200}
                  data={categoryData.map(
                    (item) => ({
                      ...item,
                      total: Number(item.total),
                    })
                  )}
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
                          index %
                          COLORS.length
                        ]
                      }
                      />

                      )
                    )}

                  </Pie>

                <Tooltip
                  contentStyle={{
                    backgroundColor: "#18181b",
                    border: "1px solid #27272a",
                    borderRadius: "12px",
                    color: "#fff",
                  }} 
                />

                </PieChart>

              </ResponsiveContainer>

            </div>

          ) : (
          
          <div className="text-zinc-500 py-20">
            
            No analytics data available.

          </div>

          )}

        </div>

      </div>

      <div className="mt-10 bg-zinc-900 p-6 md:p-8 rounded-2xl">
        
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        
        <h2 className="text-2xl font-bold">
          AI Financial Insights
        </h2>
        
        <div className="flex flex-col md:flex-row gap-4">
          
          <button
          onClick={
            handleGenerateInsights
          }
          disabled={loadingAI}
          className="bg-white text-black px-6 py-3 rounded-lg font-semibold transition duration-300 hover:scale-[1.02]"
          >
            
            {loadingAI
            ? "Generating..."
            : "Generate AI Insights"}

         </button>

         <button
         onClick={downloadPDF}
         className="bg-blue-500 text-white px-6 py-3 rounded-lg font-semibold transition duration-300 hover:scale-[1.02]"
         >
          Download PDF Report

        </button>

       </div>

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

     <div className="mt-10 bg-zinc-900 p-6 md:p-8 rounded-2xl">
      
      <h2 className="text-2xl font-bold mb-6">
        Monthly Financial Trends
      </h2>
      
      <div className="w-full h-[350px]">
        
        {monthlyData.length > 0 ? (
          
          <ResponsiveContainer
          width="100%"
          height="100%"
          >
            
            <LineChart 
              data={monthlyData}
            >
              
              <CartesianGrid
              strokeDasharray="3 3"
              />
              
              <XAxis dataKey="month" />

              <YAxis />

              <Tooltip
                contentStyle={{
                    backgroundColor: "#18181b",
                    border: "1px solid #27272a",
                    borderRadius: "12px",
                    color: "#fff",
                  }} 
                />

              <Legend />

              <Line
              animationDuration={1200}
              type="monotone"
              dataKey="income"
              stroke="#22c55e"
              strokeWidth={4}
              dot={{
                r: 5,
                strokeWidth: 2,
              }}
              activeDot={{
                r:7,
              }}
              />

              <Line
              animationDuration={1200}
              type="monotone"
              dataKey="expenses"
              stroke="#ef4444"
              strokeWidth={4}
              dot={{
                r: 5,
                strokeWidth: 2,
              }}
              activeDot={{
                r: 7,
              }}
              />

            </LineChart>

          </ResponsiveContainer>

        ) : (
        
        <div className="flex items-center justify-center h-full text-zinc-500">
          No monthly trend data available.
        </div>
      )}

      </div>

      </div>

    </MainLayout>
  );
}

export default Analytics;