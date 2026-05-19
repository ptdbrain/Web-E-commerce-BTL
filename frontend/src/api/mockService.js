// Mock categories với subcategories hợp lý
export const getCategories = async () => [
  {
    id: 1,
    name: "Laptop",
    subcategories: [
      "Gaming Laptop",
      "Ultrabook",
      "Workstation",
      "Laptop văn phòng",
      "Laptop đồ họa",
    ],
  },
  {
    id: 2,
    name: "Phone",
    subcategories: ["iPhone", "Samsung", "Oppo", "Xiaomi", "Vivo"],
  },
  {
    id: 3,
    name: "Tablet",
    subcategories: ["iPad", "Samsung Tab", "Android Tablet"],
  },
  {
    id: 4,
    name: "Bàn phím",
    subcategories: [
      "Bàn phím cơ",
      "Bàn phím gaming",
      "Bàn phím văn phòng",
      "Keycap",
    ],
  },
  {
    id: 5,
    name: "Chuột",
    subcategories: [
      "Chuột gaming",
      "Chuột văn phòng",
      "Chuột không dây",
      "Mousepad",
    ],
  },
  {
    id: 6,
    name: "Tai nghe",
    subcategories: [
      "Tai nghe gaming",
      "Tai nghe không dây",
      "Tai nghe có dây",
      "TWS",
    ],
  },
  {
    id: 7,
    name: "Màn hình",
    subcategories: [
      "Màn hình gaming",
      "Màn hình văn phòng",
      "Màn hình đồ họa",
      "Arm màn hình",
    ],
  },
  {
    id: 8,
    name: "Linh kiện",
    subcategories: ["RAM", "Ổ cứng SSD", "Ổ cứng HDD", "VGA"],
  },
  {
    id: 9,
    name: "Phụ kiện",
    subcategories: [
      "Balo laptop",
      "Túi chống sốc",
      "Sạc laptop",
      "Hub USB-C",
      "Webcam",
      "Đế tản nhiệt",
    ],
  },
];

// Mock brands
export const getBrands = async () => [
  { id: 1, name: "Lenovo", popular: true },
  { id: 2, name: "Dell", popular: true },
  { id: 3, name: "Asus", popular: true },
  { id: 4, name: "Acer", popular: true },
  { id: 5, name: "Apple", popular: true },
  { id: 6, name: "HP", popular: true },
  { id: 7, name: "MSI", popular: true },
  { id: 8, name: "LG", popular: false },
  { id: 9, name: "Microsoft", popular: false },
  { id: 10, name: "Samsung", popular: true },
  { id: 11, name: "Razer", popular: false },
  { id: 12, name: "Logitech", popular: true },
  { id: 13, name: "Keychron", popular: false },
  { id: 14, name: "Anker", popular: false },
];

