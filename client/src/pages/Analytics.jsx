import { useEffect, useState } from "react";

import MainLayout from "../layouts/MainLayout";

import jsPDF from "jspdf";

import { 
  isPaidPlan,
  isPremiumPlan,
} from "../utils/subscription";

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
  getAdvancedAnalytics,
  getSpendingAlerts,
  getFinancialForecast,
} from "../services/analyticsService";

function Analytics() {

  const [categoryData, setCategoryData] = useState([]);

  const [monthlyData, setMonthlyData] = useState([]);

  const [aiInsights, setAIInsights] = useState("");

  const [loadingAI, setLoadingAI] = useState(false);

  const [advancedAnalytics, setAdvancedAnalytics] = useState(null);

  const [alerts, setAlerts] = useState([]);

  const [forecast, setForecast] = useState(null);

  const [loadingAnalytics, setLoadingAnalytics] = useState(true);

  const [subscription, setSubscription] = useState(null);

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

      setLoadingAnalytics(true);

      try {

        const data =
          await getCategoryBreakdown();

        setCategoryData(data);

      } catch (error) {

        console.error(error);

      } finally {
        
        setLoadingAnalytics(false);

      }

  };

  const handleGenerateInsights =
  async () => {
    if (!isPaidPlan(subscription?.plan_name)) {
      alert(
        "AI Spending Insights is available on Pro and Premium plans."
      );
      return;
    }
    
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

  const fetchAdvancedAnalytics =
  async () => {
    
    try {
      
      const data = await getAdvancedAnalytics();

      setAdvancedAnalytics(data);

    } catch (error) {
      
      console.error(error);

    }

  };

  const fetchSpendingAlerts =
  async () => {
    
    try {
      
      const data = await getSpendingAlerts();

      setAlerts(data);

    } catch (error) {
      
      console.error(error);

    }

  };

  const fetchForecast =
  async () => {
    
    try {
      
      const data = await getFinancialForecast();

      setForecast(data);

    } catch (error) {
      
      console.error(error);

    }

  };

  const fetchSubscription =
  async () => {
    try {
      const token =
        localStorage.getItem("token");

      const response =
        await fetch(
          `${import.meta.env.VITE_API_URL}/subscriptions/current`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

      const data =
        await response.json();

      setSubscription(data);

    } catch (error) {
      console.error(
        "Failed to fetch subscription",
        error
      );
    }
  };
  
  useEffect(() => {

    fetchCategoryData();
    fetchMonthlyData();
    fetchAdvancedAnalytics();
    fetchSpendingAlerts();
    fetchForecast();
    fetchSubscription();
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
      "Vayqor Financial Report",
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
      "Vayqor-Report.pdf"
    );

  };

  return (
    <MainLayout>

      <h1 className="text-2xl md:text-4xl font-bold mb-8">
        Analytics
      </h1>

      {advancedAnalytics && (
        
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-10">
          
          <div className="bg-zinc-900 p-6 rounded-2xl transition duration-300 hover:-translate-y-1 hover:bg-zinc-800">
            <p className="text-zinc-400 mb-2">
              Average Expense
            </p>

            <h2 className="text-3xl font-bold">
              RM {advancedAnalytics.averageExpense}
            </h2>
          </div>

          <div className="bg-zinc-900 p-6 rounded-2xl transition duration-300 hover:-translate-y-1 hover:bg-zinc-800">
            <p className="text-zinc-400 mb-2">
              Savings Rate
            </p>

            <h2 className="text-3xl font-bold text-green-400">
              {advancedAnalytics.savingsRate}%
            </h2>
          </div>

          <div className="bg-zinc-900 p-6 rounded-2xl transition duration-300 hover:-translate-y-1 hover:bg-zinc-800">
            <p className="text-zinc-400 mb-2">
              Expense Ratio
            </p>

            <h2 className="text-3xl font-bold text-red-400">
              {advancedAnalytics.expenseRatio}%
            </h2>
          </div>

          <div className="bg-zinc-900 p-6 rounded-2xl transition duration-300 hover:-translate-y-1 hover:bg-zinc-800">
            <p className="text-zinc-400 mb-2">
              Highest Spending
            </p>

            <h2 className="text-2xl font-bold">
              {
              advancedAnalytics
              .highestSpendingCategory
              ?.category || "N/A"
              }
            </h2>
          </div>

        </div>

      )}

      {alerts.length > 0 && (
        
        <div className="space-y-4 mb-10">
          
          {alerts.map((alert, index) => (
            
            <div
             key={index}
             className={`p-5 rounded-2xl border transition duration-300 hover:-translate-y-1 ${
              alert.type === "danger"
              ? "bg-red-500/10 border-red-500/30"
              : alert.type === "warning"
              ? "bg-yellow-500/10 border-yellow-500/30"
              : "bg-green-500/10 border-green-500/30"
            }`}
            >

            <h2
            className={`text-xl font-bold mb-2 ${
              alert.type === "danger"
              ? "text-red-400"
              : alert.type === "warning"
              ? "text-yellow-400"
              : "text-green-400"
            }`}
            >
              {alert.title}
            </h2>

            <p className="text-zinc-300">
              {alert.message}
            </p>

          </div>

        ))}

      </div>

      )}

      {forecast && isPremiumPlan(subscription?.plan_name) && (
            
            <div className="bg-zinc-900 p-6 md:p-8 rounded-2xl mb-10 transition duration-300 hover:bg-zinc-800">
              
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
                
                <div>
                  
                  <h2 className="text-2xl font-bold mb-2">
                    Financial Forecast
                  </h2>

                  <p className="text-zinc-400">
                    {forecast.message}
                  </p>

                  <div className="mt-4 inline-block bg-blue-500/10 text-blue-400 px-4 py-2 rounded-full font-semibold">
                    {forecast.trend}
                  </div>

                </div>

              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                
                <div className="bg-zinc-800 p-6 rounded-2xl">
                  
                  <p className="text-zinc-400 mb-2">
                    Projected Income
                  </p>

                  <h2 className="text-3xl font-bold text-green-400">
                    RM {forecast.projectedIncome}
                  </h2>

                </div>

                <div className="bg-zinc-800 p-6 rounded-2xl">
                  
                  <p className="text-zinc-400 mb-2">
                    Projected Expenses
                  </p>

                  <h2 className="text-3xl font-bold text-red-400">
                    RM {forecast.projectedExpenses}
                  </h2>

                </div>

                <div className="bg-zinc-800 p-6 rounded-2xl">
                  
                  <p className="text-zinc-400 mb-2">
                    Projected Balance
                  </p>

                  <h2
                  className={`text-3xl font-bold ${
                    Number(
                      forecast.projectedBalance
                    ) >= 0
                    ? "text-blue-400"
                    : "text-red-400"
                  }`}
                  >
                    RM {forecast.projectedBalance}
                  </h2>

                </div>

              </div>

              <div className="mt-6 bg-zinc-800 p-5 rounded-2xl">
                
                <h3 className="text-xl font-bold mb-2">
                  Forecast Insight
                </h3>

                <p className="text-zinc-400">
                  {forecast.trendMessage}
                </p>

              </div>

            </div>

      )}

      {forecast && !isPremiumPlan(subscription?.plan_name) && (
        <div className="bg-zinc-900 p-6 md:p-8 rounded-2xl mb-10 border border-zinc-800">
          <p className="text-blue-400 font-semibold mb-3">
            Premium Feature
          </p>

          <h2 className="text-2xl font-bold mb-3">
            Unlock Financial Forecasting
          </h2>

          <p className="text-zinc-400 mb-6">
            Financial forecasting is available on the Premium plan. Upgrade to access future income, expense, and balance projections.
          </p>

          <a
           href="/pricing"
           className="inline-block bg-white text-black px-6 py-3 rounded-2xl font-bold transition duration-300 hover:scale-[1.02]"
          >
            Upgrade to Premium
          </a>
        </div>
      )}

      <div className="bg-zinc-900 p-6 md:p-8 rounded-2xl">

        <h2 className="text-2xl font-bold mb-6">
          Expense Categories
        </h2>

        <div className="w-full flex justify-center">
          
          {loadingAnalytics ? (
            <div className="text-zinc-500 py-20">
              Loading analytics data...
            </div>
          ) : categoryData.length > 0 ? (
            
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
          
          <div className="text-center py-20">
            
            <h2 className="text-2xl font-bold mb-3">
              No Analytics Data Yet
            </h2>

            <p className="text-zinc-400 max-w-xl mx-auto">
              Start adding transactions to unlock financial insights,
              spending analytics, AI recommendations, and forecasting.
            </p>

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
             : isPaidPlan(subscription?.plan_name)
             ? "Generate AI Insights"
             : "Upgrade to Pro"}

         </button>

         <button
           onClick={() => {
            
            if (
              !isPremiumPlan(
                subscription?.plan_name
              )
            ) {
              alert(
                "Advanced Financial Reports are available on Premium."
              );
              return;
            }

            downloadPDF();

           }}
           disabled={!aiInsights}
           className="bg-blue-500 text-white px-6 py-3 rounded-lg font-semibold transition duration-300 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
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