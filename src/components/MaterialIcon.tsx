import { cn } from "@/lib/utils";

export function MaterialIcon({
  name,
  className,
  filled,
  style,
}: {
  name: string;
  className?: string;
  filled?: boolean;
  style?: React.CSSProperties;
}) {
  return (
    <span
      className={cn("material-symbols-outlined", filled && "filled", className)}
      style={style}
      aria-hidden
    >
      {name}
    </span>
  );
}
