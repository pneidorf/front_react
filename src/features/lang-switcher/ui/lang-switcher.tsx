/* eslint-disable i18next/no-literal-string */
import { Listbox, ListboxButton, ListboxOption, ListboxOptions } from '@headlessui/react'
import { CheckIcon } from '@heroicons/react/24/outline'
import clsx from 'clsx'
import { AnimatePresence, motion } from 'framer-motion'
import { memo } from 'react'
import { useTranslation } from 'react-i18next'

import EnIcon from '~/shared/assets/svg/locales/en.svg?react'
import RuIcon from '~/shared/assets/svg/locales/ru.svg?react'

export const LangSwitcher = memo(() => {
  const { i18n } = useTranslation()
  const setLanguage = (lng: string) => {
    i18n.changeLanguage(lng)
  }

  return (
    <Listbox value={i18n.language} onChange={setLanguage}>
      {({ open }) => (
        <div className='relative'>
          <ListboxButton className='relative flex min-h-10 min-w-10 cursor-pointer items-center justify-center rounded-full bg-tertiary'>
            {i18n.language === 'en' ? (
              <EnIcon
                className={clsx(
                  'h-7 w-7 cursor-pointer rounded-full transition-colors',
                  open ? 'text-primary' : 'text-secondary'
                )}
              />
            ) : (
              <RuIcon
                className={clsx(
                  'h-7 w-7 cursor-pointer rounded-full transition-colors',
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
                <ListboxOption
                  value={'en'}
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
                        className={`block flex flex-row items-center gap-2 truncate text-lg ${selected ? 'font-medium' : 'font-normal'}`}
                      >
                        <EnIcon className='h-7 w-7 cursor-pointer rounded-full transition-colors' />
                        English
                      </span>
                      {selected && (
                        <span className='absolute inset-y-0 left-0 flex items-center pl-3 dark:text-neutral-50'>
                          <CheckIcon className='h-5 w-5' aria-hidden='true' />
                        </span>
                      )}
                    </>
                  )}
                </ListboxOption>
                <ListboxOption
                  value={'ru'}
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
                        className={`block flex flex-row items-center gap-2 truncate text-lg ${selected ? 'font-medium' : 'font-normal'}`}
                      >
                        <RuIcon className='h-7 w-7 cursor-pointer rounded-full transition-colors' />
                        Русский
                      </span>
                      {selected && (
                        <span className='absolute inset-y-0 left-0 flex items-center pl-3 dark:text-neutral-50'>
                          <CheckIcon className='h-5 w-5' aria-hidden='true' />
                        </span>
                      )}
                    </>
                  )}
                </ListboxOption>
              </ListboxOptions>
            )}
          </AnimatePresence>
        </div>
      )}
    </Listbox>
  )
})
