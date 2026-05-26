"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import Link from "next/link";

type FoodRecord = {
  id: number;
  date: string;
  meal: string;
  memo: string;
  has_alcohol: boolean;
  alcohol_type: string | null;
  alcohol_amount: number | null;
  alcohol_unit: string | null;
  alcohol_note: string | null;
};

export default function Home() {
  const [records, setRecords] = useState<FoodRecord[]>([]);

  useEffect(() => {
    const fetchRecords = async () => {
      const { data, error } = await supabase
        .from("records")
        .select("*")
        .order("id", { ascending: false });

      if (error) {
        console.error(error);
        return;
      }

      setRecords(data);
    };

    fetchRecords();
  }, []);

  const deleteRecord = async (id: number) => {
    const { error } = await supabase
      .from("records")
      .delete()
      .eq("id", id);

    if (error) {
      alert("削除失敗: " + error.message);
      return;
    }

    const updatedRecords = records.filter(
      (record) => record.id !== id
    );

    setRecords(updatedRecords);

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
                  {record.has_alcohol
                    ? `${record.alcohol_type} ${record.alcohol_amount}${record.alcohol_unit}`
                    : "なし"}
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
