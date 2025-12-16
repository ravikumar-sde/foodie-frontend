import './roundCard.scss';
import { Link, useLoaderData } from 'react-router-dom';

export default function RoundCard({ data, css }) {
    const { brands } = useLoaderData();

    const brand = brands.filter(brand => {
        return brand.name === data.name
    });

    const boxShadow = css && css.boxShadow ? css.boxShadow : null;
    const width = css && css.width ? css.width : null;

    return (
        <div className='round-card-container'>
            {brand.length
            ? <Link to={`/restaurants/${data._id}/online-order`} className='round-card'>
                <div className='image-container'>
                    <div className='image' style={{boxShadow: boxShadow}}>
                        <img src={data.image} alt={data.name} style={{width: width }} />
                    </div>
                </div>
                <div className='name'>
                    <h6>{data.name}</h6>
                </div>
            </Link>
            :
            <Link to={`/restaurants?query=${data.name}`} className='round-card'>
                <div className='image-container'>
                    <div className='image' style={{boxShadow: boxShadow}}>
                        <img src={data.image} alt={data.name} style={{width: width }} />
                    </div>
                </div>
                <div className='name'>
                    <h6>{data.name}</h6>
                </div>
            </Link> }
        </div>
    )
}