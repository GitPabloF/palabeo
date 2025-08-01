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
        className={`inline-block px-3 py-2 text-xs font-bold rounded-full uppercase shadow-lg text-white ${
          isFront ? "bg-white/10 border border-white/20" : "bg-gray-600"
        }`}
      >
        {label}
      </span>
    </div>
  )
}
