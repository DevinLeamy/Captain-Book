const LoadingComponent = ({ loading }: { loading: boolean }) => {
    return <>
        {loading &&
            <div id="loading">
                <p
                    className="loading-text"
                    style={{ color: "#363636", fontWeight: "600" }}
                >
                    Loading...
                </p>
            </div>
        }
    </>
}

export { LoadingComponent }