// Mock products với hình ảnh thật từ Unsplash/Imgur
export const getProducts = async () => [
  // LENOVO LAPTOPS
  {
    id: 1,
    name: "Lenovo ThinkPad X1 Carbon Gen 11 i7",
    brand: "Lenovo",
    category: "Laptop",
    subcategory: "Ultrabook",
    price: 32990000,
    originalPrice: 38000000,
    discount: 13,
    rating: 4.8,
    reviewCount: 156,
    stock: 15,
    image:
      "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=400&h=300&fit=crop",
    thumbnail:
      "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=400&h=300&fit=crop",
    specs: {
      cpu: "Intel Core i7-1355U",
      ram: "16GB",
      storage: "512GB SSD",
      screen: '14" FHD IPS',
      gpu: "Intel Iris Xe",
    },
    isNew: true,
    isBestSeller: true,
  },
  {
    id: 2,
    name: "Lenovo ThinkPad X1 Carbon Gen 9 Core i5",
    brand: "Lenovo",
    category: "Laptop",
    subcategory: "Ultrabook",
    price: 21990000,
    originalPrice: 25000000,
    discount: 12,
    rating: 4.6,
    reviewCount: 89,
    stock: 8,
    image:
      "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400&h=300&fit=crop",
    thumbnail:
      "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400&h=300&fit=crop",
    specs: {
      cpu: "Intel Core i5-1135G7",
      ram: "8GB",
      storage: "256GB SSD",
      screen: '14" FHD',
      gpu: "Intel Iris Xe",
    },
    isNew: false,
    isBestSeller: false,
  },
  {
    id: 3,
    name: "Lenovo Legion 5 Pro RTX 4060",
    brand: "Lenovo",
    category: "Laptop",
    subcategory: "Gaming Laptop",
    price: 35990000,
    originalPrice: 42000000,
    discount: 14,
    rating: 4.9,
    reviewCount: 234,
    stock: 5,
    image:
      "https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=400&h=300&fit=crop",
    thumbnail:
      "https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=400&h=300&fit=crop",
    specs: {
      cpu: "AMD Ryzen 7 7745HX",
      ram: "16GB DDR5",
      storage: "1TB SSD",
      screen: '16" QHD 165Hz',
      gpu: "RTX 4060 8GB",
    },
    isNew: true,
    isBestSeller: true,
  },
  {
    id: 4,
    name: "Lenovo IdeaPad 3 15IAU7",
    brand: "Lenovo",
    category: "Laptop",
    subcategory: "Laptop văn phòng",
    price: 12990000,
    originalPrice: 15000000,
    discount: 13,
    rating: 4.2,
    reviewCount: 67,
    stock: 20,
    image:
      "https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?w=400&h=300&fit=crop",
    thumbnail:
      "https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?w=400&h=300&fit=crop",
    specs: {
      cpu: "Intel Core i3-1215U",
      ram: "8GB",
      storage: "256GB SSD",
      screen: '15.6" FHD',
      gpu: "Intel UHD",
    },
    isNew: false,
    isBestSeller: false,
  },

  // DELL LAPTOPS
  {
    id: 5,
    name: "Dell XPS 13 Plus 9320 i7",
    brand: "Dell",
    category: "Laptop",
    subcategory: "Ultrabook",
    price: 42990000,
    originalPrice: 48000000,
    discount: 10,
    rating: 4.9,
    reviewCount: 198,
    stock: 7,
    image:
      "https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=400&h=300&fit=crop",
    thumbnail:
      "https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=400&h=300&fit=crop",
    specs: {
      cpu: "Intel Core i7-1360P",
      ram: "16GB LPDDR5",
      storage: "512GB SSD",
      screen: '13.4" 3.5K OLED',
      gpu: "Intel Iris Xe",
    },
    isNew: true,
    isBestSeller: true,
  },
  {
    id: 6,
    name: "Dell Inspiron 15 3520",
    brand: "Dell",
    category: "Laptop",
    subcategory: "Laptop văn phòng",
    price: 13990000,
    originalPrice: 16000000,
    discount: 13,
    rating: 4.3,
    reviewCount: 112,
    stock: 18,
    image:
      "https://images.unsplash.com/photo-1484788984921-03950022c9ef?w=400&h=300&fit=crop",
    thumbnail:
      "https://images.unsplash.com/photo-1484788984921-03950022c9ef?w=400&h=300&fit=crop",
    specs: {
      cpu: "Intel Core i5-1235U",
      ram: "8GB",
      storage: "512GB SSD",
      screen: '15.6" FHD',
      gpu: "Intel UHD",
    },
    isNew: false,
    isBestSeller: false,
  },
  {
    id: 7,
    name: "Dell Precision 5570 Workstation",
    brand: "Dell",
    category: "Laptop",
    subcategory: "Workstation",
    price: 52990000,
    originalPrice: 60000000,
    discount: 12,
    rating: 4.8,
    reviewCount: 76,
    stock: 4,
    image:
      "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400&h=300&fit=crop",
    thumbnail:
      "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400&h=300&fit=crop",
    specs: {
      cpu: "Intel Core i7-12700H",
      ram: "32GB DDR5",
      storage: "1TB SSD",
      screen: '15.6" 4K OLED',
      gpu: "NVIDIA RTX A2000",
    },
    isNew: true,
    isBestSeller: false,
  },
  {
    id: 8,
    name: "Dell Alienware m15 R7 Gaming",
    brand: "Dell",
    category: "Laptop",
    subcategory: "Gaming Laptop",
    price: 48990000,
    originalPrice: 55000000,
    discount: 11,
    rating: 4.9,
    reviewCount: 189,
    stock: 6,
    image:
      "https://images.unsplash.com/photo-1593640408182-31c70c8268f5?w=400&h=300&fit=crop",
    thumbnail:
      "https://images.unsplash.com/photo-1593640408182-31c70c8268f5?w=400&h=300&fit=crop",
    specs: {
      cpu: "Intel Core i7-12700H",
      ram: "16GB DDR5",
      storage: "1TB SSD",
      screen: '15.6" QHD 240Hz',
      gpu: "RTX 3070 Ti 8GB",
    },
    isNew: false,
    isBestSeller: true,
  },

  // ASUS LAPTOPS
  {
    id: 9,
    name: "Asus Vivobook 15 OLED",
    brand: "Asus",
    category: "Laptop",
    subcategory: "Laptop văn phòng",
    price: 18990000,
    originalPrice: 22000000,
    discount: 14,
    rating: 4.5,
    reviewCount: 143,
    stock: 12,
    image:
      "https://images.unsplash.com/photo-1611078489935-0cb964de46d6?w=400&h=300&fit=crop",
    thumbnail:
      "https://images.unsplash.com/photo-1611078489935-0cb964de46d6?w=400&h=300&fit=crop",
    specs: {
      cpu: "Intel Core i5-13500H",
      ram: "16GB",
      storage: "512GB SSD",
      screen: '15.6" OLED 2.8K',
      gpu: "Intel Iris Xe",
    },
    isNew: true,
    isBestSeller: true,
  },
  {
    id: 10,
    name: "Asus ROG Strix G16 RTX 4070",
    brand: "Asus",
    category: "Laptop",
    subcategory: "Gaming Laptop",
    price: 44990000,
    originalPrice: 52000000,
    discount: 13,
    rating: 4.9,
    reviewCount: 267,
    stock: 8,
    image:
      "https://images.unsplash.com/photo-1624705002806-5d72df19c3ad?w=400&h=300&fit=crop",
    thumbnail:
      "https://images.unsplash.com/photo-1624705002806-5d72df19c3ad?w=400&h=300&fit=crop",
    specs: {
      cpu: "Intel Core i9-13980HX",
      ram: "16GB DDR5",
      storage: "1TB SSD",
      screen: '16" QHD 240Hz',
      gpu: "RTX 4070 8GB",
    },
    isNew: true,
    isBestSeller: true,
  },
  {
    id: 11,
    name: "Asus ZenBook 14 OLED",
    brand: "Asus",
    category: "Laptop",
    subcategory: "Ultrabook",
    price: 24990000,
    originalPrice: 28000000,
    discount: 11,
    rating: 4.7,
    reviewCount: 98,
    stock: 10,
    image:
      "https://images.unsplash.com/photo-1602080858428-57174f9431cf?w=400&h=300&fit=crop",
    thumbnail:
      "https://images.unsplash.com/photo-1602080858428-57174f9431cf?w=400&h=300&fit=crop",
    specs: {
      cpu: "Intel Core i7-1355U",
      ram: "16GB LPDDR5",
      storage: "512GB SSD",
      screen: '14" 2.8K OLED',
      gpu: "Intel Iris Xe",
    },
    isNew: false,
    isBestSeller: false,
  },
  {
    id: 12,
    name: "Asus ProArt StudioBook",
    brand: "Asus",
    category: "Laptop",
    subcategory: "Laptop đồ họa",
    price: 48990000,
    originalPrice: 54000000,
    discount: 9,
    rating: 4.7,
    reviewCount: 87,
    stock: 5,
    image:
      "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=400&h=300&fit=crop",
    thumbnail:
      "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=400&h=300&fit=crop",
    specs: {
      cpu: "Intel Core i9-13980HX",
      ram: "32GB DDR5",
      storage: "1TB SSD",
      screen: '16" 4K OLED',
      gpu: "RTX 4060 8GB",
    },
    isNew: true,
    isBestSeller: false,
  },

  // APPLE LAPTOPS
  {
    id: 13,
    name: 'MacBook Air M2 13" 8GB/256GB',
    brand: "Apple",
    category: "Laptop",
    subcategory: "Ultrabook",
    price: 28990000,
    originalPrice: 32000000,
    discount: 9,
    rating: 4.9,
    reviewCount: 456,
    stock: 25,
    image:
      "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400&h=300&fit=crop",
    thumbnail:
      "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400&h=300&fit=crop",
    specs: {
      cpu: "Apple M2 8-core",
      ram: "8GB Unified",
      storage: "256GB SSD",
      screen: '13.6" Liquid Retina',
      gpu: "8-core GPU",
    },
    isNew: false,
    isBestSeller: true,
  },
  {
    id: 14,
    name: 'MacBook Air M2 15" 16GB/512GB',
    brand: "Apple",
    category: "Laptop",
    subcategory: "Ultrabook",
    price: 42990000,
    originalPrice: 46000000,
    discount: 7,
    rating: 4.9,
    reviewCount: 289,
    stock: 15,
    image:
      "https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=400&h=300&fit=crop",
    thumbnail:
      "https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=400&h=300&fit=crop",
    specs: {
      cpu: "Apple M2 8-core",
      ram: "16GB Unified",
      storage: "512GB SSD",
      screen: '15.3" Liquid Retina',
      gpu: "10-core GPU",
    },
    isNew: true,
    isBestSeller: true,
  },
  {
    id: 15,
    name: 'MacBook Pro 14" M3 Pro',
    brand: "Apple",
    category: "Laptop",
    subcategory: "Laptop đồ họa",
    price: 54990000,
    originalPrice: 59000000,
    discount: 7,
    rating: 5.0,
    reviewCount: 178,
    stock: 8,
    image:
      "https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=400&h=300&fit=crop",
    thumbnail:
      "https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=400&h=300&fit=crop",
    specs: {
      cpu: "Apple M3 Pro 11-core",
      ram: "18GB Unified",
      storage: "512GB SSD",
      screen: '14.2" Liquid Retina XDR',
      gpu: "14-core GPU",
    },
    isNew: true,
    isBestSeller: true,
  },

  // HP LAPTOPS
  {
    id: 16,
    name: "HP Envy 13 x360",
    brand: "HP",
    category: "Laptop",
    subcategory: "Ultrabook",
    price: 22990000,
    originalPrice: 26000000,
    discount: 12,
    rating: 4.6,
    reviewCount: 134,
    stock: 11,
    image:
      "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=400&h=300&fit=crop",
    thumbnail:
      "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=400&h=300&fit=crop",
    specs: {
      cpu: "Intel Core i7-1355U",
      ram: "16GB",
      storage: "512GB SSD",
      screen: '13.3" FHD Touch',
      gpu: "Intel Iris Xe",
    },
    isNew: false,
    isBestSeller: false,
  },
  {
    id: 17,
    name: "HP Pavilion 15",
    brand: "HP",
    category: "Laptop",
    subcategory: "Laptop văn phòng",
    price: 15990000,
    originalPrice: 18000000,
    discount: 11,
    rating: 4.4,
    reviewCount: 167,
    stock: 20,
    image:
      "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400&h=300&fit=crop",
    thumbnail:
      "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400&h=300&fit=crop",
    specs: {
      cpu: "Intel Core i5-1235U",
      ram: "8GB",
      storage: "512GB SSD",
      screen: '15.6" FHD',
      gpu: "Intel Iris Xe",
    },
    isNew: false,
    isBestSeller: true,
  },

  // PHONES
  {
    id: 18,
    name: "iPhone 15 Pro Max 256GB",
    brand: "Apple",
    category: "Phone",
    subcategory: "iPhone",
    price: 34990000,
    originalPrice: 37000000,
    discount: 5,
    rating: 4.9,
    reviewCount: 523,
    stock: 30,
    image:
      "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=400&h=300&fit=crop",
    thumbnail:
      "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=400&h=300&fit=crop",
    specs: {
      cpu: "A17 Pro",
      ram: "8GB",
      storage: "256GB",
      screen: '6.7" Super Retina XDR',
      camera: "48MP + 12MP + 12MP",
    },
    isNew: true,
    isBestSeller: true,
  },
  {
    id: 19,
    name: "iPhone 14 128GB",
    brand: "Apple",
    category: "Phone",
    subcategory: "iPhone",
    price: 19990000,
    originalPrice: 23000000,
    discount: 13,
    rating: 4.7,
    reviewCount: 412,
    stock: 25,
    image:
      "https://images.unsplash.com/photo-1678685888221-cda773a3dcdb?w=400&h=300&fit=crop",
    thumbnail:
      "https://images.unsplash.com/photo-1678685888221-cda773a3dcdb?w=400&h=300&fit=crop",
    specs: {
      cpu: "A15 Bionic",
      ram: "6GB",
      storage: "128GB",
      screen: '6.1" Super Retina XDR',
      camera: "12MP + 12MP",
    },
    isNew: false,
    isBestSeller: true,
  },
  {
    id: 20,
    name: "Samsung Galaxy S24 Ultra 512GB",
    brand: "Samsung",
    category: "Phone",
    subcategory: "Samsung",
    price: 32990000,
    originalPrice: 35000000,
    discount: 6,
    rating: 4.8,
    reviewCount: 389,
    stock: 18,
    image:
      "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=400&h=300&fit=crop",
    thumbnail:
      "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=400&h=300&fit=crop",
    specs: {
      cpu: "Snapdragon 8 Gen 3",
      ram: "12GB",
      storage: "512GB",
      screen: '6.8" Dynamic AMOLED 2X',
      camera: "200MP + 50MP + 12MP + 10MP",
    },
    isNew: true,
    isBestSeller: true,
  },

  // TABLETS
  {
    id: 21,
    name: 'iPad Pro 11" M2 128GB WiFi',
    brand: "Apple",
    category: "Tablet",
    subcategory: "iPad",
    price: 24990000,
    originalPrice: 27000000,
    discount: 7,
    rating: 4.8,
    reviewCount: 234,
    stock: 20,
    image:
      "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400&h=300&fit=crop",
    thumbnail:
      "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400&h=300&fit=crop",
    specs: {
      cpu: "Apple M2",
      ram: "8GB",
      storage: "128GB",
      screen: '11" Liquid Retina',
      camera: "12MP + 10MP",
    },
    isNew: false,
    isBestSeller: true,
  },
  {
    id: 22,
    name: "iPad Air 5 64GB WiFi",
    brand: "Apple",
    category: "Tablet",
    subcategory: "iPad",
    price: 15990000,
    originalPrice: 18000000,
    discount: 11,
    rating: 4.7,
    reviewCount: 178,
    stock: 22,
    image:
      "https://images.unsplash.com/photo-1561154464-82e9adf32764?w=400&h=300&fit=crop",
    thumbnail:
      "https://images.unsplash.com/photo-1561154464-82e9adf32764?w=400&h=300&fit=crop",
    specs: {
      cpu: "Apple M1",
      ram: "8GB",
      storage: "64GB",
      screen: '10.9" Liquid Retina',
      camera: "12MP + 12MP",
    },
    isNew: false,
    isBestSeller: true,
  },

  // KEYBOARDS
  {
    id: 23,
    name: "Keychron K8 Pro QMK/VIA",
    brand: "Keychron",
    category: "Bàn phím",
    subcategory: "Bàn phím cơ",
    price: 3290000,
    originalPrice: 3600000,
    discount: 9,
    rating: 4.8,
    reviewCount: 423,
    stock: 35,
    image:
      "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=400&h=300&fit=crop",
    thumbnail:
      "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=400&h=300&fit=crop",
    specs: {
      type: "Mechanical Keyboard",
      layout: "87 keys TKL",
      connection: "Wireless + Wired",
      switch: "Hot-swappable",
    },
    isNew: true,
    isBestSeller: true,
  },
  {
    id: 24,
    name: "Logitech MX Keys",
    brand: "Logitech",
    category: "Bàn phím",
    subcategory: "Bàn phím văn phòng",
    price: 2490000,
    originalPrice: 2800000,
    discount: 11,
    rating: 4.7,
    reviewCount: 312,
    stock: 40,
    image:
      "https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?w=400&h=300&fit=crop",
    thumbnail:
      "https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?w=400&h=300&fit=crop",
    specs: {
      type: "Wireless Keyboard",
      layout: "Full size",
      connection: "Bluetooth + USB",
      battery: "10 days with backlight",
    },
    isNew: false,
    isBestSeller: true,
  },

  // MICE
  {
    id: 25,
    name: "Logitech MX Master 3S",
    brand: "Logitech",
    category: "Chuột",
    subcategory: "Chuột văn phòng",
    price: 2490000,
    originalPrice: 2800000,
    discount: 11,
    rating: 4.9,
    reviewCount: 567,
    stock: 45,
    image:
      "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=400&h=300&fit=crop",
    thumbnail:
      "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=400&h=300&fit=crop",
    specs: {
      type: "Wireless Mouse",
      connection: "Bluetooth + USB",
      battery: "70 days",
      dpi: "8000 DPI",
    },
    isNew: false,
    isBestSeller: true,
  },
  {
    id: 26,
    name: "Razer DeathAdder V3",
    brand: "Razer",
    category: "Chuột",
    subcategory: "Chuột gaming",
    price: 1890000,
    originalPrice: 2200000,
    discount: 14,
    rating: 4.8,
    reviewCount: 423,
    stock: 30,
    image:
      "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=400&h=300&fit=crop",
    thumbnail:
      "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=400&h=300&fit=crop",
    specs: {
      type: "Gaming Mouse",
      connection: "Wired",
      sensor: "Focus Pro 30K",
      dpi: "30000 DPI",
    },
    isNew: true,
    isBestSeller: true,
  },

  // HEADPHONES
  {
    id: 27,
    name: "Apple AirPods Pro 2",
    brand: "Apple",
    category: "Tai nghe",
    subcategory: "TWS",
    price: 6490000,
    originalPrice: 7000000,
    discount: 7,
    rating: 4.8,
    reviewCount: 678,
    stock: 50,
    image:
      "https://images.unsplash.com/photo-1606841837239-c5a1a4a07af7?w=400&h=300&fit=crop",
    thumbnail:
      "https://images.unsplash.com/photo-1606841837239-c5a1a4a07af7?w=400&h=300&fit=crop",
    specs: {
      type: "True Wireless Earbuds",
      anc: "Active Noise Cancellation",
      battery: "6 hours + 30 hours case",
      chip: "H2 chip",
    },
    isNew: false,
    isBestSeller: true,
  },
  {
    id: 28,
    name: "Razer Kraken V3 Pro",
    brand: "Razer",
    category: "Tai nghe",
    subcategory: "Tai nghe gaming",
    price: 4290000,
    originalPrice: 4800000,
    discount: 11,
    rating: 4.7,
    reviewCount: 234,
    stock: 25,
    image:
      "https://images.unsplash.com/photo-1599669454699-248893623440?w=400&h=300&fit=crop",
    thumbnail:
      "https://images.unsplash.com/photo-1599669454699-248893623440?w=400&h=300&fit=crop",
    specs: {
      type: "Gaming Headset",
      connection: "Wireless + Wired",
      battery: "28 hours",
      surround: "THX Spatial Audio",
    },
    isNew: true,
    isBestSeller: false,
  },

  // ACCESSORIES
  {
    id: 29,
    name: "Anker PowerCore 20000mAh",
    brand: "Anker",
    category: "Phụ kiện",
    subcategory: "Sạc laptop",
    price: 890000,
    originalPrice: 1100000,
    discount: 19,
    rating: 4.6,
    reviewCount: 892,
    stock: 60,
    image:
      "https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=400&h=300&fit=crop",
    thumbnail:
      "https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=400&h=300&fit=crop",
    specs: {
      type: "Power Bank",
      capacity: "20000mAh",
      output: "USB-A + USB-C",
      fastcharge: "18W PD",
    },
    isNew: false,
    isBestSeller: true,
  },
  {
    id: 30,
    name: 'Tomtoc 360 Protective Sleeve 14"',
    brand: "Tomtoc",
    category: "Phụ kiện",
    subcategory: "Túi chống sốc",
    price: 590000,
    originalPrice: 700000,
    discount: 16,
    rating: 4.7,
    reviewCount: 234,
    stock: 40,
    image:
      "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=300&fit=crop",
    thumbnail:
      "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=300&fit=crop",
    specs: {
      type: "Laptop Sleeve",
      size: "14 inch",
      material: "Premium polyester",
      protection: "Drop protection 360°",
    },
    isNew: false,
    isBestSeller: true,
  },
];

