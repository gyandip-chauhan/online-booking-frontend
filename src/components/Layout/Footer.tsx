import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gradient-to-b from-gray-900 to-gray-800 text-white py-4">
      <div className="container mx-auto text-center">
        <p className="text-gray-400">&copy; {new Date().getFullYear()} BookMyShow. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
