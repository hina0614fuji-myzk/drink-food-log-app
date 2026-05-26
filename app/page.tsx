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
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchRecords = async () => {
      const { data, error } = await supabase
        .from("records")
        .select("*")
        .order("id", { ascending: false });

      if (error) {
        console.error(error);
        setIsLoading(false);
        return;
      }

      setRecords(data);
      setIsLoading(false);
    };

    fetchRecords();
  }, []);

  const deleteRecord = async (id: number) => {

    const confirmed = window.confirm(
      "本当に削除しますか？"
    );

    if (!confirmed) {
      return;
    }

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
            🍺 夜ごはん・お酒記録
          </h1>

          <Link
            href="/add"
            className="rounded-lg bg-blue-600 px-4 py-2 font-medium text-white transition hover:bg-blue-700">
            + 記録追加
          </Link>
        </div>

        {/* 記録一覧を表示する */}
        <div className="space-y-4">

          {isLoading ? (

            <div className="space-y-4">

              {[1, 2, 3].map((item) => (
                <div
                  key={item}
                  className="animate-pulse rounded-xl bg-white p-5 shadow-md"
                >
                  <div className="mb-3 h-4 w-24 rounded bg-gray-200" />

                  <div className="space-y-2">
                    <div className="h-4 w-3/4 rounded bg-gray-200" />
                    <div className="h-4 w-1/2 rounded bg-gray-200" />
                    <div className="h-4 w-2/3 rounded bg-gray-200" />
                  </div>
                </div>
              ))}

            </div>

          ) : records.length === 0 ? (

            <div className="rounded-xl bg-white p-8 text-center shadow">
              <p className="text-lg font-semibold">
                🍺 まだ記録がありません
              </p>

              <p className="mt-2 text-gray-500">
                最初の記録を追加してみましょう！
              </p>
            </div>

          ) : (

            // 既存のカード
            records.map((record) => (
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
            ))
          )}
        </div>
      </div>
    </main>
  );
}
