import { cn } from '@/lib/utils'
import Image from 'next/image'
import { images } from '../../public/images/images'

interface HomePageProps {
  className?: string
}

function HomePage({ className }: HomePageProps) {
  return (
    <div className={cn('min-h-screen bg-neutral-200 px-5 py-10', className)}>
      {/* Header */}
      <div className="flex flex-col items-center gap-4 rounded-xl bg-white px-4 py-8 shadow-md">
        <Image
          src={images.logo}
          alt="Gigity Logo"
          width={100}
          height={100}
          className="rounded-full"
        />
        <h1 className="text-center text-4xl font-bold text-sky-500">Gigity</h1>
        <p className="font-body text-center text-xl tracking-wider text-neutral-500">
          The Tool for Creating Commercial Videos Automatically
        </p>
      </div>
    </div>
  )
}

export default HomePage
