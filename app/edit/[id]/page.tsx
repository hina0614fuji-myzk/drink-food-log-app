"use client";

import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { useParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";

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

export default function EditPage() {
  const params = useParams();
  const router = useRouter();

  const id = Number(params.id);

  const [date, setDate] = useState("");
  const [meal, setMeal] = useState("");
  const [hasAlcohol, setHasAlcohol] = useState(false);
  const [alcoholType, setAlcoholType] = useState("");
  const [alcoholAmount, setAlcoholAmount] = useState("");
  const [alcoholUnit, setAlcoholUnit] = useState("杯");
  const [alcoholNote, setAlcoholNote] = useState("");
  const [memo, setMemo] = useState("");

  useEffect(() => {
    const fetchRecord = async () => {
      const { data, error } = await supabase
        .from("records")
        .select("*")
        .eq("id", id)
        .single();

      if (error) {
        alert("データ取得失敗: " + error.message);
        return;
      }

      setDate(data.date);
      setMeal(data.meal);
      setHasAlcohol(data.has_alcohol);
      setAlcoholType(data.alcohol_type ?? "");
      setAlcoholAmount(
        data.alcohol_amount ? String(data.alcohol_amount) : ""
      );
      setAlcoholUnit(data.alcohol_unit ?? "杯");
      setAlcoholNote(data.alcohol_note ?? "");
      setMemo(data.memo);
    };

    fetchRecord();
  }, [id]);

  const updateRecord = async () => {
    if (!meal.trim()) {
      alert("食事を入力してください");
      return;
    }

    const { error } = await supabase
      .from("records")
      .update({
        date,
        meal,
        memo,
        has_alcohol: hasAlcohol,
        alcohol_type: hasAlcohol ? alcoholType : null,
        alcohol_amount:
          hasAlcohol && alcoholAmount
            ? Number(alcoholAmount)
            : null,
        alcohol_unit: hasAlcohol ? alcoholUnit : null,
        alcohol_note: hasAlcohol ? alcoholNote : null,
      })
      .eq("id", id);

    if (error) {
      alert("更新失敗: " + error.message);
      return;
    }

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

          <div>
            <label className="mb-2 block font-medium">
              🍺 飲酒
            </label>

            <div className="flex gap-4">
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  checked={!hasAlcohol}
                  onChange={() => setHasAlcohol(false)}
                />
                なし
              </label>

              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  checked={hasAlcohol}
                  onChange={() => setHasAlcohol(true)}
                />
                あり
              </label>
            </div>
          </div>

          {hasAlcohol && (
            <div className="space-y-4 rounded-lg border p-4">
              <div>
                <label className="mb-1 block font-medium">種類</label>
                <select
                  value={alcoholType}
                  onChange={(e) => setAlcoholType(e.target.value)}
                  className="w-full rounded-lg border p-2"
                >
                  <option value="">選択してください</option>
                  <option value="ビール">ビール</option>
                  <option value="焼酎">焼酎</option>
                  <option value="ハイボール">ハイボール</option>
                  <option value="ワイン">ワイン</option>
                  <option value="日本酒">日本酒</option>
                  <option value="その他">その他</option>
                </select>
              </div>

              <div>
                <label className="mb-1 block font-medium">量</label>
                <input
                  type="number"
                  value={alcoholAmount}
                  onChange={(e) => setAlcoholAmount(e.target.value)}
                  className="w-full rounded-lg border p-2"
                />
              </div>

              <div>
                <label className="mb-1 block font-medium">単位</label>
                <select
                  value={alcoholUnit}
                  onChange={(e) => setAlcoholUnit(e.target.value)}
                  className="w-full rounded-lg border p-2"
                >
                  <option value="杯">杯</option>
                  <option value="本">本</option>
                  <option value="缶">缶</option>
                  <option value="ml">ml</option>
                </select>
              </div>

              <div>
                <label className="mb-1 block font-medium">補足</label>
                <input
                  type="text"
                  value={alcoholNote}
                  onChange={(e) => setAlcoholNote(e.target.value)}
                  placeholder="ロック、濃いめなど"
                  className="w-full rounded-lg border p-2"
                />
              </div>
            </div>
          )}

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