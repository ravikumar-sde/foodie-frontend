import './footer.scss';
import logo from '../Asset/foodie-logo.svg'
import { Link } from 'react-router-dom';

export default function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className='footer-wrapper'>
            <div className='footer-container'>
                {/* Top Section */}
                <div className='footer-top'>
                    <div className='logo-section'>
                        <div className='logo-container'>
                            <img src={logo} alt='Foodie Logo' />
                        </div>
                        <p className='tagline'>Discover the best food & drinks in your city</p>
                    </div>

                    <div className='app-download-section'>
                        <p className='download-heading'>Download the App</p>
                        <div className='app-buttons'>
                            <a href='#' className='app-button'>
                                <i className='bx bxl-play-store'></i>
                                <div className='button-text'>
                                    <span className='small'>GET IT ON</span>
                                    <span className='large'>Google Play</span>
                                </div>
                            </a>
                            <a href='#' className='app-button'>
                                <i className='bx bxl-apple'></i>
                                <div className='button-text'>
                                    <span className='small'>Download on the</span>
                                    <span className='large'>App Store</span>
                                </div>
                            </a>
                        </div>
                    </div>
                </div>

                {/* Divider */}
                <div className='footer-divider'></div>

                {/* Links Section */}
                <div className='footer-links'>
                    <div className='link-column'>
                        <h3 className='column-heading'>About Zomato</h3>
                        <ul className='link-list'>
                            <li><a href='#'>Who We Are</a></li>
                            <li><a href='#'>Blog</a></li>
                            <li><a href='#'>Work With Us</a></li>
                            <li><a href='#'>Investor Relations</a></li>
                            <li><a href='#'>Report Fraud</a></li>
                            <li><a href='#'>Contact Us</a></li>
                        </ul>
                    </div>

                    <div className='link-column'>
                        <h3 className='column-heading'>Zomaverse</h3>
                        <ul className='link-list'>
                            <li><a href='#'>Zomato</a></li>
                            <li><a href='#'>Blinkit</a></li>
                            <li><a href='#'>Feeding India</a></li>
                            <li><a href='#'>Hyperpure</a></li>
                            <li><a href='#'>Zomaland</a></li>
                        </ul>
                    </div>

                    <div className='link-column'>
                        <h3 className='column-heading'>For Restaurants</h3>
                        <ul className='link-list'>
                            <li><a href='#'>Partner With Us</a></li>
                            <li><a href='#'>Apps For You</a></li>
                            <li><Link to='/'>Zomato For Enterprise</Link></li>
                        </ul>
                    </div>

                    <div className='link-column'>
                        <h3 className='column-heading'>Learn More</h3>
                        <ul className='link-list'>
                            <li><a href='#'>Privacy</a></li>
                            <li><a href='#'>Security</a></li>
                            <li><a href='#'>Terms</a></li>
                            <li><a href='#'>Sitemap</a></li>
                        </ul>
                    </div>

                    <div className='link-column social-column'>
                        <h3 className='column-heading'>Connect With Us</h3>
                        <div className='social-links'>
                            <a href='#' className='social-link' aria-label='LinkedIn'>
                                <i className='bx bxl-linkedin-square'></i>
                            </a>
                            <a href='#' className='social-link' aria-label='Instagram'>
                                <i className='bx bxl-instagram-alt'></i>
                            </a>
                            <a href='#' className='social-link' aria-label='Twitter'>
                                <i className='bx bxl-twitter'></i>
                            </a>
                            <a href='#' className='social-link' aria-label='YouTube'>
                                <i className='bx bxl-youtube'></i>
                            </a>
                            <a href='#' className='social-link' aria-label='Facebook'>
                                <i className='bx bxl-facebook-square'></i>
                            </a>
                        </div>
                    </div>
                </div>

                {/* Bottom Section */}
                <div className='footer-bottom'>
                    <div className='footer-divider'></div>
                    <div className='bottom-content'>
                        <p className='copyright'>
                            By continuing past this page, you agree to our <a href='#'>Terms of Service</a>, <a href='#'>Cookie Policy</a>, <a href='#'>Privacy Policy</a> and <a href='#'>Content Policies</a>. All trademarks are properties of their respective owners. 2008-{currentYear} © Zomato™ Ltd. All rights reserved.
                        </p>
                    </div>
                </div>
            </div>
        </footer>
    )
}