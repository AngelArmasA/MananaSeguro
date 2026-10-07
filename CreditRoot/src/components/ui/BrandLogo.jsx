import logoCompleto from '../../assets/LOGO_MS.png'
import { cn } from '../../utils/cn'

const sizeMap = {
  sm: 'w-8 h-8',
  md: 'w-12 h-12',
  lg: 'w-16 h-16',
  xl: 'w-20 h-20 lg:w-28 lg:h-28',
}

export function BrandLogo({ size = 'md', className }) {
  return (
    <div
      className={cn(
        'rounded-[32%] bg-brand flex items-center justify-center shrink-0 overflow-hidden',
        sizeMap[size],
        className,
      )}
    >
      <img
        src={logoCompleto}
        alt=""
        aria-hidden="true"
        className="w-[92%] h-[92%] object-contain"
      />
    </div>
  )
}