import './skeletonLoader.scss';

export default function SkeletonLoader({ 
    type = 'text', 
    width = '100%', 
    height = '20px',
    count = 1,
    circle = false 
}) {
    const skeletons = Array.from({ length: count }, (_, index) => (
        <div 
            key={index}
            className={`skeleton ${circle ? 'skeleton-circle' : ''}`}
            style={{ width, height }}
        ></div>
    ));

    return <div className="skeleton-container">{skeletons}</div>;
}

// Preset skeleton components for common use cases
export function SkeletonCard() {
    return (
        <div className="skeleton-card">
            <SkeletonLoader width="100%" height="200px" />
            <div className="skeleton-card-content">
                <SkeletonLoader width="80%" height="24px" />
                <SkeletonLoader width="60%" height="16px" />
                <SkeletonLoader width="40%" height="16px" />
            </div>
        </div>
    );
}

export function SkeletonProfile() {
    return (
        <div className="skeleton-profile">
            <SkeletonLoader width="80px" height="80px" circle={true} />
            <div className="skeleton-profile-info">
                <SkeletonLoader width="150px" height="20px" />
                <SkeletonLoader width="100px" height="16px" />
            </div>
        </div>
    );
}

export function SkeletonList({ items = 3 }) {
    return (
        <div className="skeleton-list">
            {Array.from({ length: items }, (_, index) => (
                <div key={index} className="skeleton-list-item">
                    <SkeletonLoader width="60px" height="60px" circle={true} />
                    <div className="skeleton-list-content">
                        <SkeletonLoader width="70%" height="18px" />
                        <SkeletonLoader width="50%" height="14px" />
                    </div>
                </div>
            ))}
        </div>
    );
}

