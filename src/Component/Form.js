import './form.scss';
import { Formik, Form, Field, ErrorMessage } from "formik";
import { useContext, useState } from 'react';
import { formContext } from '../Context/formProvider';
import * as yup from 'yup';
import { postData } from '../Utilities/api';

export default function Forms() {
    const [credentialErrorMessage, setCredentialErrorMessage] = useState('');
    const [isCorrectCredential, setIsCorrectCredential] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const { formVisibility, handleFormVisibility, isLogin, handleLoginForm } = useContext(formContext);

    const setFormVisibility = () => {
        handleFormVisibility('form-container hidden');
        document.body.style.overflow = 'auto';
        if (!isLogin) {
            handleLoginForm();
        }
    }

    const handleOtherAuthOptionClick = () => {
        handleLoginForm();
    }

    const handleAlertClick = () => {
        setIsCorrectCredential(!isCorrectCredential)
    }

    let validationSchema;

    let initialValues;

    if (!isLogin) {
        initialValues = {
            email: '',
            password: '',
        }

        validationSchema = yup.object({
            email: yup.string().email().required(`Required`),
            password: yup.string().matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=])(?!.*\s).{7,}$/).required('Required')
        });
    } else if (isLogin) {
        initialValues = {
            fullname: '',
            email: '',
            phone: '',
            password: ''
        }

        validationSchema = yup.object({
            fullname: yup.string().required(`Required`),
            email: yup.string().email().required(`Required`),
            phone: yup.number().positive().required(`Required`),
            password: yup.string().matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=])(?!.*\s).{7,}$/).required('Required')
        });
    }

    const onSubmit = async (values) => {
        setIsLoading(true);
        if (values.fullname) {
            const data = await postData("/users/signup", JSON.stringify(values), {
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!data.token) {
                setIsCorrectCredential(true);
                setCredentialErrorMessage(data);
                setIsLoading(false);
            } else {
                localStorage.setItem('token', data.token);
                localStorage.setItem('data',  JSON.stringify(data));
                window.location.href = window.location.pathname;
                setIsLoading(false);
            }
        } else {
            const data = await postData("/users/login", JSON.stringify(values), {
                headers: {
                    'Content-Type': 'application/json'
                },
            });

            if (!data.token) {
                setIsCorrectCredential(true);
                setCredentialErrorMessage(data);
                setIsLoading(false);
            } else {
                localStorage.setItem('token', data.token);
                localStorage.setItem('data', JSON.stringify(data));
                window.location.href = window.location.pathname;
                setIsLoading(false);
            }
        }
    }

    return (
        <div className={formVisibility}>
            <div className='overlay' onClick={setFormVisibility}></div>
            <div className='auth-modal'>
                <button className='close-btn' onClick={setFormVisibility} aria-label="Close">
                    <span className="material-symbols-outlined">close</span>
                </button>

                <div className='auth-header'>
                    <h2 className='auth-title'>
                        {isLogin ? 'Create Account' : 'Welcome Back'}
                    </h2>
                    <p className='auth-subtitle'>
                        {isLogin
                            ? 'Join us to discover amazing food near you'
                            : 'Login to continue your food journey'}
                    </p>
                </div>

                {isCorrectCredential && (
                    <div className='alert-error'>
                        <div className='alert-content'>
                            <span className="material-symbols-outlined alert-icon">error</span>
                            <p className='alert-message'>{credentialErrorMessage}</p>
                        </div>
                        <button className='alert-close' onClick={handleAlertClick} aria-label="Close alert">
                            <span className="material-symbols-outlined">close</span>
                        </button>
                    </div>
                )}

                <Formik
                    initialValues={initialValues}
                    onSubmit={onSubmit}
                    validationSchema={validationSchema}>
                    <Form method='post' className='auth-form'>
                        {isLogin && (
                            <div className='form-group'>
                                <label htmlFor='fullname' className='form-label'>Full Name</label>
                                <Field
                                    id='fullname'
                                    className='form-input'
                                    name='fullname'
                                    placeholder='Enter your full name'
                                    type='text'
                                />
                                <ErrorMessage name='fullname' component='div' className='error-message' />
                            </div>
                        )}

                        <div className='form-group'>
                            <label htmlFor='email' className='form-label'>Email Address</label>
                            <Field
                                id='email'
                                className='form-input'
                                name='email'
                                placeholder='Enter your email'
                                type='email'
                            />
                            <ErrorMessage name='email' component='div' className='error-message' />
                        </div>

                        {isLogin && (
                            <div className='form-group'>
                                <label htmlFor='phone' className='form-label'>Phone Number</label>
                                <Field
                                    id='phone'
                                    className='form-input'
                                    name='phone'
                                    placeholder='Enter your phone number'
                                    type='tel'
                                />
                                <ErrorMessage name='phone' component='div' className='error-message' />
                            </div>
                        )}

                        <div className='form-group'>
                            <label htmlFor='password' className='form-label'>Password</label>
                            <Field
                                id='password'
                                className='form-input'
                                name='password'
                                type='password'
                                placeholder='Enter your password'
                            />
                            <ErrorMessage name='password' component='div' className='error-message' />
                        </div>

                        <button className='submit-btn' type='submit' disabled={isLoading}>
                            {isLoading ? (
                                <span className='btn-content'>
                                    <i className='bx bx-loader-alt loader'></i>
                                    <span>Processing...</span>
                                </span>
                            ) : (
                                <span className='btn-content'>
                                    {isLogin ? 'Create Account' : 'Login'}
                                    <span className="material-symbols-outlined btn-icon">arrow_forward</span>
                                </span>
                            )}
                        </button>
                    </Form>
                </Formik>

                <div className='auth-footer'>
                    {isLogin ? (
                        <p className='footer-text'>
                            Already have an account?{' '}
                            <button className='link-btn' onClick={handleOtherAuthOptionClick}>
                                Log in
                            </button>
                        </p>
                    ) : (
                        <p className='footer-text'>
                            Don't have an account?{' '}
                            <button className='link-btn' onClick={handleOtherAuthOptionClick}>
                                Create account
                            </button>
                        </p>
                    )}
                </div>
            </div>
        </div>
    )
}