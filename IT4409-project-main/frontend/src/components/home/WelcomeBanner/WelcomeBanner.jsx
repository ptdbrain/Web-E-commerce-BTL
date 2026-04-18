import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { storeConfig } from "../../../data/menuData";

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

function WelcomeBanner() {
  return (
    <section className="relative mx-4 mt-4 overflow-hidden rounded-[2rem] sm:mx-6 sm:mt-6">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(251,146,60,0.3),transparent_50%),radial-gradient(ellipse_at_bottom_right,rgba(225,29,72,0.15),transparent_50%),linear-gradient(135deg,#0f172a_0%,#1e293b_40%,#7c2d12_100%)]" />

      {/* Decorative blobs */}
      <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-orange-500/10 blur-[100px]" />
      <div className="absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-rose-500/10 blur-[80px]" />

      {/* Content */}
      <motion.div
        className="relative z-10 mx-auto grid max-w-7xl gap-10 px-8 py-14 sm:py-16 md:grid-cols-[1.2fr_0.8fr] md:items-center md:px-14"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        <div>
          <motion.div
            variants={itemVariants}
            className="mb-5 inline-flex rounded-full border border-orange-300/30 bg-white/10 px-4 py-2 text-[11px] font-bold uppercase tracking-[0.25em] text-orange-200 backdrop-blur-sm"
          >
            🔥 Fast Food Store
          </motion.div>

          <motion.h1
            variants={itemVariants}
            className="max-w-2xl font-display text-4xl font-extrabold leading-[1.15] text-white sm:text-5xl lg:text-6xl"
          >
            {storeConfig.name}{" "}
            <span className="bg-gradient-to-r from-orange-300 to-rose-400 bg-clip-text text-transparent">
              giao nóng hổi
            </span>
            , đặt món theo đúng cách bạn muốn.
          </motion.h1>

          <motion.p
            variants={itemVariants}
            className="mt-5 max-w-xl text-base text-orange-50/75 sm:text-lg"
          >
            Burger, gà rán, combo nhóm — pickup trong 20 phút và đặt bàn ngay
            trong một lượt checkout.
          </motion.p>

          <motion.div
            variants={itemVariants}
            className="mt-8 flex flex-wrap gap-3"
          >
            <Link
              to="/products/combo"
              className="rounded-full bg-gradient-to-r from-orange-500 to-rose-500 px-6 py-3 text-sm font-bold uppercase tracking-[0.15em] text-white shadow-lg shadow-orange-500/25 transition-all duration-200 hover:shadow-xl hover:shadow-orange-500/30 hover:scale-[1.03] active:scale-[0.98]"
            >
              Xem combo hot
            </Link>
            <Link
              to="/products/fried-chicken"
              className="rounded-full border border-white/20 bg-white/5 px-6 py-3 text-sm font-bold uppercase tracking-[0.15em] text-white backdrop-blur-sm transition-all duration-200 hover:bg-white/15 hover:border-white/40"
            >
              Order gà rán
            </Link>
          </motion.div>
        </div>

        {/* Stats grid */}
        <motion.div
          variants={containerVariants}
          className="grid gap-3 sm:grid-cols-2"
        >
          {[
            { label: "Món hot hôm nay", value: "12 item bestseller", emoji: "🔥" },
            { label: "Nhận món", value: "Delivery, pickup, dine-in", emoji: "📦" },
            { label: "Thời gian chuẩn bị", value: "10 — 22 phút", emoji: "⏱️" },
            { label: "Voucher", value: "Giữ nguyên lượng hiện có", emoji: "🎟️" },
          ].map((item) => (
            <motion.div
              key={item.label}
              variants={itemVariants}
              className="group rounded-2xl border border-white/10 bg-white/[0.07] p-5 backdrop-blur-sm transition-all duration-200 hover:bg-white/[0.12] hover:border-white/20 hover:-translate-y-0.5"
            >
              <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.2em] text-orange-200/80">
                <span>{item.emoji}</span>
                {item.label}
              </div>
              <div className="mt-2 text-lg font-bold text-white">
                {item.value}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
}

export default WelcomeBanner;
