import React, { useState } from 'react';
import { FaFacebookF, FaYoutube, FaInstagram, FaMapMarkerAlt, FaPhoneAlt, FaEnvelope } from 'react-icons/fa';
import { SiZalo } from 'react-icons/si'; // Icon Zalo

const Footer = () => {
  const [isOn, setIsOn] = useState(false);

  const toggleLight = () => {
    setIsOn(!isOn);
  };

  return (
    <footer className="bg-[#0f172a] text-slate-300 py-10 font-sans overflow-hidden relative">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          
          {/* Cột 1: Nói về nhóm*/}
          <div>
            <h3 className="text-blue-500 font-bold mb-4 uppercase">Về chúng tôi</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-blue-400 transition-colors duration-300">Giới thiệu Tech-Geeks</a></li>
              <li><a href="#" className="hover:text-blue-400 transition-colors duration-300">Tuyển dụng</a></li>
              <li><a href="#" className="hover:text-blue-400 transition-colors duration-300">Điều khoản dịch vụ</a></li>
            </ul>
          </div>

          {/* Cột 2: Policy */}
          <div>
            <h3 className="text-blue-500 font-bold mb-4 uppercase">Chính sách</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-blue-400 transition-colors duration-300">Chính sách bảo mật</a></li>
              <li><a href="#" className="hover:text-blue-400 transition-colors duration-300">Chính sách đổi trả</a></li>
              <li><a href="#" className="hover:text-blue-400 transition-colors duration-300">Vận chuyển & Giao nhận</a></li>
            </ul>
          </div>

          {/* Cột 3: Hỗ trợ */}
          <div>
            <h3 className="text-blue-500 font-bold mb-4 uppercase">Hỗ trợ</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-blue-400 transition-colors duration-300">Hướng dẫn mua hàng</a></li>
              <li><a href="#" className="hover:text-blue-400 transition-colors duration-300">Tra cứu đơn hàng</a></li>
              <li><a href="#" className="hover:text-blue-400 transition-colors duration-300">Câu hỏi thường gặp</a></li>
            </ul>
          </div>

          
          <div>
            <h3 className="text-blue-500 font-bold mb-4 uppercase">Liên hệ</h3>
            <div className="space-y-3 text-sm">
              <p className="flex items-start gap-2">
                <FaMapMarkerAlt className="mt-1 flex-shrink-0" /> 
                <span>Ghé thăm của hàng tại D9-301, HUST</span>
              </p>
              <p className="flex items-center gap-2">
                <FaPhoneAlt /> 
                <span>(1993) 379 7163</span>
              </p>
              <p className="flex items-center gap-2">
                <FaEnvelope /> 
                <span>email@tech-geeks.com.vn</span>
              </p>
              
              {/* Social Icons */}
              <div className="flex gap-3 mt-4">
                <a href="#" className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center hover:bg-blue-600 hover:-translate-y-1 transition-all duration-300">
                  <FaFacebookF className="text-white" />
                </a>
                <a href="#" className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center hover:bg-red-600 hover:-translate-y-1 transition-all duration-300">
                  <FaYoutube className="text-white" />
                </a>
                <a href="#" className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center hover:bg-pink-600 hover:-translate-y-1 transition-all duration-300">
                  <FaInstagram className="text-white" />
                </a>
                <a href="#" className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center hover:bg-blue-500 hover:-translate-y-1 transition-all duration-300">
                  <SiZalo className="text-white" />
                </a>
              </div>
            </div>
          </div>

          {/*Light Bulb */}
          <div className="flex flex-col items-center justify-center relative">
           
            <div 
              className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-yellow-400 rounded-full blur-[80px] transition-opacity duration-700 pointer-events-none z-0 ${isOn ? 'opacity-40' : 'opacity-0'}`}
            ></div>

            <div 
              onClick={toggleLight}
              className="relative z-10 cursor-pointer flex flex-col items-center group"
            >
              
              <img 
                src="https://cdn-icons-png.flaticon.com/512/702/702797.png" 
                alt="Light Bulb" 
                className={`w-20 transition-all duration-500 ease-in-out ${
                  isOn 
                    ? 'filter drop-shadow-[0_0_20px_#fcd34d] brightness-110 scale-110' 
                    : 'grayscale brightness-50 hover:brightness-75'
                }`}
              />
              <p className={`mt-3 font-bold text-sm transition-colors duration-300 ${isOn ? 'text-yellow-400 drop-shadow-[0_0_5px_#fcd34d]' : 'text-slate-500'}`}>
                
              </p>
            </div>
          </div>

        </div>
      </div>
    </footer>
  );
};

export default Footer;