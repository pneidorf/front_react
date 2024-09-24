// export function findInputError(errors, name) {
//   const filtered = Object.keys(errors)
//     .filter(key => key.includes(name))
//     .reduce((cur, key) => {
//       return Object.assign(cur, { error: errors[key] })
//     }, {})
//   return filtered
// }
// export function findInputError(errors: Record<string, string>, name: string) {
//   return Object.keys(errors)
//     .filter(key => key.includes(name))
//     .reduce((cur, key) => ({ ...cur, error: errors[key] }), {})
// }
import { FieldError, FieldErrors } from 'react-hook-form'

interface FieldErrorObject {
  error?: {
    message: string
  }
}

export function findInputError(errors: FieldErrors, name: string): FieldErrorObject {
  const filtered = Object.keys(errors)
    .filter(key => key.includes(name))
    .reduce((cur, key) => {
      const error = errors[key]
      if (error && 'message' in error) {
        return Object.assign(cur, { error: { message: (error as FieldError).message } })
      }
      return cur
    }, {} as FieldErrorObject)

  return filtered
}
