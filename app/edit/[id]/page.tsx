"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";

type FoodRecord = {
  id: number;
  date: string;
  meal: string;
  alcohol: string;
  memo: string;
};

export default function EditPage() {
  const params = useParams();
  const router = useRouter();

  const id = Number(params.id);

  const [records, setRecords] = useState<FoodRecord[]>([]);

  const [date, setDate] = useState("");
  const [meal, setMeal] = useState("");
  const [alcohol, setAlcohol] = useState("");
  const [memo, setMemo] = useState("");

  useEffect(() => {
    const savedRecords: FoodRecord[] = JSON.parse(
      localStorage.getItem("records") || "[]"
    );

    setRecords(savedRecords);

    const record = savedRecords.find(
      (record) => record.id === id
    );

    if (record) {
      setDate(record.date);
      setMeal(record.meal);
      setAlcohol(record.alcohol);
      setMemo(record.memo);
    }
  }, [id]);

  const updateRecord = () => {
    const updatedRecords = records.map((item) =>
      item.id === id
        ? {
          ...item,
          date,
          meal,
          alcohol,
          memo,
        }
        : item
    );

    localStorage.setItem(
      "records",
      JSON.stringify(updatedRecords)
    );

    alert("更新しました！");

    router.push("/");
  };

  return (
    <main className="min-h-screen bg-gray-100 p-6">
      <div className="mx-auto max-w-2xl rounded-xl bg-white p-6 shadow-md">

        <Link
          href="/"
          className="mb-4 inline-block text-sm text-blue-600 hover:underline"
        >
          ← ホームへ戻る
        </Link>

        <h1 className="mb-6 text-2xl font-bold">
          ✏️ 記録編集
        </h1>

        <div className="space-y-4">

          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full rounded-lg border p-2"
          />

          <input
            type="text"
            value={meal}
            onChange={(e) => setMeal(e.target.value)}
            placeholder="食事"
            className="w-full rounded-lg border p-2"
          />

          <input
            type="text"
            value={alcohol}
            onChange={(e) => setAlcohol(e.target.value)}
            placeholder="お酒"
            className="w-full rounded-lg border p-2"
          />

          <textarea
            value={memo}
            onChange={(e) => setMemo(e.target.value)}
            placeholder="メモ"
            className="w-full rounded-lg border p-2"
          />

          <button
            onClick={updateRecord}
            className="w-full rounded-lg bg-blue-600 p-3 text-white"
          >
            更新する
          </button>

        </div>

      </div>
    </main>
  );
}