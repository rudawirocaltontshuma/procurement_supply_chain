import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { type ChartConfig, ChartContainer } from "@/components/ui/chart";
import { cn } from "@/lib/utils";

interface ChartCardProps {
  title: string;
  description?: string;
  config: ChartConfig;
  className?: string;
  children: React.ReactElement;
  height?: string;
}

export function ChartCard({ title, description, config, className, children, height = "h-72" }: ChartCardProps) {
  return (
    <Card className={cn("gap-3", className)}>
      <CardHeader>
        <CardTitle className="font-normal text-sm">{title}</CardTitle>
        {description ? <CardDescription>{description}</CardDescription> : null}
      </CardHeader>
      <CardContent>
        <ChartContainer config={config} className={cn("w-full", height)}>
          {children}
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
