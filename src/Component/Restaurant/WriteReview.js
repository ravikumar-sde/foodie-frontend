import { useContext, useState } from 'react';
import './writeReview.scss';
import { reviewContext } from '../../Context/reviewProvider';
import { postData } from '../../Utilities/api';

export default function WriteComment() {
    const [rating, setRating] = useState(0);
    const [feedback, setFeedback] = useState('');
    const [file, setFile] = useState(null);
    const { isFormVisibile, handleReviewFormVisibility } = useContext(reviewContext);
    const [isLoading, setIsLoading] = useState(false);

    const handleStarClick = (selectedRating) => {
        setRating(selectedRating);
    };

    const handleFormVisibility = () => {
        setRating(0);
        setFeedback('');
        setFile('');
        handleReviewFormVisibility('write-review-wrapper hidden');
        document.body.style.overflow = 'auto';
    }

    const handleFeedbackOnChange = (e) => {
        setFeedback(e.target.value)
    }

    const handleFileUpload = (e) => {
        const selectedFiles = Array.from(e.target.files);
        setFile(selectedFiles);
    }

    const handleFormData = async (e) => {
        e.preventDefault();
        let formData = new FormData();
        formData.append('rating', rating);
        formData.append('review', feedback);

        if (file && file.length) {
            file.forEach((file) => {
                formData.append(`images`, file);
            });
        }

        setIsLoading(true);
        const result = await postData(`${window.location.pathname}`, formData, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
            },
        })

        if (result._id) {
            setIsLoading(false);
            handleReviewFormVisibility('write-review-wrapper hidden');
            document.body.style.overflow = 'auto';
            setRating(0);
            setFeedback('');
            setFile('');
        }
    }

    const ratingLabels = {
        1: 'Poor',
        2: 'Fair',
        3: 'Good',
        4: 'Very Good',
        5: 'Excellent'
    };

    return (
        <div className={isFormVisibile}>
            <div className='overlay' onClick={handleFormVisibility}></div>
            <form className='write-review-container'>
                <div className='review-header'>
                    <div className='header-content'>
                        <i className='bx bx-edit-alt header-icon'></i>
                        <h2 className='heading'>Write a Review</h2>
                    </div>
                    <button type='button' className='close-btn' onClick={handleFormVisibility}>
                        <i className='bx bx-x'></i>
                    </button>
                </div>

                <div className='review-body'>
                    <div className='rating-section'>
                        <div className='section-header'>
                            <i className='bx bx-star section-icon'></i>
                            <h3>Rate your experience</h3>
                        </div>
                        <div className='rating-container'>
                            <ul className='star-container'>
                                {[1, 2, 3, 4, 5].map((star) => {
                                    return (
                                        <li className='star-item' key={star}>
                                            <i
                                                className={`bx ${star <= rating ? 'bxs-star' : 'bx-star'}`}
                                                onClick={() => handleStarClick(star)}
                                            ></i>
                                        </li>
                                    )
                                })}
                            </ul>
                            {rating > 0 && (
                                <p className='rating-label'>{ratingLabels[rating]}</p>
                            )}
                        </div>
                    </div>

                    <div className='comment-section'>
                        <div className='section-header'>
                            <i className='bx bx-message-square-detail section-icon'></i>
                            <h3>Share your feedback</h3>
                        </div>
                        <textarea
                            id='comment'
                            className='comment-input'
                            placeholder='Tell us about your experience... What did you like? What could be improved?'
                            value={feedback}
                            onChange={handleFeedbackOnChange}
                            rows='6'
                        ></textarea>
                        <p className='character-count'>{feedback.length} characters</p>
                    </div>

                    <div className='upload-section'>
                        <div className='section-header'>
                            <i className='bx bx-image-add section-icon'></i>
                            <h3>Add photos (optional)</h3>
                        </div>
                        <div className='upload-area'>
                            <input
                                type='file'
                                id='file-upload'
                                className='file-input'
                                multiple
                                accept='image/*'
                                onChange={handleFileUpload}
                            />
                            <label htmlFor='file-upload' className='upload-label'>
                                <i className='bx bx-cloud-upload'></i>
                                <span className='upload-text'>
                                    {file && file.length > 0
                                        ? `${file.length} photo${file.length > 1 ? 's' : ''} selected`
                                        : 'Click to upload or drag and drop'}
                                </span>
                                <span className='upload-hint'>PNG, JPG up to 10MB</span>
                            </label>
                        </div>
                    </div>
                </div>

                <div className='review-footer'>
                    <button
                        type='button'
                        className='cancel-btn'
                        onClick={handleFormVisibility}
                        disabled={isLoading}
                    >
                        Cancel
                    </button>
                    <button
                        type='submit'
                        className='submit-btn'
                        onClick={handleFormData}
                        disabled={isLoading || rating === 0}
                    >
                        {isLoading ? (
                            <>
                                <i className='bx bx-loader-alt loader'></i>
                                <span>Submitting...</span>
                            </>
                        ) : (
                            <>
                                <span>Submit Review</span>
                                <i className='bx bx-send'></i>
                            </>
                        )}
                    </button>
                </div>
            </form>
        </div>
    )
}