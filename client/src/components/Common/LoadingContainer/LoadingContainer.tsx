import { ReactNode } from "react"

import "./LoadingContainer.css"

type LoadingContainerProps = {
    loading: boolean
    beforeLoaded: ReactNode
    children: ReactNode
}

const LoadingContainer: React.FC<LoadingContainerProps> = ({ loading, beforeLoaded, children }) => {
    return (
        <div className="loading-container-container">
            {loading && beforeLoaded}
            {!loading && children}
        </div>
    )
}

export { LoadingContainer }
