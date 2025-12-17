import './inlineLoader.scss';

export default function InlineLoader({ size = 'medium', text = '' }) {
    const sizeClass = `loader-${size}`;
    
    return (
        <div className={`inline-loader ${sizeClass}`}>
            <div className="spinner"></div>
            {text && <span className="loader-text">{text}</span>}
        </div>
    );
}

