import { Suspense, useState } from 'react';
import './findFriends.scss';
import { Await, defer, useLoaderData } from 'react-router';
import { fetchData } from '../Utilities/api';
import FindFriendsUserCard from '../Component/User/Layout/FindFriendsUserCard';
import Footer from '../Component/Footer';
import FindFriendsLoader from '../Component/User/Loaders/FindFriendsLoader';

export default function FindFriends() {
    const { users } = useLoaderData();
    const [searchQuery, setSearchQuery] = useState('');

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
    };

    return (
        <>
            <Suspense fallback={<FindFriendsLoader />}>
                <Await resolve={users}>
                    {(loadedUsers) => {
                        // Debug: log the response
                        console.log('Loaded users:', loadedUsers);

                        // Handle both array and object responses
                        const usersArray = Array.isArray(loadedUsers) ? loadedUsers : [];

                        const filteredUsers = usersArray.filter(user =>
                            user.fullname && user.fullname.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            user.email && user.email.toLowerCase().includes(searchQuery.toLowerCase())
                        );

                        return (
                            <div className='find-friends-wrapper'>
                                <div className='find-friends-container'>
                                    <div className='header-section'>
                                        <div className='heading-container'>
                                            <h1 className='heading'>Find Friends</h1>
                                            <p className='subheading'>
                                                Discover and connect with food lovers
                                            </p>
                                        </div>
                                        <div className='search-container'>
                                            <i className='bx bx-search'></i>
                                            <input
                                                type='text'
                                                placeholder='Search by name or email...'
                                                value={searchQuery}
                                                onChange={handleSearchChange}
                                                className='search-input'
                                            />
                                        </div>
                                    </div>

                                    <div className='users-stats'>
                                        <p className='stats-text'>
                                            <span className='count'>{filteredUsers.length}</span> 
                                            {filteredUsers.length === 1 ? ' user found' : ' users found'}
                                        </p>
                                    </div>

                                    <div className='users-grid'>
                                        {filteredUsers.length > 0 ? (
                                            filteredUsers.map(user => (
                                                <FindFriendsUserCard data={user} key={user._id} />
                                            ))
                                        ) : (
                                            <div className='no-results'>
                                                <i className='bx bx-search-alt'></i>
                                                <h3>No users found</h3>
                                                <p>Try adjusting your search query</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    }}
                </Await>
            </Suspense>
            <Footer />
        </>
    );
}

export async function loader() {
    const usersPromise = fetchData('/users', {
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
    }).then(data => {
        // Ensure we always return an array
        if (Array.isArray(data)) {
            return data;
        }
        // If the response has a users property
        if (data && data.users && Array.isArray(data.users)) {
            return data.users;
        }
        // If there's an error
        if (data && data.error) {
            console.error('Error fetching users:', data.error);
            return [];
        }
        // Default to empty array
        return [];
    }).catch(error => {
        console.error('Error loading users:', error);
        return [];
    });

    return defer({
        users: usersPromise
    });
}

