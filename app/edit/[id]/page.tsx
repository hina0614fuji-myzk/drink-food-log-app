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
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

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
        setIsLoading(false);
        return;
      }

      setIsLoading(false);

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

    setIsSaving(true);

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

  if (isLoading) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse">
          読み込み中...
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-red-50 px-4 py-6">
      <div className="mx-auto max-w-2xl">

        {/* ヘッダー：背景なし */}
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-3xl font-bold">
            ✏️ 記録編集
          </h1>

          <Link
            href="/"
            className="rounded-xl bg-white px-4 py-2 font-bold text-orange-500 shadow-sm"
          >
            ホームへ戻る
          </Link>
        </div>

      </div>

      {/* メイン：白背景カード */}
      <div className="space-y-4 rounded-xl bg-white p-6 shadow-md mx-auto max-w-2xl">

        <label className="mb-1 block font-medium">
          📅 日付
        </label>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="w-full rounded-lg border p-2"
        />

        <label className="mb-1 block font-medium">
          🍚 食事
        </label>
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

        <label className="mb-1 block font-medium">
          📝 メモ
        </label>
        <textarea
          value={memo}
          onChange={(e) => setMemo(e.target.value)}
          placeholder="メモ"
          className="w-full rounded-lg border p-2"
        />

        <button
          onClick={updateRecord}
          disabled={isSaving}
          className="w-full rounded-lg bg-blue-600 p-3 text-white disabled:opacity-50"
        >
          {isSaving ? "更新中..." : "更新する"}
        </button>

      </div>

    </main >
  );
}