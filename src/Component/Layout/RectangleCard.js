import './rectangleCard.scss'
import maxSafety from '../../Asset/mac-safety.webp';
import { Link } from 'react-router-dom';
import React from 'react';

function RectangleCard({data}) {
    const randomThumnail = Math.floor(Math.random() * data.gallery.length);

    return (
        <Link to={`/restaurants/${data._id}/online-order`} className='rectangle-card-container'>
            <div className='image-container'>
                <img src={data.gallery[randomThumnail]} alt={data.name}/>
                <div className='rating-badge'>
                    <span className="rating-value">3.7</span>
                    <span className="material-symbols-outlined star-icon">star</span>
                </div>
            </div>
            <div className='card-content'>
                <div className='restaurant-header'>
                    <h3 className='restaurant-name'>{data.name}</h3>
                </div>
                <div className='restaurant-info'>
                    <p className='cuisine-type'>{data.description.length > 35 ? data.description.slice(0, 35) + '...' : data.description}</p>
                    <div className='price-info'>
                        <span className='price-amount'>$25</span>
                        <span className='price-label'>for one</span>
                    </div>
                </div>
                <div className='safety-badge'>
                    <img src={maxSafety} alt='max-safety' className='safety-icon'/>
                    <span className='safety-text'>Max Safety certified</span>
                </div>
            </div>
        </Link>
    )
}

export default React.memo(RectangleCard);