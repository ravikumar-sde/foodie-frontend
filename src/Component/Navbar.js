import './navbar.scss';
import foodieLogo from '../Asset/foodie-logo.svg';
import useProfile from '../Asset/user-profile.svg';
import { useEffect, useContext, useState } from 'react';
import { locationContext } from '../Context/locationProvider';
import { formContext } from '../Context/formProvider';
import { Outlet, Link, useLoaderData, Form, redirect } from 'react-router-dom';
import SearchCard from './Layout/SearchCard';
import { searchContext } from '../Context/searchProvider';
import { fetchData, fetchDataMultipart, postData } from '../Utilities/api';

export default function Navbar() {
    const { user, profilePicture } = useLoaderData();
    const { handleFormVisibility, handleLoginForm } = useContext(formContext);
    const [searchSuggestion, setSearchSuggestion] = useState([]);
    const [isProfileOptions, setIsProfileOptions] = useState(false);
    const { handleLocation, location } = useContext(locationContext);
    const { isOpen, handleIsOpen } = useContext(searchContext);

    const handleSignUpClick = () => {
        handleFormVisibility('form-container')
    }

    const handleLoginClick = () => {
        handleFormVisibility('form-container')
        handleLoginForm();
    }

    const handleProfileOptions = () => {
        setIsProfileOptions(!isProfileOptions);
    }

    const userGet = async function (e) {
        if (e.target.value) {
            const { brands } = await fetchData(`/restaurants?query=${e.target.value}`);
            setSearchSuggestion(brands);
            handleIsOpen(true);
        } else {
            setSearchSuggestion([]);
            handleIsOpen(false);
        }
    }

    const callApi = function (fn, d) {
        let timer;
        return function () {
            let context = this,
                args = arguments;
            clearTimeout(timer);
            timer = setTimeout(() => {
                fn.apply(context, args);
            }, d)
        }
    }

    const handleApiCall = callApi(userGet, 1000);

    useEffect(() => {
        handleLocation();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const renderSuggestions = searchSuggestion.map(suggestion => {
        return <SearchCard key={suggestion._id} data={suggestion} />
    });

    return (
        <>
            <div className='navbar-container'>
                <div className='logo-container'>
                    <Link to='/'><img src={foodieLogo} alt='Foodie' /></Link>
                </div>
                <div className='location-search-box-container'>
                    <div className='location-container'>
                        <span className="material-symbols-outlined">location_on</span>
                        <p className='location'>{location}</p>
                    </div>
                    <div className='divider-container'>
                        <p className='divider'>|</p>
                    </div>
                    <div className='search-box-container'>
                        <span className="material-symbols-outlined">search</span>
                        <input className='search' placeholder='Search for restaurant, cuisine or a dish' onKeyUp={handleApiCall} />

                        {isOpen && <div className='toggle-suggestions-wrapper'>
                            <div className='suggestions'>
                                {searchSuggestion.length > 0 ? renderSuggestions : <SearchCard />}
                            </div>
                        </div>}
                    </div>
                </div>
                {user.error && <div className='login-signup-container'>
                    <p className='login-btn btn' onClick={handleLoginClick}>Log in</p>
                    <p className='signup-btn btn' onClick={handleSignUpClick}>Sign up</p>
                </div>
                }
                {!user.error && <div className='profile-container'>
                    <div className='image-container' onClick={handleProfileOptions}>
                        <img src={profilePicture || useProfile} alt='profile' />
                    </div>
                    {isProfileOptions && <i className='bx bx-chevron-up' onClick={handleProfileOptions}></i>}
                    {!isProfileOptions && <i className='bx bx-chevron-down' onClick={handleProfileOptions}></i>}
                    {isProfileOptions && <div className='toggle-profile-options'>
                        <ul className='options'>
                            <li onClick={handleProfileOptions}>
                                <Link to={`/profile/${user._id}/reviews`}>
                                    <i className='bx bx-user'></i>
                                    <span>Profile</span>
                                </Link>
                            </li>
                            <li onClick={handleProfileOptions}>
                                <Link to={`/profile/${user._id}/bookmarks`}>
                                    <i className='bx bx-bookmark'></i>
                                    <span>Bookmarks</span>
                                </Link>
                            </li>
                            <li onClick={handleProfileOptions}>
                                <Link to={`/profile/${user._id}/reviews`}>
                                    <i className='bx bx-star'></i>
                                    <span>Reviews</span>
                                </Link>
                            </li>
                            <li onClick={handleProfileOptions}>
                                <Link to={`/profile/${user._id}/followers`}>
                                    <i className='bx bx-group'></i>
                                    <span>Network</span>
                                </Link>
                            </li>
                            <li onClick={handleProfileOptions}>
                                <Link to='/find-friends'>
                                    <i className='bx bx-user-plus'></i>
                                    <span>Find Friends</span>
                                </Link>
                            </li>
                            <div className='divider'></div>
                            <Form action='/logout' method='post' className='list'>
                                <button>
                                    <i className='bx bx-log-out'></i>
                                    <span>Log out</span>
                                </button>
                            </Form>
                        </ul>
                    </div>}
                </div>
                }
            </div>
            <>
                <Outlet />
            </>
        </>
    )
};

export async function loader() {
    const user = await fetchData('/users/me', {
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
    });

    const responseProfilePicture = await fetchDataMultipart(`/users/${user._id}/avatar`);

    let profilePicture;

    if (responseProfilePicture.status !== 400) {
        profilePicture = responseProfilePicture.url;
    }


    return {
        user,
        profilePicture
    };
}

export async function action() {
    const logout = await postData('/users/logout', {
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
    });

    if (logout) {
        return redirect(window.location.pathname);
    } else {
        return logout;
    }
}