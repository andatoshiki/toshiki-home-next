import { ComponentProps } from 'react'

interface Props extends ComponentProps<'h1'> {
  text: string
  description?: string | React.ReactNode
  as?: 'h1' | 'h2'
}

export function Title({
  text,
  description,
  as: Heading = 'h1',
  ...props
}: Props) {
  return (
    <div className="flex flex-col items-center md:items-start">
      <Heading
        {...props}
        className="h-fit w-fit bg-gradient-to-br from-neutral-900 via-neutral-900/90 to-neutral-900/70 bg-clip-text text-4xl font-semibold leading-tight text-transparent dark:from-neutral-300 dark:via-neutral-300/90 dark:to-neutral-300/70"
      >
        {text}
      </Heading>
      {description && (
        <span className="text-xs text-neutral-400 dark:text-neutral-600">
          {description}
        </span>
      )}
    </div>
  )
}
