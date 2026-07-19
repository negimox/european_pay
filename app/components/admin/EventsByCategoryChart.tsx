"use client";

import { Pie, PieChart, Cell, ResponsiveContainer, Legend } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

const COLORS = [
  "hsl(var(--primary))",
  "hsl(var(--secondary))",
  "hsl(var(--tertiary))",
  "hsl(var(--error))",
  "#3b82f6",
  "#8b5cf6",
  "#10b981",
];

const chartConfig = {
  events: {
    label: "Events",
  },
  ACADEMIC: { label: "Academic", color: COLORS[0] },
  CULTURAL: { label: "Cultural", color: COLORS[1] },
  SPORTS: { label: "Sports", color: COLORS[2] },
  TECHNICAL: { label: "Technical", color: COLORS[3] },
  WORKSHOP: { label: "Workshop", color: COLORS[4] },
  SOCIAL: { label: "Social", color: COLORS[5] },
  OTHER: { label: "Other", color: COLORS[6] },
} satisfies ChartConfig;

export function EventsByCategoryChart({ data }: { data: { category: string; value: number }[] }) {
  
  // Map data colors based on index
  const formattedData = data.map((item, index) => ({
    ...item,
    fill: COLORS[index % COLORS.length],
  }));

  return (
    <Card className="bg-surface-container-lowest border-outline-variant shadow-sm h-full flex flex-col">
      <CardHeader>
        <CardTitle className="text-on-surface">Events by Category</CardTitle>
        <CardDescription className="text-on-surface-variant">Distribution of platform events</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-4">
        {data.length === 0 ? (
          <div className="h-full flex items-center justify-center text-on-surface-variant text-sm py-12">
            No events available to display.
          </div>
        ) : (
          <ChartContainer config={chartConfig} className="mx-auto aspect-square max-h-[300px]">
            <PieChart>
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent hideLabel />}
              />
              <Pie
                data={formattedData}
                dataKey="value"
                nameKey="category"
                innerRadius={60}
                outerRadius={100}
                strokeWidth={2}
                stroke="hsl(var(--surface-container-lowest))"
                paddingAngle={2}
              >
                {formattedData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Pie>
              <Legend 
                layout="horizontal" 
                verticalAlign="bottom" 
                align="center"
                wrapperStyle={{ paddingTop: '20px', fontSize: '12px' }}
              />
            </PieChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  );
}
