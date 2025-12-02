import { LucideIcon } from "lucide-react";
import Image from "next/image";
import { StaticImageData } from "next/image";

interface IconProps {
  name: LucideIcon | string | StaticImageData;
  size?: number;
  className?: string;
}

export default function Icon({ name, size = 16, className = "" }: IconProps) {
  // If name is a string, treat it as an image path
  if (typeof name === "string") {
    return (
      <Image
        src={name}
        alt="icon"
        width={size}
        height={size}
        className={className}
      />
    );
  }

  // If name is a StaticImageData object, it's a Next.js imported image
  if (typeof name === "object" && name !== null && "src" in name) {
    return (
      <Image
        src={name}
        alt="icon"
        width={size}
        height={size}
        className={className}
      />
    );
  }

  // Otherwise, treat it as a Lucide icon component
  const IconComponent = name;
  return <IconComponent size={size} className={className} />;
}
