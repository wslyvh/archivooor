import React, { Component, ErrorInfo, ReactNode } from 'react'

interface Props {
  children?: ReactNode
}

interface State {
  hasError: boolean
  error?: Error
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  }

  public static getDerivedStateFromError(error: Error): State {
    // Update state so the next render will show the fallback UI.

    return {
      hasError: true,
      error: error,
    }
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo)
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div>
          <h1>Unexpected error</h1>
          {this.state.error && (
            <>
              <h2>{this.state.error.name} </h2>
              <p>{this.state.error.message}</p>
              <p>{this.state.error.stack}</p>
            </>
          )}
        </div>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary
