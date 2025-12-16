import './home.scss';
import CardList from "../Component/CardList";
import Header from '../Component/Header';
import RestaurantList from '../Component/RestaurantList';
import LocationProvider from '../Context/locationProvider';
import { useLoaderData, useNavigation } from 'react-router';
import UniversalLoader from '../Component/Layout/PreLoader';
import Footer from "../Component/Footer";
import { fetchData } from '../Utilities/api';

export default function Home() {
    const { brands, cuisines } = useLoaderData();
    const navigation = useNavigation();

    const css = {
        boxShadow: "rgba(0, 0, 0, 0) 0px 0px 0px",
        width: '100%',
    };

    return (
        <>
        { navigation.state !== 'loading' ? <div className='home-page-container'>
            {/* Hero Section */}
            <section className='hero-section'>
                <div className='hero-content'>
                    <h1 className='hero-title'>
                        Discover the best food & drinks near you
                    </h1>
                    <p className='hero-subtitle'>
                        Order from your favorite restaurants and get it delivered to your doorstep
                    </p>
                </div>
                <div className='hero-stats'>
                    <div className='stat-item'>
                        <span className='stat-number'>{brands.length}+</span>
                        <span className='stat-label'>Restaurants</span>
                    </div>
                    <div className='stat-divider'></div>
                    <div className='stat-item'>
                        <span className='stat-number'>{cuisines.length}+</span>
                        <span className='stat-label'>Cuisines</span>
                    </div>
                    <div className='stat-divider'></div>
                    <div className='stat-item'>
                        <span className='stat-number'>Fast</span>
                        <span className='stat-label'>Delivery</span>
                    </div>
                </div>
            </section>

            <Header />

            {/* Cuisines Section */}
            <section className='section-wrapper cuisines-section'>
                <CardList data={cuisines} heading='Inspiration for your first order' css={css} />
            </section>

            {/* Top Brands Section */}
            <section className='section-wrapper brands-section'>
                <CardList data={brands} heading='Top brands for you' />
            </section>

            {/* Restaurants Section */}
            <section className='section-wrapper restaurants-section'>
                <LocationProvider>
                    <RestaurantList data={brands} />
                </LocationProvider>
            </section>

            <Footer />
        </div> : <UniversalLoader />
        }
        </>
    )
}

export async function loader() {
    const {brands} = await fetchData("/restaurants");
    const {cuisines} = await fetchData("/cuisines");

    return { brands, cuisines };
}