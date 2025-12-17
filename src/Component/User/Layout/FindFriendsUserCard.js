import { useContext, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { formContext } from '../../../Context/formProvider';
import { fetchDataMultipart, postData, deleteData } from '../../../Utilities/api';
import profileImg from '../../../Asset/user-profile.svg';
import './findFriendsUserCard.scss';

export default function FindFriendsUserCard({ data }) {
    const { loggedInUser } = useContext(formContext);
    const [redirectLink, setRedirectLink] = useState(`/user/${data._id}/reviews`);
    const [profilePicture, setProfilePicture] = useState(profileImg);
    const [isFollowing, setIsFollowing] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        // Check if this is the logged-in user
        if (loggedInUser && loggedInUser.users && data.email === loggedInUser.users.email) {
            setRedirectLink(`/profile/${data._id}/reviews`);
        }

        // Check if already following
        if (loggedInUser && loggedInUser.users && loggedInUser.users.following) {
            const following = loggedInUser.users.following.some(
                (user) => user._id === data._id || user === data._id
            );
            setIsFollowing(following);
        }

        // Fetch profile picture
        (async () => {
            const picture = await fetchDataMultipart(`/users/${data._id}/avatar`);
            if (picture.status !== 400) {
                setProfilePicture(picture.url);
            }
        })();
    }, [loggedInUser, data]);

    const handleFollowClick = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            if (isFollowing) {
                await deleteData(`/users/${data._id}/follow`, {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                });
                setIsFollowing(false);
            } else {
                await postData(`/users/${data._id}/follow`, '', {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                });
                setIsFollowing(true);
            }
        } catch (error) {
            console.error('Error following/unfollowing user:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const isLoggedInUser = loggedInUser && loggedInUser.users && data.email === loggedInUser.users.email;

    return (
        <div className='find-friends-user-card'>
            <Link to={redirectLink} className='user-avatar'>
                <img src={profilePicture} alt={data.fullname} />
            </Link>
            
            <div className='user-info'>
                <Link to={redirectLink} className='user-name'>
                    <h3>{data.fullname}</h3>
                </Link>
                
                <div className='user-stats'>
                    <span className='stat'>
                        <i className='bx bx-star'></i>
                        {data.reviews ? data.reviews.length : 0} reviews
                    </span>
                    <span className='stat'>
                        <i className='bx bx-group'></i>
                        {data.followers ? data.followers.length : 0} followers
                    </span>
                </div>
            </div>

            {!isLoggedInUser && (
                <button
                    className={`follow-btn ${isFollowing ? 'following' : ''}`}
                    onClick={handleFollowClick}
                    disabled={isLoading}
                >
                    {isLoading ? (
                        <i className='bx bx-loader-alt bx-spin'></i>
                    ) : isFollowing ? (
                        <>
                            <i className='bx bxs-user-check'></i>
                            <span>Following</span>
                        </>
                    ) : (
                        <>
                            <i className='bx bx-user-plus'></i>
                            <span>Follow</span>
                        </>
                    )}
                </button>
            )}
        </div>
    );
}

