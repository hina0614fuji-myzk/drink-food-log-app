"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { supabase } from "@/lib/supabase";

export default function AddPage() {

    const today = new Date().toISOString().split("T")[0];

    const [date, setDate] = useState(today);
    const [hasAlcohol, setHasAlcohol] = useState(false);
    const [alcoholType, setAlcoholType] = useState("");
    const [alcoholAmount, setAlcoholAmount] = useState("");
    const [alcoholUnit, setAlcoholUnit] = useState("杯");
    const [alcoholNote, setAlcoholNote] = useState("");
    const [meal, setMeal] = useState("");
    const [memo, setMemo] = useState("");

    const router = useRouter();
    const [isSaving, setIsSaving] = useState(false);

    const saveRecord = async () => {

        if (!meal.trim()) {
            alert("食事を入力してください");
            return;
        }

        setIsSaving(true);

        const { error } = await supabase
            .from("records")
            .insert([
                {
                    date,
                    meal,
                    memo,

                    has_alcohol: hasAlcohol,

                    alcohol_type:
                        hasAlcohol ? alcoholType : null,

                    alcohol_amount:
                        hasAlcohol && alcoholAmount
                            ? Number(alcoholAmount)
                            : null,

                    alcohol_unit:
                        hasAlcohol ? alcoholUnit : null,

                    alcohol_note:
                        hasAlcohol ? alcoholNote : null,
                },
            ]);

        if (error) {
            alert("保存失敗: " + error.message);
            return;
        }

        alert("保存しました！");

        router.push("/");

    };

    return (


        <main className="min-h-screen bg-red-50 px-4 py-6">
            <div className="mx-auto max-w-2xl">

                {/* ヘッダー：背景なし */}
                <div className="mb-6 flex items-center justify-between">
                    <h1 className="text-3xl font-bold">
                        🍺 記録追加
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
                            <label className="mb-1 block font-medium">
                                種類
                            </label>

                            <select
                                value={alcoholType}
                                onChange={(e) =>
                                    setAlcoholType(e.target.value)
                                }
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
                            <label className="mb-1 block font-medium">
                                量
                            </label>

                            <input
                                type="number"
                                value={alcoholAmount}
                                onChange={(e) =>
                                    setAlcoholAmount(e.target.value)
                                }
                                className="w-full rounded-lg border p-2"
                            />
                        </div>

                        <div>
                            <label className="mb-1 block font-medium">
                                単位
                            </label>

                            <select
                                value={alcoholUnit}
                                onChange={(e) =>
                                    setAlcoholUnit(e.target.value)
                                }
                                className="w-full rounded-lg border p-2"
                            >
                                <option value="杯">杯</option>
                                <option value="本">本</option>
                                <option value="缶">缶</option>
                                <option value="ml">ml</option>
                            </select>
                        </div>

                        <div>
                            <label className="mb-1 block font-medium">
                                補足
                            </label>

                            <input
                                type="text"
                                value={alcoholNote}
                                onChange={(e) =>
                                    setAlcoholNote(e.target.value)
                                }
                                placeholder="ロック、濃いめなど"
                                className="w-full rounded-lg border p-2"
                            />
                        </div>

                    </div>
                )}

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
        </main >
    );
}
