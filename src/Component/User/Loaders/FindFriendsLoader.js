import './findFriendsLoader.scss';

export default function FindFriendsLoader() {
    return (
        <div className='find-friends-loader-wrapper'>
            <div className='find-friends-loader-container'>
                <div className='header-section-loader'>
                    <div className='heading-loader'></div>
                    <div className='subheading-loader'></div>
                    <div className='search-loader'></div>
                </div>

                <div className='stats-loader'></div>

                <div className='users-grid-loader'>
                    {[1, 2, 3, 4, 5, 6].map((item) => (
                        <div className='user-card-loader' key={item}>
                            <div className='avatar-loader'></div>
                            <div className='user-info-loader'>
                                <div className='name-loader'></div>
                                <div className='meta-loader'></div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