// Filter functions
export const filterProducts = (products, filters) => {
  let filtered = [...products];

  // Filter by category
  if (filters.category && filters.category !== "all") {
    filtered = filtered.filter((p) => p.category === filters.category);
  }

  // Filter by subcategory
  if (filters.subcategory && filters.subcategory !== "all") {
    filtered = filtered.filter((p) => p.subcategory === filters.subcategory);
  }

  // Filter by brands
  if (filters.brands && filters.brands.length > 0) {
    filtered = filtered.filter((p) => filters.brands.includes(p.brand));
  }

  // Filter by price range
  if (filters.priceRange) {
    filtered = filtered.filter(
      (p) =>
        p.price >= filters.priceRange.min && p.price <= filters.priceRange.max
    );
  }

  // Filter by rating
  if (filters.minRating) {
    filtered = filtered.filter((p) => p.rating >= filters.minRating);
  }

  // Filter by stock
  if (filters.inStock) {
    filtered = filtered.filter((p) => p.stock > 0);
  }

  return filtered;
};

// Sort functions
export const sortProducts = (products, sortBy) => {
  const sorted = [...products];

  switch (sortBy) {
    case "price-asc":
      return sorted.sort((a, b) => a.price - b.price);
    case "price-desc":
      return sorted.sort((a, b) => b.price - a.price);
    case "name-asc":
      return sorted.sort((a, b) => a.name.localeCompare(b.name));
    case "name-desc":
      return sorted.sort((a, b) => b.name.localeCompare(a.name));
    case "rating":
      return sorted.sort((a, b) => b.rating - a.rating);
    case "discount":
      return sorted.sort((a, b) => (b.discount || 0) - (a.discount || 0));
    case "newest":
      return sorted.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));
    case "bestseller":
      return sorted.sort(
        (a, b) => (b.isBestSeller ? 1 : 0) - (a.isBestSeller ? 1 : 0)
      );
    default:
      return sorted;
  }
};

