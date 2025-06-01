"use client";

import { useState } from "react";
import {
  bagidua,
  regulaFalsi,
  iterasiSederhana,
  newtonRaphson,
  secant,
} from "./utils/metodeNumerik";
import "./index.css";

const metodeList = [
  {
    value: "Bagidua",
    label: "Metode Bagidua",
    //description: "Mencari akar dengan membagi interval menjadi dua bagian",
  },
  {
    value: "Regula Falsi",
    label: "Metode Regula Falsi",
    //description: "Menggunakan interpolasi linear untuk mencari akar",
  },
  {
    value: "Iterasi Sederhana",
    label: "Metode Iterasi Sederhana",
    //description: "Menggunakan fungsi iterasi g(x) untuk mencari titik tetap",
  },
  {
    value: "Newton-Raphson",
    label: "Metode Newton-Raphson",
    //description: "Menggunakan turunan fungsi untuk konvergensi cepat",
  },
  {
    value: "Secant",
    label: "Metode Secant",
    //description: "Aproksimasi Newton-Raphson tanpa turunan eksplisit",
  },
];

function App() {
  const [metode, setMetode] = useState("Bagidua");
  const [fungsi, setFungsi] = useState("x^3 - x - 2");
  const [gx, setGx] = useState("(x+2)^(1/3)");
  const [x0, setX0] = useState(1);
  const [x1, setX1] = useState(2);
  const [galat, setGalat] = useState(0.001);
  const [hasil, setHasil] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const selectedMethod = metodeList.find((m) => m.value === metode);

  const hitung = async () => {
    setIsLoading(true);
    setError("");
    setHasil(null);

    try {
      await new Promise((resolve) => setTimeout(resolve, 500)); // Simulate calculation time

      let result;
      switch (metode) {
        case "Bagidua":
          result = bagidua(Number(x0), Number(x1), fungsi, Number(galat));
          break;
        case "Regula Falsi":
          result = regulaFalsi(Number(x0), Number(x1), fungsi, Number(galat));
          break;
        case "Iterasi Sederhana":
          result = iterasiSederhana(Number(x0), gx, Number(galat));
          break;
        case "Newton-Raphson":
          result = newtonRaphson(Number(x0), fungsi, Number(galat));
          break;
        case "Secant":
          result = secant(Number(x0), Number(x1), fungsi, Number(galat));
          break;
        default:
          throw new Error("Metode tidak valid");
      }

      if (!isFinite(result[0])) {
        throw new Error(
          "Tidak dapat menemukan akar dengan parameter yang diberikan"
        );
      }

      setHasil({ metode, result });
    } catch (err) {
      setError(err.message || "Terjadi kesalahan dalam perhitungan");
    } finally {
      setIsLoading(false);
    }
  };

  const getTableHeaders = () => {
    switch (metode) {
      case "Bagidua":
        return ["r", "a", "c", "b", "f(a)", "f(c)", "f(b)", "Lebar Interval"];
      case "Regula Falsi":
        return ["r", "a", "c", "b", "f(a)", "f(b)", "f(c)", "Error"];
      case "Newton-Raphson":
        return ["i", "x", "f(x)", "f'(x)", "x baru", "Error"];
      case "Secant":
        return ["i", "x0", "x1", "f(x0)", "f(x1)", "x baru", "Error"];
      default:
        return [];
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            Kalkulator Metode Numerik
          </h1>
        </div>

        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Input Panel */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-xl p-6">
              {/* <h2 className="text-2xl font-semibold text-gray-800 mb-6">
                Parameter Input
              </h2> */}

              {/* Method Selection */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Pilih Metode
                </label>
                <select
                  className="w-full border-2 border-gray-200 rounded-lg p-3 focus:border-blue-500 focus:outline-none transition-colors"
                  value={metode}
                  onChange={(e) => setMetode(e.target.value)}
                >
                  {metodeList.map((m, idx) => (
                    <option key={idx} value={m.value}>
                      {m.label}
                    </option>
                  ))}
                </select>
                {selectedMethod && (
                  <p className="text-sm text-gray-500 mt-1">
                    {selectedMethod.description}
                  </p>
                )}
              </div>

              {/* Function Input */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Fungsi f(x)
                </label>
                <input
                  className="w-full border-2 border-gray-200 rounded-lg p-3 focus:border-blue-500 focus:outline-none transition-colors font-mono"
                  placeholder="Contoh: x^3 - x - 2"
                  value={fungsi}
                  onChange={(e) => setFungsi(e.target.value)}
                />
                <p className="text-xs text-gray-500 mt-1">
                  Gunakan ^ untuk pangkat, * untuk perkalian
                </p>
              </div>

              {/* g(x) for Simple Iteration */}
              {metode === "Iterasi Sederhana" && (
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Fungsi g(x) untuk Iterasi
                  </label>
                  <input
                    className="w-full border-2 border-gray-200 rounded-lg p-3 focus:border-blue-500 focus:outline-none transition-colors font-mono"
                    placeholder="Contoh: (x+2)^(1/3)"
                    value={gx}
                    onChange={(e) => setGx(e.target.value)}
                  />
                </div>
              )}

              {/* Initial Values */}
              <div className="grid grid-cols-1 gap-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nilai Awal x₀
                  </label>
                  <input
                    type="number"
                    step="any"
                    className="w-full border-2 border-gray-200 rounded-lg p-3 focus:border-blue-500 focus:outline-none transition-colors"
                    value={x0}
                    onChange={(e) => setX0(e.target.value)}
                  />
                </div>

                {(metode === "Bagidua" ||
                  metode === "Regula Falsi" ||
                  metode === "Secant") && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nilai Awal x₁
                    </label>
                    <input
                      type="number"
                      step="any"
                      className="w-full border-2 border-gray-200 rounded-lg p-3 focus:border-blue-500 focus:outline-none transition-colors"
                      value={x1}
                      onChange={(e) => setX1(e.target.value)}
                    />
                  </div>
                )}
              </div>

              {/* Error Tolerance */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Toleransi Error
                </label>
                <input
                  type="number"
                  step="any"
                  className="w-full border-2 border-gray-200 rounded-lg p-3 focus:border-blue-500 focus:outline-none transition-colors"
                  value={galat}
                  onChange={(e) => setGalat(e.target.value)}
                />
              </div>

              {/* Calculate Button */}
              <button
                onClick={hitung}
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 px-6 rounded-lg font-semibold hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-4 focus:ring-blue-300 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Menghitung...
                  </div>
                ) : (
                  "Hitung Akar Persamaan"
                )}
              </button>

              {/* Error Display */}
              {error && (
                <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-red-700 text-sm">{error}</p>
                </div>
              )}
            </div>
          </div>

          {/* Results Panel */}
          <div className="lg:col-span-2">
            {hasil ? (
              <div className="bg-white rounded-2xl shadow-xl p-6">
                <h2 className="text-2xl font-semibold text-gray-800 mb-6">
                  Hasil Perhitungan Metode {hasil.metode}
                </h2>

                {/* Result Summary */}
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg p-6 mb-6">
                  <div className="flex items-center mb-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full mr-3"></div>
                    <h3 className="text-lg font-semibold text-green-800">
                      Akar Ditemukan
                    </h3>
                  </div>
                  <p className="text-3xl font-bold text-green-700">
                    x ={" "}
                    {typeof hasil.result[0] === "number"
                      ? hasil.result[0].toFixed(6)
                      : hasil.result[0]}
                  </p>
                  <p className="text-sm text-green-600 mt-1">
                    Fungsi: f(
                    {typeof hasil.result[0] === "number"
                      ? hasil.result[0].toFixed(6)
                      : hasil.result[0]}
                    ) ≈ 0
                  </p>
                </div>

                {/* Iteration Table */}
                {Array.isArray(hasil.result[1]) &&
                  hasil.result[1].length > 0 && (
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800 mb-4">
                        Tabel Iterasi ({hasil.result[1].length} iterasi)
                      </h3>
                      <div className="overflow-x-auto bg-gray-50 rounded-lg">
                        <table className="w-full text-sm text-center">
                          <thead className="bg-gray-200">
                            <tr>
                              {getTableHeaders().map((header, i) => (
                                <th
                                  key={i}
                                  className="p-3 text-center font-semibold text-gray-700 border-b"
                                >
                                  {header}
                                </th>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            {hasil.result[1].map((row, i) => (
                              <tr
                                key={i}
                                className={`${
                                  i % 2 === 0 ? "bg-white" : "bg-gray-50"
                                } hover:bg-blue-50 transition-colors`}
                              >
                                <td className="p-3 border-b font-medium text-gray-600">
                                  {i}
                                </td>
                                {row.map((val, j) => (
                                  <td
                                    key={j}
                                    className="p-3 border-b font-mono text-gray-800"
                                  >
                                    {typeof val === "number"
                                      ? val.toFixed(6)
                                      : val}
                                  </td>
                                ))}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}
              </div>
            ) : (
              <div className="bg-white rounded-2xl shadow-xl p-6">
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg
                      className="w-8 h-8 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-600 mb-2">
                    Belum Ada Hasil
                  </h3>
                  <p className="text-gray-500">
                    Masukkan parameter dan klik "Hitung Akar Persamaan" untuk
                    melihat hasil
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-12 text-gray-500">
          <p>3IA14 - Kelompok 3</p>
        </div>
      </div>
    </div>
  );
}

export default App;
