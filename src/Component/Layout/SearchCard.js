import './searchCard.scss';
import { Link } from 'react-router-dom';
import { searchContext } from '../../Context/searchProvider';
import { useContext } from 'react';

export default function SearchCard({ data }) {
    const { handleIsOpen } = useContext(searchContext);

    const handleCardVisibilty = () => {
        handleIsOpen(false);
    }

    return (
        <>
            {data ? (
                <div className='search-result-wrapper'>
                    <Link to={`/restaurants/${data._id}/online-order`} className='search-card-container' onClick={handleCardVisibilty}>
                        <div className='image-container'>
                            <div className='image'>
                                <img src={data.image} alt={data.name} />
                            </div>
                        </div>
                        <div className='about-search-container'>
                            <div className='search-name'>
                                <h3 className='name'>{data.name}</h3>
                            </div>
                            <div className='search-meta'>
                                {data.rating > 0 && (
                                    <>
                                        <div className='rating-container'>
                                            <i className='bx bxs-star'></i>
                                            <span className='rating'>{data.rating}</span>
                                            <span className='review-count'>({data.reviewCount})</span>
                                        </div>
                                        {data.cuisine && <div className='dot-separator'></div>}
                                    </>
                                )}
                                {data.cuisine && (
                                    <div className='cuisine-type'>
                                        <i className='bx bxs-dish'></i>
                                        <span>{data.cuisine}</span>
                                    </div>
                                )}
                            </div>
                        </div>
                        <i className='bx bx-right-arrow-alt arrow-icon'></i>
                    </Link>

                    {data.matchingDishes && data.matchingDishes.length > 0 && (
                        <div className='matching-dishes-container'>
                            <div className='dishes-header'>
                                <i className='bx bx-dish'></i>
                                <span>Matching Items</span>
                            </div>
                            <div className='dishes-list'>
                                {data.matchingDishes.map((dish) => (
                                    <Link
                                        key={dish._id}
                                        to={`/restaurants/${data._id}/online-order`}
                                        className='dish-item'
                                        onClick={handleCardVisibilty}
                                    >
                                        {dish.image && (
                                            <div className='dish-image'>
                                                <img src={dish.image} alt={dish.name} />
                                            </div>
                                        )}
                                        <div className='dish-info'>
                                            <div className='dish-name-type'>
                                                <span className='dish-name'>{dish.name}</span>
                                                {dish.type && (
                                                    <span className={`dish-type ${dish.type.toLowerCase()}`}>
                                                        {dish.type === 'veg' ? '🟢' : '🔴'}
                                                    </span>
                                                )}
                                            </div>
                                            <span className='dish-price'>₹{dish.price}</span>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            ) : (
                <div className='not-found-data'>
                    <h2 className='heading'>Oops!</h2>
                    <p className='message'>We could not understand what you mean, try rephrasing the query.</p>
                </div>
            )}
        </>
    )
}