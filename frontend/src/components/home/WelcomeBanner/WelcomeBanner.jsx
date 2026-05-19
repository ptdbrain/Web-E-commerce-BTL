import React, { useState } from 'react';
import { FaLaptop, FaLaptopCode } from 'react-icons/fa';

import { Fade } from "react-awesome-reveal"; 

function WelcomeBanner() {
  const [isHovered, setIsHovered] = useState(false);
  

  const welcomeText = "Welcome to our shop";

  return (
    <div className="flex justify-between items-center bg-neutral-900 text-white px-16 py-10 rounded-2xl m-5 overflow-hidden relative font-sans">
      <div className="banner-text">
        
        
        <Fade cascade damping={0.05} triggerOnce>
          
          
          <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-400 via-cyan-300 to-blue-400 bg-clip-text text-transparent bg-[length:200%_auto] animate-textShine">
            {welcomeText.split('').map((char, index) => (
              <span key={index} style={{ display: 'inline-block' }}>
               
                {char === ' ' ? '\u00A0' : char}
              </span>
            ))}
          </h1>

          
          <p className="text-lg text-gray-300 mt-2.5">
            Tìm kiếm sản phẩm công nghệ tốt nhất tại đây.
          </p>

        </Fade>
      </div>
  
      <div 
        className="cursor-pointer transition-transform duration-300 ease-in-out hover:scale-110"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {isHovered ? (
          <FaLaptopCode className="text-9xl text-cyan-400" />
        ) : (
          <FaLaptop className="text-9xl text-cyan-400" />
        )}
      </div>
    </div>
  );
}

export default WelcomeBanner;