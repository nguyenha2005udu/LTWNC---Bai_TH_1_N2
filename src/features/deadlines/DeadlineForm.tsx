import { useState } from 'react'

import type { CreateDeadlineInput } from '../../types/deadline'
import { useForm } from '../../hooks/useForm'
import { isPriority } from '../../utils/typeGuards'

interface DeadlineFormProps {
  onSubmit: (
    data: CreateDeadlineInput
  ) => void | Promise<void>
  apiError?: string | null
}

const initialValues: CreateDeadlineInput = {
  subject: '',
  title: '',
  deadline: '',
  priority: 'medium',
}

export function DeadlineForm({
  onSubmit,
  apiError,
}: DeadlineFormProps) {
  const [formError, setFormError] =
    useState<string | null>(null)

  const [isSubmitting, setIsSubmitting] =
    useState(false)

  const {
    values,
    handleChange,
    handleSubmit,
    reset,
  } = useForm<CreateDeadlineInput>(
    initialValues
  )

  const submit = handleSubmit(async (data) => {
    const nextDeadline: CreateDeadlineInput = {
      subject: data.subject.trim(),
      title: data.title.trim(),
      deadline: data.deadline,
      priority: data.priority,
    }

    if (
      !nextDeadline.subject ||
      !nextDeadline.title ||
      !nextDeadline.deadline
    ) {
      setFormError(
        'Vui lòng nhập đủ môn học, tên bài tập và hạn nộp.'
      )
      return
    }

    if (!isPriority(nextDeadline.priority)) {
      setFormError('Độ ưu tiên không hợp lệ.')
      return
    }

    try {
      setFormError(null)
      setIsSubmitting(true)
      await onSubmit(nextDeadline)
      reset()
    } catch {
      setFormError(
        'Không thể thêm bài tập. Hãy kiểm tra mock API đang chạy.'
      )
    } finally {
      setIsSubmitting(false)
    }
  })

  return (
    <form
      className="deadline-form"
      onSubmit={submit}
    >
      <div className="form-heading">
        <div>
          <h2>Thêm bài tập</h2>
          <p>
            Ghi lại việc cần làm, bắt đầu từ đây.
          </p>
        </div>
      </div>

      <label>
        <span>Môn học</span>
        <input
          name="subject"
          value={values.subject}
          onChange={handleChange}
          placeholder="VD: React nâng cao"
          required
        />
      </label>

      <label>
        <span>Tên bài tập</span>
        <input
          name="title"
          value={values.title}
          onChange={handleChange}
          placeholder="VD: Redux Toolkit"
          required
        />
      </label>

      <label>
        <span>Hạn nộp</span>
        <input
          type="date"
          name="deadline"
          value={values.deadline}
          onChange={handleChange}
          required
        />
      </label>

      <label>
        <span>Ưu tiên</span>
        <select
          name="priority"
          value={values.priority}
          onChange={handleChange}
        >
          <option value="low">
            Thấp
          </option>

          <option value="medium">
            Trung bình
          </option>

          <option value="high">
            Cao
          </option>
        </select>
      </label>

      <button
        type="submit"
        disabled={isSubmitting}
      >
        {isSubmitting
          ? 'Đang thêm...'
          : 'Thêm bài tập'}
      </button>

      {(formError || apiError) && (
        <p className="form-error" role="alert">
          {formError ?? apiError}
        </p>
      )}
    </form>
  )
}
