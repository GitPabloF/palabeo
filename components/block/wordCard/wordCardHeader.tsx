// Card Header component
type CardHeaderProps = {
  label: string
  isFront?: boolean
}

export default function WordCardHeader({
  label,
  isFront = true,
}: CardHeaderProps) {
  return (
    <div className="text-center">
      <span
        className={`inline-block px-3 py-1.5 text-[10px] tracking-wider font-black rounded-full uppercase shadow-md text-white border ${
          isFront
            ? "bg-white/10 border-white/30 backdrop-blur-[1px]"
            : "bg-gray-700 border-gray-600"
        }`}
      >
        {label}
      </span>
    </div>
  )
}
