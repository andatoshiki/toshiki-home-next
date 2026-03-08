import { Code } from '@phosphor-icons/react/dist/ssr'
import { Cursor } from '~/components/icons'
import { getCodingHrs } from '~/lib/api/wakatime'

export async function WakatimeStats() {
  try {
    const result = await getCodingHrs()
    const { total_seconds } = result?.data || {}
    if (typeof total_seconds !== 'number') {
      return (
        <a
          href="https://wakatime.com/@andatoshiki"
          target="_blank"
          rel="noopener noreferrer"
          className="relative flex h-[4.125rem] w-full flex-1 transform-gpu flex-col items-center justify-center overflow-hidden rounded-xl border border-blue-300/30 bg-blue-200/40 px-5 pb-5 pt-5 backdrop-blur-md transition-all duration-500 hover:scale-[.97] dark:border-blue-900/40 dark:bg-blue-900/30"
        >
          <div className="absolute inset-0 -z-10 bg-blue-400/30 backdrop-blur-xl" />
          <div className="flex flex-row items-center justify-center">
            <Cursor className="animate-spin-slow mr-4 text-5xl text-black dark:text-white" />
            <div className="flex flex-col items-center">
              <span className="flex items-center font-mono text-2xl font-semibold">
                <Code className="mr-1 inline-block text-xl" weight="bold" />- h
              </span>
              <span className="text-xm mt-0.5">(coding stats)</span>
            </div>
          </div>
        </a>
      )
    }
    return (
      <a
        href="https://wakatime.com/@andatoshiki"
        target="_blank"
        rel="noopener noreferrer"
        className="relative flex h-[4.125rem] w-full flex-1 transform-gpu flex-col items-center justify-center overflow-hidden rounded-xl border border-blue-300/30 bg-blue-200/40 px-5 pb-5 pt-5 backdrop-blur-md transition-all duration-500 hover:scale-[.97] dark:border-blue-900/40 dark:bg-blue-900/30"
      >
        <div className="absolute inset-0 -z-10 bg-blue-400/30 backdrop-blur-xl" />
        <div className="flex flex-row items-center justify-center">
          <Cursor className="animate-spin-slow mr-4 text-5xl text-black dark:text-white" />
          <div className="flex flex-col items-center">
            <span className="flex items-center font-mono text-2xl font-semibold">
              <Code className="mr-1 inline-block text-xl" weight="bold" />
              {Math.round(total_seconds / 3600)}h
            </span>
            <span className="text-xm mt-0.5">(coding stats)</span>
          </div>
        </div>
      </a>
    )
  } catch (e) {
    return (
      <a
        href="https://wakatime.com/@andatoshiki"
        target="_blank"
        rel="noopener noreferrer"
        className="relative flex h-[4.125rem] w-full flex-1 transform-gpu flex-col items-center justify-center overflow-hidden rounded-xl border border-blue-300/30 bg-blue-200/40 px-5 pb-5 pt-5 backdrop-blur-md transition-all duration-500 hover:scale-[.97] dark:border-blue-900/40 dark:bg-blue-900/30"
      >
        <div className="absolute inset-0 -z-10 bg-blue-400/30 backdrop-blur-xl" />
        <div className="flex flex-row items-center justify-center">
          <Cursor className="animate-spin-slow mr-4 text-5xl text-black dark:text-white" />
          <div className="flex flex-col items-center">
            <span className="flex items-center font-mono text-2xl font-semibold">
              <Code className="mr-1 inline-block text-xl" weight="bold" />- h
            </span>
            <span className="text-xm mt-0.5">(coding stats)</span>
          </div>
        </div>
      </a>
    )
  }
}
