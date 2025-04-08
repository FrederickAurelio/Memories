import Image from "next/image";

function Avatar({
  alt,
  src,
  className,
}: {
  alt: string;
  src: string;
  className?: string;
}) {
  return (
    <div className={`relative ${className}`}>
      <Image
        sizes="64px"
        className="rounded-full object-cover"
        fill
        alt={alt}
        src={src}
      />
    </div>
  );
}

export default Avatar;
