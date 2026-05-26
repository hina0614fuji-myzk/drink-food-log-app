"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function AddPage() {
    const today = new Date().toISOString().split("T")[0];

    const [date, setDate] = useState(today);
    const [meal, setMeal] = useState("");
    const [alcohol, setAlcohol] = useState("");
    const [memo, setMemo] = useState("");

    const router = useRouter();
    const [isSaving, setIsSaving] = useState(false);

    const saveRecord = () => {
        setIsSaving(true);

        const newRecord = {
            id: Date.now(),
            date,
            meal,
            alcohol,
            memo,
        };

        const savedRecords = JSON.parse(
            localStorage.getItem("records") || "[]"
        );

        savedRecords.unshift(newRecord);

        localStorage.setItem(
            "records",
            JSON.stringify(savedRecords)
        );

        alert("保存しました！");

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
                    🍺 記録追加
                </h1>

                <div className="space-y-4">

                    <div>
                        <label className="mb-1 block font-medium">
                            📅 日付
                        </label>

                        <input
                            type="date"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            className="w-full rounded-lg border p-2"
                        />
                    </div>

                    <div>
                        <label className="mb-1 block font-medium">
                            🍚 食事
                        </label>
                        <input
                            type="text"
                            value={meal}
                            onChange={(e) => setMeal(e.target.value)}
                            placeholder="例：オートミール、サラダチキン"
                            className="w-full rounded-lg border p-2"
                        />
                    </div>

                    <div>
                        <label className="mb-1 block font-medium">
                            🍺 お酒
                        </label>
                        <input
                            type="text"
                            value={alcohol}
                            onChange={(e) => setAlcohol(e.target.value)}
                            placeholder="例：ビール2杯"
                            className="w-full rounded-lg border p-2"
                        />
                    </div>

                    <div>
                        <label className="mb-1 block font-medium">
                            📝 メモ
                        </label>
                        <textarea
                            value={memo}
                            onChange={(e) => setMemo(e.target.value)}
                            placeholder="今日の一言"
                            className="w-full rounded-lg border p-2"
                        />
                    </div>

                    <button
                        onClick={saveRecord}
                        disabled={isSaving}
                        className="w-full rounded-lg bg-blue-600 p-3 text-white disabled:opacity-50"
                    >
                        {isSaving ? "保存中..." : "保存"}
                    </button>
                </div>
            </div>
        </main>
    );
}
