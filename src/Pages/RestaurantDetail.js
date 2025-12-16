import './restaurantDetail.scss';
import RestDetailHeader from '../Component/Restaurant/RestDetailHeader';
import FoodDetailNavbar from '../Component/Restaurant/FoodDetailNavbar';
import { Outlet, redirect } from 'react-router';
import Footer from '../Component/Footer';
import { fetchData, postData, deleteData } from '../Utilities/api';
import CartPopup from '../Component/Restaurant/Cart/CartPopup';
import CartProvider from '../Context/cartProvider';

export default function RestaurantDetail() {
    return (
        <>
            <div className='restaurant-detail-wrapper'>
                <CartProvider>
                    <CartPopup />
                </CartProvider>
                <RestDetailHeader />
                <FoodDetailNavbar />
                <Outlet />
            </div>
            <Footer />
        </>
    );
}

export async function loader({ params }) {
    const { brand } = await fetchData(`/restaurants/${params.id}`);

    const user = await fetchData('/users/me', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
    });
    const { bookmarks } = await fetchData(`/users/${user._id}/bookmarks`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
    });

    const reviews = await fetchData(`/restaurants/${params.id}/reviews`);

    return { brand, user, bookmarks, reviews };
}

export async function action({ request, params }) {
    let bookmark = ''
    if (request.method === 'POST') {
        bookmark = await postData(`/restaurants/${params.id}/bookmark`, '', {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });
    } else {
        bookmark = await deleteData(`/restaurants/${params.id}/bookmark`, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });
    }

    if (bookmark.success) {
        return redirect(window.location.href);
    }

    return bookmark;
}