import React from "react";
import { Link } from "react-router-dom";
import "../styles/Homepage.css";
import grantabt from "../assets/grantabout.png";

function Homepage() {
  return (
    <div className="homepage-container">
      <header className="homepage-header">
        <div className="tex">
        <h1>Welcome to the Grant Portal</h1>
        <p>Your one-stop solution for grants: GrantAI combines automated writing, tailored templates, and seamless applications to turn opportunities into achievements.
        Apply for grants, use GrantAI for automatic grant writing, and access a variety of grant templates designed to make the application process seamless.</p>
        <div className="log">
         <button><Link to="/grantai">GrantAI</Link></button>
         <button><Link to="/grants">Grant</Link></button> 
        </div>
    
        </div>
        <div className='logo'>
         
        </div>
      </header>

       
     
      <section className="intro-section">
        <h2>How it <div className="t">Works</div></h2>
      <div className="features-container">
          <div className="feature">
            <h3>Browse Grant Templates</h3>
            <p>Explore templates specifically designed to assist you in preparing strong grant applications.</p>
            <Link to="/grant-templates" className="cta-button">Explore Templates</Link>
          </div>
          <div className="featuren2">
            <h3>GrantAI: Automated Grant Writing</h3>
            <p>Use GrantAI to generate customized grant proposals tailored to meet specific funding requirements.</p>
            <Link to="/grantai" className="cta-button">Use GrantAI</Link>
          </div>
          <div className="feature">
            <h3>Apply for Grants</h3>
            <p>Find various grant opportunities and submit applications directly through our platform.</p>
            <Link to="/grants" className="cta-button">View Available Grants</Link>
          </div>
        </div>
      </section>

      <section className="about-section">
 
        <h2>About the Grant Portal</h2>
        <div className="ab">
        <div className="ima">
    <img src={grantabt} alt="abt"></img>
   </div>
   <div className="gabt">
        <p>
          The Grant Portal simplifies the grant application process for students and organizations. From discovering new funding opportunities to preparing grant applications with ease, our portal provides all the tools you need.
          We’ve partnered with platforms like NGOBox to help increase access to grants and make the entire process more efficient and effective for users.
          Our mission is to make funding more accessible through a streamlined, user-friendly experience, empowering users to achieve their academic and organizational goals.
        </p>
        </div>
        </div>
      </section>
      <footer className="homepage-footer">
        <div className="footer-content">
          <div className="contact-info">
            <h4>Contact Us</h4>
            <p>Email: info@grantportal.com</p>
            <p>Phone: +91-123-456-7890</p>
            <p>Address: RV University, Mysore Road, Bengaluru, India</p>
          </div>
          <div className="footer-services">
            <h4>Our Services</h4>
            <ul>
              <li><Link to="/grant-templates">Grant Templates</Link></li>
              <li><Link to="/grantai">Automated Grant Writing (GrantAI)</Link></li>
              <li><Link to="/grant-application-assistance">Grant Application Assistance</Link></li>
              <li><Link to="/funding-opportunities">Funding Opportunity Discovery</Link></li>
            </ul>
          </div>
          <div className="partner-info">
            <h4>Partner</h4>
            <p><a href="https://ngobox.org/" target="_blank" rel="noopener noreferrer">NGOBox</a></p>
          </div>
        </div>
        <div className="footer-bottom">
          <p>© 2023 Grant Portal. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

export default Homepage;
      
