import type { IconType } from "react-icons";

type FloatingIconProps = {
  Icon: IconType;
  size: number;
  delay: string;
  className?: string;
  style?: React.CSSProperties;
};

export default function FloatingIcon({
  Icon,
  size,
  delay,
  className = "",
  style,
}: FloatingIconProps) {
  return (
    <span
      className={`absolute pointer-events-none ${className}`}
      style={{ animation: `float 4s ease-in-out ${delay} infinite`, ...style }}
    >
      <Icon size={size} />
    </span>
  );
}