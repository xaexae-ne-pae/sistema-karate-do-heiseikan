
import { Skeleton } from "@/components/ui/skeleton";

interface LoadingAthletesProps {
  count?: number;
}

export const LoadingAthletes = ({ count = 6 }: LoadingAthletesProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {Array(count).fill(0).map((_, i) => (
        <Skeleton key={i} className="h-32 w-full rounded-md" />
      ))}
    </div>
  );
};
