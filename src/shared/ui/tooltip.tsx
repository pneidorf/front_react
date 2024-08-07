import * as RadixTooltip from '@radix-ui/react-tooltip'
import { AnimatePresence } from 'framer-motion'
import { FC, ReactNode } from 'react'

interface TooltipProps {
  children: ReactNode
  title: string
}

export const Tooltip: FC<TooltipProps> = ({ children, title }) => (
  <RadixTooltip.Provider>
    <RadixTooltip.Root delayDuration={100}>
      <RadixTooltip.Trigger asChild>{children}</RadixTooltip.Trigger>
      <RadixTooltip.Portal>
        <AnimatePresence>
          <RadixTooltip.Content
            side='right'
            className='z-20 select-none rounded-[4px] bg-tertiary px-[15px] py-[10px] text-primary'
            sideOffset={5}
          >
            {title}
            <RadixTooltip.Arrow className='fill-tertiary' />
          </RadixTooltip.Content>
        </AnimatePresence>
      </RadixTooltip.Portal>
    </RadixTooltip.Root>
  </RadixTooltip.Provider>
)
