export function getDaysDifference(
  deadline: string
): number {
  const today = new Date()

  const todayDate = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate()
  )

  const deadlineDate = new Date(
    `${deadline}T00:00:00`
  )

  const difference =
    deadlineDate.getTime() -
    todayDate.getTime()

  return Math.round(
    difference / (1000 * 60 * 60 * 24)
  )
}

export function getDeadlineLabel(
  deadline: string
): string {
  const days = getDaysDifference(deadline)

  if (days >= 0) {
    return `Còn ${days} ngày`
  }

  return `Quá hạn ${Math.abs(days)} ngày`
}
