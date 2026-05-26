import Link from "next/link";

type FoodRecord = {
  id: number;
  date: string;
  meal: string;
  alcohol: string;
  memo: string;
};

export default function Home() {
  const records: FoodRecord[] = [
    {
      id: 1,
      date: "2026/05/26",
      meal: "オートミール、サラダチキン",
      alcohol: "なし",
      memo: "夜は軽めにした",
    },
    {
      id: 2,
      date: "2026/05/25",
      meal: "焼肉、白ごはん",
      alcohol: "ビール2杯",
      memo: "恋人とご飯🍻",
    },
    {
      id: 3,
      date: "2026/05/24",
      meal: "炊き込みご飯、味噌汁",
      alcohol: "ハイボール1杯",
      memo: "おうちご飯でゆっくり",
    },
  ];

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
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
