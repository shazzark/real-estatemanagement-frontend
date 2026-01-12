import { cn } from "../../_lib/utilis";

export function Skeleton({
  className,
  variant = "rectangle",
  width,
  height,
  animation = "pulse",
  style,
  ...props
}) {
  const baseStyles = "bg-gray-200 rounded-md";

  const variantStyles = {
    text: "h-4 rounded",
    circle: "rounded-full",
    rectangle: "rounded-md",
  };

  const animationStyles = {
    pulse: "animate-pulse",
    wave: "relative overflow-hidden before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_1.5s_infinite] before:bg-gradient-to-r before:from-transparent before:via-white/20 before:to-transparent",
    none: "",
  };

  const customStyles = {
    width: width
      ? typeof width === "number"
        ? `${width}px`
        : width
      : undefined,
    height: height
      ? typeof height === "number"
        ? `${height}px`
        : height
      : undefined,
    ...style,
  };

  return (
    <div
      className={cn(
        baseStyles,
        variantStyles[variant],
        animationStyles[animation],
        className
      )}
      style={customStyles}
      {...props}
    />
  );
}
