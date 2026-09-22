import type { ComponentType } from 'react'

interface WithLoadingProps {
  loading: boolean
}

export function withLoading<P extends object>(
  Component: ComponentType<P>
) {
  return function WithLoadingComponent(
    props: P & WithLoadingProps
  ) {
    if (props.loading) {
      return (
        <div className="loading">
          Đang tải dữ liệu...
        </div>
      )
    }

    return <Component {...props} />
  }
}