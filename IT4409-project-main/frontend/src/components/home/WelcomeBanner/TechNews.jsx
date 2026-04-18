import React, { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { homeArticles } from "../../../data/menuData";

const tabs = ["Tất cả", "Ưu đãi", "Món mới", "Mẹo order", "Vận hành"];

const TechNews = () => {
  const [activeTab, setActiveTab] = useState("Tất cả");

  const filteredArticles = useMemo(() => {
    if (activeTab === "Tất cả") return homeArticles;
    // Map Vietnamese tab names to category values in data
    const tabMap = {
      "Ưu đãi": "Uu dai",
      "Món mới": "Mon moi",
      "Mẹo order": "Meo order",
      "Vận hành": "Van hanh",
    };
    return homeArticles.filter(
      (article) => article.category === (tabMap[activeTab] || activeTab)
    );
  }, [activeTab]);

  const featuredArticle = filteredArticles[0];
  const otherArticles = filteredArticles.slice(1);

  if (!featuredArticle) return null;

  return (
    <section className="bg-gradient-to-b from-orange-50/60 to-white py-14">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-8">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-orange-500">
            📰 Tin tức & ưu đãi
          </p>
          <h2 className="mt-2 font-display text-3xl font-extrabold text-slate-900">
            Tin menu và ưu đãi
          </h2>
        </div>

        {/* Tab pills */}
        <div className="flex flex-wrap gap-2 mb-8">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`relative rounded-full px-4 py-2 text-sm font-semibold transition-all duration-200 ${
                activeTab === tab
                  ? "bg-gradient-to-r from-orange-500 to-rose-500 text-white shadow-md shadow-orange-500/20"
                  : "bg-white text-slate-500 border border-slate-200 hover:bg-slate-50 hover:text-slate-700"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25 }}
            className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]"
          >
            {/* Featured article */}
            <article className="group overflow-hidden rounded-[2rem] bg-slate-950 text-white shadow-glass">
              <div className="relative overflow-hidden">
                <img
                  src={featuredArticle.image}
                  alt={featuredArticle.title}
                  className="h-[340px] w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-7">
                  <span className="inline-block rounded-full bg-gradient-to-r from-orange-500 to-rose-500 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em]">
                    {featuredArticle.type}
                  </span>
                  <h3 className="mt-3 font-display text-2xl font-extrabold leading-snug sm:text-3xl">
                    {featuredArticle.title}
                  </h3>
                  <div className="mt-3 flex items-center gap-2 text-sm text-slate-300">
                    <span>{featuredArticle.author}</span>
                    <span className="text-slate-500">•</span>
                    <span>{featuredArticle.date}</span>
                  </div>
                </div>
              </div>
            </article>

            {/* Side articles */}
            <div className="space-y-3">
              {otherArticles.map((article) => (
                <article
                  key={article.id}
                  className="group flex gap-4 rounded-2xl border border-slate-100 bg-white p-3 shadow-card transition-all duration-200 hover:shadow-card-hover hover:-translate-y-0.5"
                >
                  <div className="h-24 w-28 shrink-0 overflow-hidden rounded-xl">
                    <img
                      src={article.image}
                      alt={article.title}
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
                    />
                  </div>
                  <div className="flex flex-col justify-center">
                    <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-orange-500">
                      {article.type}
                    </span>
                    <h4 className="mt-1.5 text-sm font-bold text-slate-800 leading-snug line-clamp-2 group-hover:text-orange-600 transition-colors">
                      {article.title}
                    </h4>
                    <div className="mt-2 flex items-center gap-2 text-[11px] text-slate-400">
                      <span>{article.author}</span>
                      <span>•</span>
                      <span>{article.date}</span>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
};

export default TechNews;