// Pagination function
export const paginateProducts = (products, page = 1, pageSize = 12) => {
  const startIndex = (page - 1) * pageSize;
  const endIndex = startIndex + pageSize;

  return {
    items: products.slice(startIndex, endIndex),
    totalItems: products.length,
    totalPages: Math.ceil(products.length / pageSize),
    currentPage: page,
    pageSize,
  };
};

// Get featured products (bestsellers + new)
export const getFeaturedProducts = async () => {
  const products = await getProducts();
  return products.filter((p) => p.isBestSeller || p.isNew).slice(0, 8);
};

// Search products
export const searchProducts = async (query) => {
  const products = await getProducts();
  const lowercaseQuery = query.toLowerCase();

  return products.filter(
    (p) =>
      p.name.toLowerCase().includes(lowercaseQuery) ||
      p.brand.toLowerCase().includes(lowercaseQuery) ||
      p.category.toLowerCase().includes(lowercaseQuery) ||
      (p.subcategory && p.subcategory.toLowerCase().includes(lowercaseQuery))
  );
};

// Get products by category
export const getProductsByCategory = async (categoryName) => {
  const products = await getProducts();
  return products.filter((p) => p.category === categoryName);
};

// Get subcategories by category
export const getSubcategoriesByCategory = async (categoryName) => {
  const categories = await getCategories();
  const category = categories.find((c) => c.name === categoryName);
  return category ? category.subcategories : [];
};

// Get product by ID
export const getProductById = async (productId) => {
  const products = await getProducts();
  return products.find((p) => p.id === parseInt(productId));
};
