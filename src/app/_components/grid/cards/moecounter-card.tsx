import Image from 'next/image'

export function MoecounterCard() {
  return (
    <div className="relative flex h-36 w-full flex-1 transform-gpu flex-col items-center justify-center overflow-hidden rounded-xl border border-neutral-200 bg-gradient-to-br from-neutral-50 to-neutral-100 px-5 pb-5 pt-5 transition-all duration-500 hover:scale-[.97] dark:border-neutral-900 dark:from-neutral-1000 dark:to-neutral-950">
      <Image
        src="https://moe-counter.yude.jp/dsrkafuu:demo?theme=gelbooru&add=0"
        alt="Moe Counter"
        width={180}
        height={40}
        className="object-contain"
        unoptimized
      />
    </div>
  )
}
