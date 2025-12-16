import { useState, useRef, useEffect } from 'react';
import './cardList.scss';
import RoundCard from './Layout/RoundCard';

export default function CardList({ data, heading, css }) {
    const [showLeftBtn, setShowLeftBtn] = useState(false);
    const [showRightBtn, setShowRightBtn] = useState(true);
    const scrollContainerRef = useRef(null);
    const backgroundColor = css && css.backgroundColor ? css.backgroundColor : null;

    const renderCards = data.map((item) => {
        return <RoundCard data={item} key={item._id} css={css} />
    });

    // Check scroll position to show/hide buttons
    const checkScrollButtons = () => {
        if (scrollContainerRef.current) {
            const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
            setShowLeftBtn(scrollLeft > 0);
            setShowRightBtn(scrollLeft < scrollWidth - clientWidth - 10);
        }
    };

    useEffect(() => {
        checkScrollButtons();
        const container = scrollContainerRef.current;
        if (container) {
            container.addEventListener('scroll', checkScrollButtons);
            return () => container.removeEventListener('scroll', checkScrollButtons);
        }
    }, [data]);

    // Smooth scroll function
    const handleScroll = (direction) => {
        if (scrollContainerRef.current) {
            const scrollAmount = 600; // Scroll by ~3 cards at a time
            const currentScroll = scrollContainerRef.current.scrollLeft;
            const targetScroll = direction === 'left'
                ? currentScroll - scrollAmount
                : currentScroll + scrollAmount;

            scrollContainerRef.current.scrollTo({
                left: targetScroll,
                behavior: 'smooth'
            });
        }
    };

    // Mouse drag to scroll
    const [isDragging, setIsDragging] = useState(false);
    const [startX, setStartX] = useState(0);
    const [scrollLeftStart, setScrollLeftStart] = useState(0);

    const handleMouseDown = (e) => {
        setIsDragging(true);
        setStartX(e.pageX - scrollContainerRef.current.offsetLeft);
        setScrollLeftStart(scrollContainerRef.current.scrollLeft);
        scrollContainerRef.current.style.cursor = 'grabbing';
    };

    const handleMouseMove = (e) => {
        if (!isDragging) return;
        e.preventDefault();
        const x = e.pageX - scrollContainerRef.current.offsetLeft;
        const walk = (x - startX) * 2; // Scroll speed multiplier
        scrollContainerRef.current.scrollLeft = scrollLeftStart - walk;
    };

    const handleMouseUp = () => {
        setIsDragging(false);
        if (scrollContainerRef.current) {
            scrollContainerRef.current.style.cursor = 'grab';
        }
    };

    const handleMouseLeave = () => {
        if (isDragging) {
            setIsDragging(false);
            if (scrollContainerRef.current) {
                scrollContainerRef.current.style.cursor = 'grab';
            }
        }
    };

    return (
        <div className='wrapper' style={{backgroundColor:backgroundColor}}>
            <div className='container'>
                <div className='heading'>
                    <h2>{heading}</h2>
                </div>

                {showLeftBtn && (
                    <div className='prev btn' onClick={() => handleScroll('left')}>
                        <span className="material-symbols-outlined">chevron_left</span>
                    </div>
                )}

                {showRightBtn && (
                    <div className='next btn' onClick={() => handleScroll('right')}>
                        <span className="material-symbols-outlined">chevron_right</span>
                    </div>
                )}

                <div
                    className='list-container'
                    ref={scrollContainerRef}
                    onMouseDown={handleMouseDown}
                    onMouseMove={handleMouseMove}
                    onMouseUp={handleMouseUp}
                    onMouseLeave={handleMouseLeave}
                >
                    {renderCards}
                </div>
            </div>
        </div>
    )
}