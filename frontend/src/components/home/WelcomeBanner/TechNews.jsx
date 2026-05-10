import React, { useState } from 'react';

const TechNews = () => {
  const [activeTab, setActiveTab] = useState('Mới nhất');

  const categories = ['Mới nhất', 'Tin tức', 'Đánh giá', 'Tư vấn', 'Thủ thuật'];

  const newsData = [
    {
      id: 1,
      category: 'Tin tức',
      type: 'TIN TỨC',
      title: 'Black Friday 2025 - Hàng Chính Hãng Giảm Đến 50%',
      image: 'https://picsum.photos/200/120?random=1',
      author: 'Trần Hải Nhật Minh',
      date: '08/12/2025',
    },
    {
      id: 2,
      category: 'Đánh giá',
      type: 'ĐÁNH GIÁ',
      title: 'Laptop OLED có bền không? Tư vấn laptop OLED bền bỉ, đáng mua 2025',
      image: 'https://picsum.photos/200/120?random=2',
      author: 'Bùi Văn Nam',
      date: '08/12/2025',
    },
    {
      id: 3,
      category: 'Tư vấn',
      type: 'TƯ VẤN',
      title: 'Có nên mua laptop làm quà Giáng Sinh? Top laptop OLED ASUS giá tốt...',
      image: 'https://picsum.photos/200/120?random=3',
      author: 'Ngô Thành Nam',
      date: '08/12/2025',
    },
  
    {
      id: 4,
      category: 'Thủ thuật',
      type: 'THỦ THUẬT',
      title: '5 Cách tăng tốc Windows 11 cực đơn giản cho máy cấu hình yếu',
      image: 'https://picsum.photos/200/120?random=4',
      author: 'Trần Hải Nhật Minh',
      date: '26/12/2025',
    }, 

    {
      id: 5,
      category: 'Thủ thuật',
      type: 'THỦ THUẬT',
      title: 'Sinh viên Bách Khoa thích mua laptop gì nhất? Mẹo chọn máy chuẩn IT',
      image: 'https://picsum.photos/200/120?random=5',
      author: 'Trần Hải Nhật Minh',
      date: '26/12/2025', 
    }, 
   
    {
      id: 6,
      category: 'Đánh giá',
      type: 'ĐÁNH GIÁ',
      title: 'Trên tay iPhone 16 Pro Max: Màu Titan Sa Mạc có thực sự đẹp?',
      image: 'https://picsum.photos/200/120?random=6',
      author: 'Bùi Văn Nam',
      date: '25/12/2025',
    },
  ];

  
  const filteredNews = activeTab === 'Mới nhất' 
    ? newsData 
    : newsData.filter(news => news.category === activeTab);

  
  const featuredNews = filteredNews[0];
  const otherNews = filteredNews.slice(1);

  return (
    <section className="py-12 bg-gray-50 font-sans">
      <div className="container mx-auto px-4 max-w-6xl">
        
        <h2 className="text-3xl font-extrabold text-center mb-6 uppercase tracking-tight text-gray-800">
          Tin tức công nghệ
        </h2>

        {/* Categories Tab */}
        <div className="flex justify-center gap-2 mb-10 overflow-x-auto pb-2 no-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveTab(cat)}
              className={`px-5 py-2 rounded-full text-sm font-bold transition-all whitespace-nowrap ${
                activeTab === cat
                  ? 'bg-green-500 text-white shadow-md'
                  : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {filteredNews.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            
            <div className="lg:col-span-7 group cursor-pointer">
              <div className="relative overflow-hidden rounded-3xl aspect-[16/9] shadow-lg">
                <img
                  src={featuredNews.image}
                  alt={featuredNews.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent"></div>
                <div className="absolute bottom-0 left-0 p-8 text-white">
                  <span className="inline-block bg-green-500 px-3 py-1 rounded-md text-xs font-bold mb-4 tracking-widest">
                    {featuredNews.type}
                  </span>
                  <h3 className="text-2xl md:text-4xl font-bold leading-tight mb-4 group-hover:text-green-400 transition-colors">
                    {featuredNews.title}
                  </h3>
                  <div className="flex items-center gap-3 text-sm text-gray-300">
                    <span className="font-semibold text-white">{featuredNews.author}</span>
                    <span className="opacity-50">|</span>
                    <span>{featuredNews.date}</span>
                  </div>
                </div>
              </div>
            </div>

            
            <div className="lg:col-span-5 flex flex-col gap-6">
              {otherNews.length > 0 ? (
                otherNews.map((item) => (
                  <div key={item.id} className="flex gap-4 group cursor-pointer bg-white p-2 rounded-2xl hover:shadow-md transition-all">
                    <div className="flex-shrink-0 w-28 h-20 md:w-36 md:h-24 overflow-hidden rounded-xl">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                    </div>
                    <div className="flex flex-col justify-center">
                      <h4 className="font-bold text-sm md:text-base leading-snug text-gray-800 group-hover:text-green-600 transition-colors line-clamp-2 mb-2">
                        {item.title}
                      </h4>
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <span className="text-green-600 font-bold">{item.author}</span>
                        <span className="opacity-50">•</span>
                        <span>{item.date}</span>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="flex items-center justify-center h-full text-gray-400 italic">
                  Chưa có thêm tin tức trong mục này...
                </div>
              )}
              
              <button className="mt-4 text-green-600 font-extrabold flex items-center justify-center lg:justify-start gap-2 hover:gap-4 transition-all uppercase text-sm tracking-wider">
                Xem tất cả bản tin <span>→</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="text-center py-20 text-gray-500">Hiện chưa có tin tức nào cho danh mục này.</div>
        )}
      </div>
    </section>
  );
};

export default TechNews;