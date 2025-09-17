import React from "react"

interface SpinnerButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  loading?: boolean
  spinnerClassName?: string
  spinnerSize?: number
}

export const SpinnerButton = React.forwardRef<HTMLButtonElement, SpinnerButtonProps>(
  ({ children, loading = false, spinnerClassName = "", spinnerSize = 16, disabled, className = "", ...props }, ref) => {
    const isDisabled = disabled || loading
    return (
      <button
        ref={ref}
        disabled={isDisabled}
        className={`relative inline-flex items-center justify-center transition-opacity disabled:opacity-70 disabled:cursor-not-allowed ${className}`}
        {...props}
      >
        {loading && (
          <svg
            className={`absolute animate-spin text-current ${spinnerClassName}`}
            width={spinnerSize}
            height={spinnerSize}
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
            />
          </svg>
        )}
        <span className={loading ? "opacity-0" : "opacity-100"}>{children}</span>
      </button>
    )
  }
)

SpinnerButton.displayName = "SpinnerButton"
