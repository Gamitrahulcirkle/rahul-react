import React from "react";
import './Footer.css'; 

function FooterNav(){
    return(
    <footer style={{ padding: "40px 0", backgroundColor: "#333", color: "#fff" }}>
        <div className="container">
        <div className="row">
            {/* Navigation Links */}
            <div className="col">
            <h4>Navigation</h4>
            <ul>
                <li><a href="#" style={{ color: "#fff" }}>Home</a></li>
                <li><a href="#" style={{ color: "#fff" }}>About</a></li>
                <li><a href="#" style={{ color: "#fff" }}>Shop</a></li>
                <li><a href="#" style={{ color: "#fff" }}>Contact</a></li>
            </ul>
            </div>

            {/* Subscription Form */}
            <div className="col">
            <h4>Subscribe</h4>
            <form>
                <input type="email" placeholder="Enter your email" style={{ padding: "10px", marginRight: "10px" }} />
                <button type="submit" style={{ padding: "10px", backgroundColor: "#007BFF", color: "#fff" }}>Subscribe</button>
            </form>
            </div>

            {/* Social Media Links */}
            <div className="col">
            <h4>Follow Us</h4>
            <ul style={{ listStyleType: "none", padding: "0" }}>
                <li><a href="#" style={{ color: "#fff" }}>Facebook</a></li>
                <li><a href="#" style={{ color: "#fff" }}>Instagram</a></li>
                <li><a href="#" style={{ color: "#fff" }}>Twitter</a></li>
                <li><a href="#" style={{ color: "#fff" }}>LinkedIn</a></li>
            </ul>
            </div>

            {/* Address or Other Info */}
            <div className="col">
            <h4>Contact</h4>
            <p>1234 Some Street, City, Country</p>
            <p>Phone: 123-456-7890</p>
            </div>
        </div>
        </div>
    </footer>
    );
    
}
export default FooterNav;