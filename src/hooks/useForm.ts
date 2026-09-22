import {
  type ChangeEvent,
  type FormEvent,
  useState,
} from 'react'

type FormField = string | number | boolean
type FormValues = Record<string, FormField>

export function useForm<T extends FormValues>(
  initialValues: T
) {
  const [values, setValues] = useState<T>(initialValues)

  const handleChange = (
    event: ChangeEvent<
      HTMLInputElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = event.target

    setValues((current) => ({
      ...current,
      [name]: value,
    }))
  }

  const reset = () => {
    setValues(initialValues)
  }

  const handleSubmit = (
    callback: (values: T) => void | Promise<void>
  ) => {
    return async (
      event: FormEvent<HTMLFormElement>
    ) => {
      event.preventDefault()
      await callback(values)
    }
  }

  return {
    values,
    setValues,
    handleChange,
    handleSubmit,
    reset,
  }
}
