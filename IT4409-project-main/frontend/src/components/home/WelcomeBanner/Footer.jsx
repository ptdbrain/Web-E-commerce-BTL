import React from "react";
import { Link } from "react-router-dom";
import {
  FaEnvelope,
  FaFacebookF,
  FaInstagram,
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaYoutube,
} from "react-icons/fa";
import { SiZalo } from "react-icons/si";
import { storeConfig } from "../../../data/menuData";

const Footer = () => {
  return (
    <footer className="relative mt-16 overflow-hidden bg-slate-950 text-slate-300">
      {/* Gradient top border */}
      <div className="h-1 bg-gradient-to-r from-orange-500 via-rose-500 to-orange-400" />

      {/* Subtle glow */}
      <div className="absolute left-1/4 top-0 -z-0 h-64 w-64 rounded-full bg-orange-500/5 blur-[100px]" />

      <div className="relative z-10 mx-auto max-w-7xl px-6 py-14">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div>
            <Link to="/" className="inline-block">
              <span className="font-display text-3xl font-bold text-gradient">
                Fire
              </span>
              <span className="font-display text-3xl font-bold text-white">
                Bite
              </span>
            </Link>
            <p className="mt-4 text-sm leading-7 text-slate-400">
              {storeConfig.description}
            </p>
            <div className="mt-5 flex gap-2.5">
              {[
                { Icon: FaFacebookF, label: "Facebook" },
                { Icon: FaYoutube, label: "YouTube" },
                { Icon: FaInstagram, label: "Instagram" },
                { Icon: SiZalo, label: "Zalo" },
              ].map(({ Icon, label }) => (
                <a
                  key={label}
                  href="#"
                  aria-label={label}
                  className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-800/80 text-slate-400 transition-all duration-200 hover:bg-gradient-to-br hover:from-orange-500 hover:to-rose-500 hover:text-white hover:shadow-glow hover:scale-110"
                >
                  <Icon size={15} />
                </a>
              ))}
            </div>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-orange-400">
              Dịch vụ
            </h4>
            <ul className="mt-5 space-y-3 text-sm">
              {[
                "Giao hàng trong ngày",
                "Tự đến lấy tại quán",
                "Đặt bàn cho nhóm",
                "Voucher & combo tiết kiệm",
              ].map((item) => (
                <li key={item}>
                  <a
                    href="#"
                    className="text-slate-400 transition-colors hover:text-orange-300"
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-orange-400">
              Hỗ trợ
            </h4>
            <ul className="mt-5 space-y-3 text-sm">
              {[
                "Hướng dẫn đặt món",
                "Tra cứu đơn hàng",
                "Chính sách hoàn tiền",
                `Hotline ${storeConfig.phone}`,
              ].map((item) => (
                <li key={item}>
                  <a
                    href="#"
                    className="text-slate-400 transition-colors hover:text-orange-300"
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-orange-400">
              Liên hệ
            </h4>
            <div className="mt-5 space-y-3 text-sm">
              <p className="flex items-start gap-2.5">
                <FaMapMarkerAlt className="mt-1 shrink-0 text-orange-400" />
                <span className="text-slate-400">{storeConfig.address}</span>
              </p>
              <p className="flex items-center gap-2.5">
                <FaPhoneAlt className="text-orange-400" size={13} />
                <span className="text-slate-400">{storeConfig.phone}</span>
              </p>
              <p className="flex items-center gap-2.5">
                <FaEnvelope className="text-orange-400" size={13} />
                <span className="text-slate-400">{storeConfig.email}</span>
              </p>
            </div>

            {/* Newsletter */}
            <div className="mt-6">
              <p className="text-xs font-semibold text-slate-500 mb-2">
                Nhận ưu đãi mới nhất
              </p>
              <div className="flex gap-2">
                <input
                  type="email"
                  placeholder="Email của bạn"
                  className="flex-1 rounded-xl border border-slate-700 bg-slate-800/50 px-3 py-2 text-sm text-white placeholder:text-slate-500 outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500/30 transition-all"
                />
                <button className="rounded-xl bg-gradient-to-r from-orange-500 to-rose-500 px-4 py-2 text-sm font-semibold text-white hover:shadow-glow transition-shadow">
                  Gửi
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 border-t border-slate-800 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <p>© 2026 {storeConfig.name}. All rights reserved.</p>
          <div className="flex gap-4">
            <a href="#" className="hover:text-orange-400 transition-colors">
              Điều khoản
            </a>
            <a href="#" className="hover:text-orange-400 transition-colors">
              Bảo mật
            </a>
            <a href="#" className="hover:text-orange-400 transition-colors">
              Cookies
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
