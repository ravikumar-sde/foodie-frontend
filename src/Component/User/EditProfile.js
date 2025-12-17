import './editProfile.scss';
import profileImg from '../../Asset/user-profile.svg';
import { useContext, useRef, useState } from 'react';
import { formContext } from '../../Context/formProvider';
import { profileContext } from '../../Context/profileProvider';
import { useLoaderData } from 'react-router';
import { patchData } from '../../Utilities/api';

export default function EditProfile() {
    const [editIsOpen, setEditIsOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const { editProfileForm, setEditProfileForm } = useContext(formContext);
    const { profile } = useLoaderData();
    const profileRef = useRef();
    const { updatedProfile, handleProfilePicture, handleRemoveProfilePhoto, handleProfileUpdate, profilePhoto } = useContext(profileContext);
    const [input, setInput] = useState({ fullname: updatedProfile ? updatedProfile.fullname : profile.fullname, phone: updatedProfile ? updatedProfile.phone : profile.phone });

    const handleIsOpenToggling = () => {
        setEditIsOpen(!editIsOpen);
    }

    const handleChangePhotoClick = () => {
        if (profileRef.current) {
            profileRef.current.click();
        }
    }

    const handleFileInput = async (e) => {
        const selectedFile = e.target.files[0];
        const formData = new FormData();
        formData.append('avatar', selectedFile);

        setIsLoading(true)
        await handleProfilePicture(formData);
        setIsLoading(false);
    }

    const handleRemoveProfile = async (e) => {
        setIsLoading(true)
        await handleRemoveProfilePhoto();
        setIsLoading(false);
    }

    const handleFormVisibility = () => {
        setEditProfileForm('hidden');
    }

    const handleOnChangeProfileInfo = (e) => {
        setInput({ ...input, [e.target.name]: e.target.value })
    }

    const updateFormData = async (e) => {
        e.preventDefault();

        setIsLoading(true);
        const result = await patchData('/users/me',
            JSON.stringify({ fullname: input.fullname, phone: input.phone }),
            {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'application/json'
                },
            });

        if (result.user) {
            handleProfileUpdate(result.user);
            setIsLoading(false);
        } else {
            setIsLoading(false);
        }
    }

    return (
        <div className={editProfileForm}>
            <div className='overlay' onClick={handleFormVisibility}></div>
            <div className='edit-profile-container'>
                <button className='close-btn' onClick={handleFormVisibility}>
                    <i className='bx bx-x'></i>
                </button>

                <div className='modal-header'>
                    <h2>Edit Profile</h2>
                    <p>Update your profile information and photo</p>
                </div>

                <div className='image-container'>
                    <div className='image'>
                        {isLoading ? <div className='img-overlay'><i className='bx bx-loader-alt loader'></i></div> : <div className='img-overlay'><i className='bx bxs-camera-plus' onClick={handleIsOpenToggling}></i></div>}
                        <img src={profilePhoto ? profilePhoto : profileImg} alt='profile-img' />
                    </div>
                    {editIsOpen && !isLoading && <div className='edit-delete-profile-picture-container'>
                        <button className='change-photo btn' onClick={handleChangePhotoClick}>Change Photo</button>
                        <input id='progile-img' type='file' className='edit-profile' style={{ display: 'none' }} ref={profileRef} onChange={handleFileInput} />
                        <button className='delete-photo btn' onClick={handleRemoveProfile}>Remove Photo</button>
                    </div>}
                </div>
                <form className='details-container'>
                    <div className='list name'>
                        <label htmlFor='name'>Name</label>
                        <input id='name' name='fullname' type='text' value={input.fullname} onChange={handleOnChangeProfileInfo} />
                    </div>
                    <div className='list number'>
                        <label htmlFor='number'>Mobile number</label>
                        <input id='number' name='phone' type='number' value={input.phone} onChange={handleOnChangeProfileInfo} />
                    </div>
                    <div className='list btn-container'>
                        {isLoading ? (
                            <button className='btn' disabled>
                                <i className='bx bx-loader-alt'></i>
                                <span>Updating...</span>
                            </button>
                        ) : (
                            <button className='btn' type='submit' onClick={updateFormData}>
                                <span>Update Profile</span>
                            </button>
                        )}
                    </div>
                </form>
            </div>
        </div >
    )
}