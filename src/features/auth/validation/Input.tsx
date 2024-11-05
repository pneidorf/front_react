import { AnimatePresence, motion } from 'framer-motion'
import { useFormContext } from 'react-hook-form'
import { MdError } from 'react-icons/md'

import emailIcon from '../icons/contacts.png'
import passwordIcon from '../icons/lock.png'

// import { findInputError, isFormInvalid } from './utils/inputValidations'
import { findInputError, isFormInvalid } from './utils'

interface InputProps {
  label: string
  type: 'email' | 'password' | string
  id: string
  placeholder: string
  validation: object
  name: string
}

interface InputErrorProps {
  message: string | undefined
}

export const Input = ({ type, id, placeholder, validation, name }: InputProps) => {
  const {
    register,
    formState: { errors }
  } = useFormContext()

  const inputError = findInputError(errors, name)
  const isInvalid = isFormInvalid(inputError)

  return (
    <div className='flex w-full flex-col gap-2'>
      <div className='flex justify-between'>
        <AnimatePresence mode='wait' initial={false}>
          {isInvalid && (
            // eslint-disable-next-line max-len
            <InputError
              message={inputError.error && inputError.error.message}
              key={inputError.error && inputError.error.message}
            />
          )}
        </AnimatePresence>
      </div>
      <div className='flex flex-row border-b-4 border-gray-200'>
        <img
          src={type === 'email' ? emailIcon : type === 'password' ? passwordIcon : ''}
          width='50px'
          height='50px'
          alt={`${type} icon`}
        />
        <input
          id={id}
          type={type}
          className='text-2xl mt-0 block w-full border-0 px-0.5 text-[#9e9e9e] focus:ring-0'
          placeholder={placeholder}
          {...register(name, validation)}
        />
      </div>
    </div>
  )
}

const InputError = ({ message }: InputErrorProps) => (
  <motion.p
    className='flex items-center gap-1 rounded-md bg-red-100 px-2 font-semibold text-red-500'
    {...framer_error}
  >
    <MdError />
    {message}
  </motion.p>
)

const framer_error = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: 10 },
  transition: { duration: 0.2 }
}
