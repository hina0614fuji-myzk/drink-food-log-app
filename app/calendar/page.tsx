"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

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

type CalendarDay = {
    date: Date;
    isCurrentMonth: boolean;
};

const getCalendarDays = (year: number, month: number): CalendarDay[] => {
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);

    const startDate = new Date(firstDay);
    const startDay = firstDay.getDay(); // 日:0 月:1 ... 土:6
    startDate.setDate(firstDay.getDate() - startDay);

    const days: CalendarDay[] = [];

    for (let i = 0; i < 42; i++) {
        const date = new Date(startDate);
        date.setDate(startDate.getDate() + i);

        days.push({
            date,
            isCurrentMonth: date.getMonth() === month,
        });
    }

    return days;
};

export default function CalendarPage() {
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth();

    const calendarDays = getCalendarDays(year, month);

    const weekDays = ["日", "月", "火", "水", "木", "金", "土"];

    const [records, setRecords] = useState<FoodRecord[]>([]);

    const formatDate = (date: Date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");

        return `${year}-${month}-${day}`;
    };

    useEffect(() => {
        const fetchRecords = async () => {
            const { data, error } = await supabase
                .from("records")
                .select("*");

            if (error) {
                console.error(error);
                return;
            }

            setRecords(data);
        };

        fetchRecords();
    }, []);

    return (
        <main className="min-h-screen bg-red-50 px-6 py-6">
            <div className="mx-auto max-w-5xl">
                <div className="mb-6 flex items-center justify-between">
                    <h1 className="text-3xl font-bold">
                        📅 カレンダー
                    </h1>

                    <Link
                        href="/"
                        className="rounded-xl bg-white px-4 py-2 font-bold text-orange-500 shadow-sm"
                    >
                        ホームへ戻る
                    </Link>
                </div>

                <div className="rounded-2xl bg-white p-5 shadow-sm">
                    <h2 className="mb-4 text-center text-xl font-bold">
                        {year}年{month + 1}月
                    </h2>

                    <div className="grid grid-cols-7 border-t border-l border-gray-200">
                        {weekDays.map((day) => (
                            <div
                                key={day}
                                className="border-r border-b border-gray-200 bg-orange-50 p-3 text-center text-sm font-bold"
                            >
                                {day}
                            </div>
                        ))}

                        {calendarDays.map((day) => {
                            const dateText = formatDate(day.date);

                            const record = records.find(
                                (record) => record.date === dateText
                            );

                            return (
                                <div
                                    key={day.date.toISOString()}
                                    className={`min-h-28 border-r border-b border-gray-200 p-2 ${day.isCurrentMonth
                                            ? "bg-white"
                                            : "bg-gray-50 text-gray-300"
                                        }`}
                                >
                                    <p className="text-sm font-medium">
                                        {day.date.getDate()}
                                    </p>

                                    {record && (
                                        <div
                                            className={`mt-2 rounded-lg px-2 py-1 text-xs font-bold ${record.has_alcohol
                                                    ? "bg-orange-100 text-orange-700"
                                                    : "bg-green-100 text-green-700"
                                                }`}
                                        >
                                            {record.has_alcohol
                                                ? `🍺 ${record.alcohol_type ?? ""} ${record.alcohol_amount ?? ""
                                                }${record.alcohol_unit ?? ""}`
                                                : "🌱 禁酒"}
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </main>
    );
}