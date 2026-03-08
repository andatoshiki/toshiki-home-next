'use client'
import Image from 'next/image'
import * as Tooltip from '@radix-ui/react-tooltip'

import { Typewriter } from './typewriter'
import { DiscordStatus } from '~/components/discord-indicator'

import deconstructedRobotBroLight from './deconstructed-robot-bro-light.svg'
import deconstructedRobotBroDark from './deconstructed-robot-bro-dark.svg'
import avatar from './avatar.png'

export function MainTitle() {
  return (
    <Tooltip.Provider>
      <div className="relative flex h-fit w-full flex-col items-center justify-between">
        <div className="absolute -z-50 h-64 w-64 bg-[conic-gradient(transparent,rgb(0,0,0))] opacity-15 blur-2xl dark:bg-[conic-gradient(transparent,rgb(255,255,255))] md:left-36" />

        <div className="absolute left-1/2 top-2/3 w-max -translate-x-1/2 -translate-y-1/2 opacity-10 dark:opacity-5 md:hidden">
          <Image
            src={avatar}
            alt="Deconstructed Robot Light"
            className="w-45 object-cover dark:hidden"
          />
          <Image
            src={avatar}
            alt="Deconstructed Robot Dark"
            className="w-45 hidden dark:block"
          />
        </div>

        <div className="flex w-full items-center gap-12 md:justify-between">
          <div className="relative flex w-full flex-col items-center gap-4 md:w-fit md:items-start">
            <div className="flex w-full flex-col items-stretch gap-2 md:flex-row md:items-center md:justify-start md:gap-2">
              {/* Mobile/mid: DiscordStatus above and centered; Desktop: to far right of greeting */}
              <span className="flex w-full justify-center md:hidden">
                <DiscordStatus />
              </span>
              <div className="flex w-full items-center justify-center gap-2 md:justify-start">
                <span className="w-full whitespace-nowrap text-center text-lg font-semibold text-black/50 dark:text-white/50 md:w-max md:text-left md:text-xl">
                  Hi, I am{' '}
                  <span className="text-black/90 dark:text-white/90">
                    安田俊樹
                  </span>
                </span>
                <span className="flex-1" />
                <span className="hidden flex-shrink-0 md:flex">
                  <DiscordStatus />
                </span>
              </div>
            </div>
            <span className="w-min whitespace-nowrap text-5xl font-bold text-black drop-shadow-2xl dark:text-neutral-50 md:w-max md:text-7xl">
              Anda Toshiki
            </span>
            <span className="flex w-full items-center justify-center text-center text-lg font-semibold text-neutral-400 md:min-h-fit md:justify-start md:text-left md:text-xl">
              <Typewriter
                words={[
                  'Hypomanic INTP',
                  'Heavily caffeine overdosed',
                  'Most kawaii mahoshojo',
                  'Obsidian PKM architect',
                  'Self-hosting FTW',
                  'DanMachi fan forever'
                ]}
                cursor
                loop
              />
            </span>
          </div>
          <div className="hidden flex-1 items-center justify-end md:flex">
            <Image
              src={avatar}
              alt="Deconstructed Robot Light"
              className="w-72 dark:hidden"
            />
            <Image
              src={avatar}
              alt="Deconstructed Robot Dark"
              className="hidden w-72 dark:block"
            />
          </div>
        </div>
      </div>
    </Tooltip.Provider>
  )
}
