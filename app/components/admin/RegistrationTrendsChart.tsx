"use client";

import { TrendingUp } from "lucide-react";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

const chartConfig = {
  registrations: {
    label: "Registrations",
    color: "hsl(var(--primary))",
  },
} satisfies ChartConfig;

export function RegistrationTrendsChart({ data }: { data: { date: string; registrations: number }[] }) {
  // Fill in empty dates if needed, or just use data as is.
  // For a simple view, we just use the data passed.

  return (
    <Card className="bg-surface-container-lowest border-outline-variant shadow-sm h-full flex flex-col">
      <CardHeader>
        <CardTitle className="text-on-surface">Registration Trends</CardTitle>
        <CardDescription className="text-on-surface-variant">Last 30 Days Activity</CardDescription>
      </CardHeader>
      <CardContent className="flex-1">
        {data.length === 0 ? (
          <div className="h-full flex items-center justify-center text-on-surface-variant text-sm py-12">
            No registration data available for this period.
          </div>
        ) : (
          <ChartContainer config={chartConfig} className="min-h-[250px] w-full">
            <AreaChart
              accessibilityLayer
              data={data}
              margin={{
                left: -20,
                right: 12,
              }}
            >
              <CartesianGrid vertical={false} stroke="hsl(var(--outline-variant))" strokeDasharray="4 4" />
              <XAxis
                dataKey="date"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                tickFormatter={(value) => {
                  const date = new Date(value);
                  return date.toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  });
                }}
                className="text-xs text-on-surface-variant"
              />
              <YAxis 
                tickLine={false} 
                axisLine={false} 
                tickMargin={8} 
                className="text-xs text-on-surface-variant"
                allowDecimals={false}
              />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent indicator="line" />}
              />
              <Area
                dataKey="registrations"
                type="natural"
                fill="var(--color-registrations)"
                fillOpacity={0.8}
                stroke="var(--color-registrations)"
                strokeWidth={2}
              />
            </AreaChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  );
}
