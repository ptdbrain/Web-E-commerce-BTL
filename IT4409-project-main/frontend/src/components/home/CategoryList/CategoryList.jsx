import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { categories } from "../../../data/categories";

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.06 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
};

export function CategoryList() {
  return (
    <section className="px-6 py-12">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-orange-500">
              Chọn nhanh theo nhu cầu
            </p>
            <h2 className="mt-2 font-display text-3xl font-extrabold text-slate-900">
              Thực đơn nổi bật
            </h2>
          </div>
          <Link
            to="/products"
            className="text-sm font-semibold text-orange-600 hover:text-orange-700 transition-colors whitespace-nowrap"
          >
            Xem toàn bộ menu →
          </Link>
        </div>

        <motion.div
          className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
        >
          {categories.map((category) => (
            <motion.div key={category.id} variants={itemVariants}>
              <Link
                to={`/products/${category.slug}`}
                className="group flex items-center gap-4 rounded-2xl border border-slate-100 bg-white p-4 shadow-card transition-all duration-200 hover:shadow-card-hover hover:-translate-y-1 hover:border-orange-200"
              >
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-orange-50 to-orange-100/70 transition-colors group-hover:from-orange-100 group-hover:to-orange-200/70">
                  <img
                    src={category.image}
                    alt={category.name}
                    className="h-9 w-9 object-contain transition-transform duration-200 group-hover:scale-110"
                  />
                </div>
                <div>
                  <div className="font-semibold text-slate-800 group-hover:text-orange-600 transition-colors">
                    {category.name}
                  </div>
                  <div className="mt-0.5 text-xs text-slate-400 group-hover:text-orange-400 transition-colors">
                    Mở danh mục →
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

export default CategoryList;
