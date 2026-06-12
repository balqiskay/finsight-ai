import { useEffect, useState } from "react";

import { useNavigate } from "react-router-dom";

import MainLayout from "../layouts/MainLayout";

import { isPaidPlan } from "../utils/subscription";

import {
  addTransaction,
} from "../services/transactionService";

import {
  scanReceipt,
} from "../services/receiptService";

import {
  UploadCloud,
  Receipt,
  Sparkles,
  X,
  Store,
  Calendar,
  Wallet,
  Tags,
  FileText,
  Crown,
} from "lucide-react";

function ReceiptScanner() {
  const navigate = useNavigate();
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [creatingTransaction, setCreatingTransaction] = useState(false);
  const [result, setResult] = useState(null);
  const [reviewData, setReviewData] =
  useState({
    merchant: "",
    amount: "",
    date: "",
    category: "",
    description: "",
  });

  const [creatingTransaction, setCreatingTransaction] = useState(false);

  const [subscription, setSubscription] = useState(null);
  const [loadingSubscription, setLoadingSubscription] = useState(true);

  const [statusMessage, setStatusMessage] = useState(null);

  const showStatus = (type, title, message) => {
    setStatusMessage({
      type,
      title,
      message,
    });

    setTimeout(() => {
      setStatusMessage(null);
    }, 4000);
  };

  const handleFileChange = (selectedFile) => {
    if (!selectedFile) return;

    if (!selectedFile.type.startsWith("image/")) {
      showStatus(
        "error",
        "Invalid file type",
        "Please upload a receipt image."
      );
      return;
    }

    setFile(selectedFile);
    setResult(null);
    setStatusMessage(null);
    setPreview(URL.createObjectURL(selectedFile));
  };

  const handleScan = async (e) => {
    e.preventDefault();

    if (!file) {
      showStatus(
        "error",
        "Receipt image required",
        "Please upload a receipt image before scanning."
      );
      return;
    }

    try {
      setLoading(true);
      setStatusMessage(null);

      const data = await scanReceipt(file);

      setResult(data);

      setReviewData({
        merchant: data.merchant || "",
        amount: data.amount || "",
        date: data.date || "",
        category: data.category || "",
        description: data.description || "",
      });

      showStatus(
        "success",
        "Receipt scanned successfully",
        "Vayqor extracted the transaction details from your receipt."
      );
    } catch (error) {
      console.error(error);

      showStatus(
        "error",
        "Failed to scan receipt",
        "Please try again with a clearer receipt image."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchSubscription = async () => {
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
      } finally {
        setLoadingSubscription(false);
      }
    };

    fetchSubscription();
  }, []);

  if (loadingSubscription) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8 text-center">
            <Sparkles className="text-blue-400 mx-auto mb-4 animate-pulse" size={32} />

            <p className="text-zinc-400">
              Checking your Vayqor plan...
            </p>
          </div>
        </div>
      </MainLayout>
    );
  }

  if (!isPaidPlan(subscription?.plan_name)) {
    return (
      <MainLayout>
        <div className="max-w-2xl mx-auto mt-10">
          <div className="bg-gradient-to-br from-blue-500/10 to-purple-500/10 border border-blue-500/20 rounded-[2rem] p-8 sm:p-10 text-center">
            <Crown className="text-blue-400 mx-auto mb-5" size={40} />

            <p className="text-blue-400 font-semibold mb-3">
              Pro Feature
            </p>

            <h1 className="text-3xl sm:text-4xl font-extrabold mb-4">
              Unlock AI Receipt Scanning
            </h1>

            <p className="text-zinc-400 mb-8 max-w-xl mx-auto">
              Receipt scanning is available on Pro and Premium plans.
              Upload receipts and let Vayqor extract merchant, amount,
              date, category, and description automatically.
            </p>

            <a
              href="/pricing"
              className="inline-block bg-white text-black px-8 py-4 rounded-2xl font-bold hover:scale-[1.02] transition"
            >
              View Plans
            </a>
          </div>
        </div>
      </MainLayout>
    );
  }

  const handleCreateTransaction =
  async () => {
    if (
      !reviewData.amount ||
      !reviewData.date ||
      !reviewData.category
    ) {
      showStatus(
        "error",
        "Missing transaction details",
        "Amount, date, and category are required before creating a transaction."
      );
      return;
    }

    try {
      setCreatingTransaction(true);

      await addTransaction({
        type: "expense",
        category: reviewData.category,
        amount: reviewData.amount,
        description:
          reviewData.description ||
          reviewData.merchant ||
          "Receipt transaction",
        transaction_date: reviewData.date,
      });

      showStatus(
        "success",
        "Transaction created",
        "Receipt data has been saved as a transaction."
      );

      setTimeout(() => {
        navigate("/transactions");
      }, 900);

    } catch (error) {
      console.error(error);

      showStatus(
        "error",
        "Failed to create transaction",
        "Please check the receipt details and try again."
      );
    } finally {
      setCreatingTransaction(false);
    }
  };

  return (
    <MainLayout>
      <div className="max-w-6xl mx-auto space-y-8">

        <div>
          <p className="text-blue-400 font-semibold mb-2">
            AI Receipt Intelligence
          </p>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight">
            Receipt Scanner
          </h1>

          <p className="text-zinc-400 max-w-2xl mt-4 leading-relaxed">
            Upload a receipt image and let Vayqor extract transaction details
            automatically using AI-powered scanning.
          </p>
        </div>

        {statusMessage && (
          <div
            className={`rounded-3xl border p-5 ${
              statusMessage.type === "success"
                ? "bg-green-500/10 border-green-500/30"
                : "bg-red-500/10 border-red-500/30"
            }`}
          >
            <p
              className={`font-semibold mb-1 ${
                statusMessage.type === "success"
                  ? "text-green-400"
                  : "text-red-400"
              }`}
            >
              {statusMessage.title}
            </p>

            <p className="text-zinc-400 text-sm">
              {statusMessage.message}
            </p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          <form
            onSubmit={handleScan}
            className="bg-zinc-900 border border-zinc-800 rounded-[2rem] p-6 sm:p-8"
          >
            <div className="mb-6">
              <p className="text-blue-400 font-semibold mb-2">
                Upload Receipt
              </p>

              <h2 className="text-2xl font-bold">
                Scan a receipt image
              </h2>

              <p className="text-zinc-500 text-sm mt-2">
                JPG, PNG, or mobile camera image supported.
              </p>
            </div>

            <label className="group relative flex flex-col items-center justify-center min-h-[260px] border-2 border-dashed border-zinc-700 rounded-[2rem] bg-zinc-950 hover:border-blue-500/50 hover:bg-zinc-900 transition cursor-pointer p-6 text-center">
              <input
                type="file"
                accept="image/*"
                capture="environment"
                onChange={(e) =>
                  handleFileChange(e.target.files[0])
                }
                className="hidden"
              />

              {preview ? (
                <div className="relative w-full">
                  <img
                    src={preview}
                    alt="Receipt preview"
                    className="max-h-[260px] mx-auto rounded-2xl object-contain border border-zinc-800"
                  />

                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      setFile(null);
                      setPreview(null);
                      setResult(null);
                    }}
                    className="absolute top-3 right-3 bg-black/70 text-white p-2 rounded-xl"
                  >
                    <X size={18} />
                  </button>
                </div>
              ) : (
                <>
                  <div className="w-16 h-16 rounded-3xl bg-blue-500/10 text-blue-400 flex items-center justify-center mb-5 group-hover:bg-blue-500/20 transition">
                    <UploadCloud size={34} />
                  </div>

                  <h3 className="text-xl font-bold mb-2">
                    Drop or upload your receipt
                  </h3>

                  <p className="text-zinc-500 max-w-sm">
                    Choose a clear receipt photo so Vayqor can extract accurate transaction data.
                  </p>
                </>
              )}
            </label>

            {file && (
              <div className="mt-5 bg-zinc-950 border border-zinc-800 rounded-2xl p-4">
                <p className="text-zinc-500 text-sm">
                  Selected file
                </p>

                <p className="text-white font-semibold mt-1 truncate">
                  {file.name}
                </p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="mt-6 w-full bg-white text-black px-8 py-4 rounded-2xl font-bold transition duration-300 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading
                ? "Scanning receipt..."
                : "Scan Receipt"}
            </button>

            {loading && (
              <div className="mt-6 bg-blue-500/10 border border-blue-500/20 rounded-2xl p-5">
                <div className="flex items-center gap-4">
                  <Sparkles className="text-blue-400 animate-pulse" size={26} />

                  <div>
                    <p className="text-blue-400 font-semibold">
                      Vayqor is reading your receipt...
                    </p>

                    <p className="text-zinc-500 text-sm mt-1">
                      Detecting merchant, amount, date, category, and description.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </form>

          <div className="bg-zinc-900 border border-zinc-800 rounded-[2rem] p-6 sm:p-8">
            <p className="text-purple-400 font-semibold mb-2">
              Extracted Data
            </p>

            <h2 className="text-2xl font-bold mb-6">
              Receipt Summary
            </h2>

            {result ? (
              <div className="space-y-4">
                
                <ReviewInput
                 label="Merchant"
                 value={reviewData.merchant}
                 onChange={(value) =>
                  setReviewData({
                    ...reviewData,
                    merchant: value,
                  })
                 }
                />

                <ReviewInput
                 label="Amount"
                 type="number"
                 required
                 value={reviewData.amount}
                 onChange={(value) =>
                  setReviewData({
                    ...reviewData,
                    amount: value,
                  })
                 }
                />

                <ReviewInput
                 label="Date"
                 type="date"
                 required
                 value={reviewData.date}
                 onChange={(value) =>
                  setReviewData({
                    ...reviewData,
                    date: value,
                  })
                 }
                />

                <ReviewInput
                 label="Category"
                 required
                 value={reviewData.category}
                 onChange={(value) =>
                  setReviewData({
                    ...reviewData,
                    category: value,
                  })
                 }
                />

                <div>
                  <p className="text-zinc-500 text-sm mb-2">
                    Description
                  </p>

                  <textarea
                   value={reviewData.description}
                   onChange={(e) =>
                    setReviewData({
                      ...reviewData,
                      description: e.target.value,
                    })
                   }
                   className="w-full bg-zinc-950 border border-zinc-800 rounded-2xl p-4 outline-none focus:border-blue-500/50 resize-none h-24"
                  />
                </div>

                <button
                 onClick={handleCreateTransaction}
                 disabled={creatingTransaction}
                 className="w-full mt-4 bg-white text-black px-6 py-4 rounded-2xl font-bold hover:scale-[1.02] transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {creatingTransaction
                  ? "Creating Transaction..."
                  : "Create Transaction"}
                </button>

              </div>
            ) : (
              <div className="min-h-[320px] flex flex-col items-center justify-center text-center">
                <div className="w-16 h-16 rounded-3xl bg-purple-500/10 text-purple-400 flex items-center justify-center mb-5">
                  <Receipt size={32} />
                </div>

                <h3 className="text-xl font-bold mb-2">
                  No receipt scanned yet
                </h3>

                <p className="text-zinc-500 max-w-sm">
                  Upload and scan a receipt to see extracted transaction details here.
                </p>
              </div>
            )}
          </div>

        </div>

      </div>
    </MainLayout>
  );
}

function ReceiptItem({ icon, label, value }) {
  return (
    <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-5 flex items-start gap-4">
      <div className="w-11 h-11 rounded-2xl bg-blue-500/10 text-blue-400 flex items-center justify-center flex-shrink-0">
        {icon}
      </div>

      <div>
        <p className="text-zinc-500 text-sm mb-1">
          {label}
        </p>

        <p className="text-lg font-bold text-white break-words">
          {value}
        </p>
      </div>
    </div>
  );
}

function ReviewInput({
  label,
  value,
  onChange,
  type = "text",
  required = false,
}) {
  const hasError =
    required && !value;

  return (
    <div>
      <p className="text-zinc-500 text-sm mb-2">
        {label}
        {required && (
          <span className="text-red-400"> *</span>
        )}
      </p>

      <input
        type={type}
        value={value}
        onChange={(e) =>
          onChange(e.target.value)
        }
        className={`w-full bg-zinc-950 border rounded-2xl p-4 outline-none focus:border-blue-500/50 ${
          hasError
            ? "border-red-500/60"
            : "border-zinc-800"
        }`}
      />

      {hasError && (
        <p className="text-red-400 text-sm mt-2">
          {label} is required.
        </p>
      )}
    </div>
  );
}

export default ReceiptScanner;