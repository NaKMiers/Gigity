import { cn } from '@/lib/utils'

interface HomePageProps {
  className?: string
}

function HomePage({ className }: HomePageProps) {
  return (
    <div className={cn(className)}>
      <p>HomePage</p>
    </div>
  )
}

export default HomePage

