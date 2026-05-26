"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type FoodRecord = {
  id: number;
  date: string;
  meal: string;
  alcohol: string;
  memo: string;
};

export default function Home() {
  const [records, setRecords] = useState<FoodRecord[]>([]);

  useEffect(() => {
    const savedRecords = localStorage.getItem("records");

    if (savedRecords) {
      setRecords(JSON.parse(savedRecords));
    }
  }, []);

  const deleteRecord = (id: number) => {
    const updatedRecords = records.filter(
      (record) => record.id !== id
    );

    setRecords(updatedRecords);

    localStorage.setItem(
      "records",
      JSON.stringify(updatedRecords)
    );
  };

  return (
    <main className="min-h-screen bg-gray-100 p-6">
      <div className="mx-auto max-w-2xl">
        {/* ヘッダー */}
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-3xl font-bold">
            🍺 お酒・ごはん記録
          </h1>

          <Link
            href="/add"
            className="rounded-lg bg-blue-600 px-4 py-2 font-medium text-white transition hover:bg-blue-700">
            + 記録追加
          </Link>
        </div>

        {/* 記録一覧を表示する */}
        <div className="space-y-4">
          {records.map((record) => (
            <div
              key={record.id}
              className="rounded-xl bg-white p-5 shadow-md"
            >
              <p className="mb-2 text-sm text-gray-500">
                {record.date}
              </p>

              <div className="space-y-1">
                <p>
                  <span className="font-semibold">🍚 食事：</span>
                  {record.meal}
                </p>

                <p>
                  <span className="font-semibold">🍺 お酒：</span>
                  {record.alcohol}
                </p>

                <p>
                  <span className="font-semibold">📝 メモ：</span>
                  {record.memo}
                </p>
              </div>

              <div className="mt-4 flex justify-end gap-2">

                <Link
                  href={`/edit/${record.id}`}
                  className="rounded-lg bg-yellow-500 px-3 py-2 text-sm text-white hover:bg-yellow-600"
                >
                  編集
                </Link>

                <button
                  onClick={() => deleteRecord(record.id)}
                  className="rounded-lg bg-red-500 px-3 py-2 text-sm text-white hover:bg-red-600"
                >
                  削除
                </button>

              </div>

            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
