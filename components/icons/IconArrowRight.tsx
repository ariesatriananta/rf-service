import * as React from "react";

type Props = React.SVGProps<SVGSVGElement> & {
  size?: number | string;        // override width/height barengan
  title?: string;
  className?: string;
};

export default function IconArrowRight({
  size = 20,
  title,
  className = "lucide lucide-move-right-icon lucide-move-right mx-1",
  ...rest
}: Props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      role={title ? "img" : "presentation"}
      aria-label={title}
      {...rest}
    >
      {title ? <title>{title}</title> : null}
      <path d="M18 8L22 12L18 16" />
      <path d="M2 12H22" />
    </svg>
  );
}
