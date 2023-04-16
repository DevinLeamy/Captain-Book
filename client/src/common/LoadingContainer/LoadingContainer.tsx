import { ReactNode } from "react"

type LoadingContainerProps = {
    loading: boolean
    beforeLoaded: ReactNode
    children: ReactNode
}

const LoadingContainer: React.FC<LoadingContainerProps> = ({ loading, beforeLoaded, children }) => {
    return (
        <div className="w-full h-full">
            {loading && beforeLoaded}
            {!loading && children}
        </div>
    )
}

export { LoadingContainer }
