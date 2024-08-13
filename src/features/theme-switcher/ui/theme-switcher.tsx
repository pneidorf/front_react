/* eslint-disable max-len */
import { Listbox, ListboxButton, ListboxOption, ListboxOptions } from '@headlessui/react'
import { CheckIcon, MoonIcon, SunIcon } from '@heroicons/react/24/outline'
import clsx from 'clsx'
import { AnimatePresence, motion } from 'framer-motion'
import { useTheme } from 'next-themes'
import { memo, useEffect, useState } from 'react'

export const ThemeSwitcher = memo(() => {
  const [mounted, setMounted] = useState(false)
  const { theme, setTheme, resolvedTheme, themes } = useTheme()

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }
  return (
    <Listbox value={theme} onChange={setTheme}>
      {({ open }) => (
        <div className='relative'>
          <ListboxButton className='relative flex h-full min-h-8 w-8 cursor-default items-center justify-center rounded-lg'>
            {resolvedTheme === 'dark' ? (
              <MoonIcon
                className={clsx(
                  'h-5 w-5 cursor-pointer transition-colors',
                  open ? 'text-primary' : 'text-secondary'
                )}
              />
            ) : (
              <SunIcon
                className={clsx(
                  'h-5 w-5 cursor-pointer transition-colors',
                  open ? 'text-primary' : 'text-secondary'
                )}
              />
            )}
          </ListboxButton>
          <AnimatePresence>
            {open && (
              <ListboxOptions
                as={motion.ul}
                static
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className='absolute right-0 z-10 mt-2 max-h-60 origin-top-right overflow-auto rounded-xl bg-primary p-2 text-base capitalize shadow-md focus:outline-none'
              >
                {themes.map(theme => (
                  <ListboxOption
                    key={theme}
                    value={theme}
                    className={({ active }) =>
                      clsx(
                        'relative cursor-pointer select-none rounded-md py-2 pl-10 pr-4',
                        active ? 'bg-secondary' : ''
                      )
                    }
                  >
                    {({ selected }) => (
                      <>
                        <span
                          className={`block truncate text-lg ${selected ? 'font-medium' : 'font-normal'}`}
                        >
                          {theme === 'system' ? 'Automatic' : theme}
                        </span>
                        {selected && (
                          <span className='absolute inset-y-0 left-0 flex items-center pl-3 dark:text-neutral-50'>
                            <CheckIcon className='h-5 w-5' aria-hidden='true' />
                          </span>
                        )}
                      </>
                    )}
                  </ListboxOption>
                ))}
              </ListboxOptions>
            )}
          </AnimatePresence>
        </div>
      )}
    </Listbox>
  )
})
