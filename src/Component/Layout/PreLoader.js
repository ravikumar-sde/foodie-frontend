import './preLoader.scss';

export default function PreLoader() {
    return (
        <div className="universal-loader">
            <div className="line"></div>
            <div className="loader-content">
                <div className="spinner"></div>
                <div className="loading-text">Loading</div>
                <div className="loading-dots">
                    <div className="dot"></div>
                    <div className="dot"></div>
                    <div className="dot"></div>
                </div>
            </div>
        </div>
    )
}