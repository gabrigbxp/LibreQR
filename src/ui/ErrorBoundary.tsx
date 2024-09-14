import { Component, ErrorInfo, ReactNode } from "react"

interface Props {
    children: ReactNode
}

class ErrorBoundary extends Component<Props, never> {
    constructor(props: Props) {
        super(props)
    }

    componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error("ErrorBoundary caught an error: ", error, errorInfo)
    }

    render() {
        return this.props.children
    }
}

export default ErrorBoundary
