import { useState } from "react";

import MainLayout from "../layouts/MainLayout";

import toast from "react-hot-toast";

import {
  scanReceipt,
} from "../services/receiptService";

function ReceiptScanner() {

  const [file, setFile] =
    useState(null);

  const [loading, setLoading] =
    useState(false);

  const [result, setResult] =
    useState(null);

  const handleScan =
    async (e) => {

      e.preventDefault();

      if (!file) {
        toast.error("Please upload a receipt image first.");
        return;
      }

      try {

        setLoading(true);

        const data =
          await scanReceipt(file);

        setResult(data);

      } catch (error) {

        console.error(error);

      } finally {

        setLoading(false);

      }

    };

  return (
    <MainLayout>

      <div className="max-w-4xl mx-auto">

        <div className="mb-10">

          <p className="text-blue-400 font-semibold mb-2">
            OCR Receipt Scanner
          </p>

          <h1 className="text-4xl md:text-6xl font-extrabold mb-4">
            Scan Receipt
          </h1>

          <p className="text-zinc-400 max-w-2xl">
            Upload a receipt image and let Vayqor
            automatically extract transaction details.
          </p>

        </div>

        <form
          onSubmit={handleScan}
          className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6"
        >

          <input
            type="file"
            accept="image/*"
            onChange={(e) =>
              setFile(e.target.files[0])
            }
            className="mb-6 block w-full text-zinc-300"
          />

          <button
            type="submit"
            disabled={loading}
            className="bg-white text-black px-8 py-4 rounded-2xl font-bold transition duration-300 hover:scale-[1.02] disabled:opacity-50"
          >
            {loading
              ? "Scanning..."
              : "Scan Receipt"}
          </button>

        </form>

        {result && (

          <div className="mt-8 bg-zinc-900 border border-zinc-800 rounded-3xl p-6">

            <h2 className="text-2xl font-bold mb-6">
              Extracted Receipt Data
            </h2>

            <div className="space-y-4">

              <div>
                <p className="text-zinc-500 text-sm">
                  Merchant
                </p>

                <p className="text-xl">
                  {result.merchant}
                </p>
              </div>

              <div>
                <p className="text-zinc-500 text-sm">
                  Amount
                </p>

                <p className="text-xl">
                  RM {result.amount}
                </p>
              </div>

              <div>
                <p className="text-zinc-500 text-sm">
                  Date
                </p>

                <p className="text-xl">
                  {result.date}
                </p>
              </div>

              <div>
                <p className="text-zinc-500 text-sm">
                  Category
                </p>

                <p className="text-xl">
                  {result.category}
                </p>
              </div>

              <div>
                <p className="text-zinc-500 text-sm">
                  Description
                </p>

                <p className="text-xl">
                  {result.description}
                </p>
              </div>

            </div>

          </div>

        )}

      </div>

    </MainLayout>
  );

}

export default ReceiptScanner;