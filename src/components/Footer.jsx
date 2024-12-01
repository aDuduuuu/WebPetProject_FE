import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-16423C text-C4DACB py-8">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

          <div className="flex flex-col items-center md:items-start">
            <h3 className="text-xl font-semibold mb-4">Quick Links</h3>
            <ul>
              <li><a href="#" className="text-C4DACB hover:text-white">About Us</a></li>
              <li><a href="#" className="text-C4DACB hover:text-white">Services</a></li>
              <li><a href="#" className="text-C4DACB hover:text-white">Contact</a></li>
              <li><a href="#" className="text-C4DACB hover:text-white">Privacy Policy</a></li>
            </ul>
          </div>

          <div className="flex flex-col items-center md:items-start">
            <h3 className="text-xl font-semibold mb-4">Help</h3>
            <ul>
              <li><a href="#" className="text-C4DACB hover:text-white">Advise</a></li>
              <li><a href="#" className="text-C4DACB hover:text-white">service support</a></li>
            </ul>
          </div>


          {/* Social Icons Section */}
          <div className="flex flex-col items-center md:items-start">
            <h3 className="text-xl font-semibold mb-4">Follow Us</h3>
            <div className="flex space-x-6">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-C4DACB hover:text-white">
                <i className="fab fa-facebook-f"></i>
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-C4DACB hover:text-white">
                <i className="fab fa-twitter"></i>
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-C4DACB hover:text-white">
                <i className="fab fa-instagram"></i>
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-C4DACB hover:text-white">
                <i className="fab fa-linkedin-in"></i>
              </a>
            </div>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="mt-8 border-t border-C4DACB pt-6 text-center">
          <p>&copy; {new Date().getFullYear()} WoofHaven. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
