"use client";

import {
    Bar,
    BarChart,
    CartesianGrid,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from "recharts";

type SpendChartProps = {
    currentSpend: number;
    optimizedSpend: number;
};

export function SpendChart({
    currentSpend,
    optimizedSpend,
}: SpendChartProps) {
    const data = [
        {
            name: "Current",
            amount: currentSpend,
        },
        {
            name: "Optimized",
            amount: optimizedSpend,
        },
    ];

    return (
        <div className="mt-8 h-[300px] w-full rounded-3xl border border-white/10 bg-black/30 p-5">
            <div className="mb-6">
                <h3 className="text-lg font-semibold text-white">
                    Spend Comparison
                </h3>

                <p className="mt-1 text-sm text-white/50">
                    Current AI stack spend versus projected optimized spend.
                </p>
            </div>

            <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />

                    <XAxis
                        dataKey="name"
                        stroke="#a1a1aa"
                    />

                    <YAxis
                        stroke="#a1a1aa"
                    />

                    <Tooltip
                        contentStyle={{
                            backgroundColor: "#09090b",
                            border: "1px solid #27272a",
                            borderRadius: "16px",
                            color: "#fff",
                        }}
                    />

                    <Bar
                        dataKey="amount"
                        fill="#34d399"
                        radius={[12, 12, 0, 0]}
                    />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}