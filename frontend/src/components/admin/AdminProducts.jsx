import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, RefreshCw } from 'lucide-react';
import { formatPriceAdmin } from './utils';

// Mapping từ categoryId -> danh sách trường thông số kỹ thuật cần nhập
const CATEGORY_SPEC_FIELDS = {
  // Phụ kiện
  "6951f3f3d5ed7d901b7c54b8": ["product_type", "material", "color"],

  // Arm màn hình
  "6951f3f3d5ed7d901b7c54b5": [
    "product_type",
    "model",
    "arm_type",
    "monitor_support",
    "weight_capacity",
    "screen_size",
    "vesa_mount",
    "adjustment",
    "material",
    "mounting_type",
    "color",
  ],

  // Cặp / balo
  "6951f3f2d5ed7d901b7c54a9": [
    "capacity",
    "laptop_fit",
    "material",
    "features",
    "dimensions",
    "weight",
    "compartments",
    "waterproof",
  ],

  // Tủ
  "6951f3f3d5ed7d901b7c54b2": [
    "product_type",
    "drawers",
    "model",
    "mobility",
    "material",
    "lock",
    "dimensions",
    "color",
  ],

  // Ghế
  "6951f3f2d5ed7d901b7c54ac": [
    "chair_type",
    "model",
    "material",
    "features",
    "weight_capacity",
    "height_adjustment",
    "armrest_adjustment",
    "backrest_adjustment",
    "wheels",
    "warranty",
  ],

  // Bàn
  "6951f3f2d5ed7d901b7c54af": [
    "product_type",
    "material",
    "adjustable_height",
    "height_range",
    "model",
    "color",
  ],

  // Máy chơi game
  "6951f3f1d5ed7d901b7c54a1": [
    "device_type",
    "storage",
    "model",
    "features",
    "connectivity",
    "battery",
    "weight",
    "dimensions",
  ],

  // Bàn phím (gộp cả 2 schema bạn gửi)
  "6951f59a0c31403029000d10": [
    "product_type",
    "layout",
    "profile",
    "switch",
    "connectivity",
    "material",
    "backlight",
    "keycap_material",
    "hot_swap",
    "color",
  ],

  // Laptop
  "6951f3f1d5ed7d901b7c5498": [
    "processor",
    "ram",
    "storage",
    "graphics",
    "display",
    "battery",
    "weight",
    "os",
  ],

  // Chuột
  "6951f59a0c31403029000d13": [
    "Thông số cơ bản",
    "Loại chuột",
    "Kết nối",
    "Cảm biến",
    "DPI",
    "Trọng lượng",
    "Thời lượng pin",
    "Tính năng",
    "Tính năng đặc biệt",
    "Compact Design",
    "Multi-device",
    "Precision Tracking",
  ],

  // Màn hình
  "6951f3f1d5ed7d901b7c549e": [
    "size",
    "resolution",
    "panel_type",
    "refresh_rate",
    "response_time",
    "brightness",
    "contrast_ratio",
    "viewing_angle",
    "ports",
    "features",
  ],

  // RAM
  "6951f3f3d5ed7d901b7c54bb": [
    "product_type",
    "ram_type",
    "capacity",
    "bus_speed",
    "form_factor",
    "voltage",
    "condition",
    "color",
  ],

  // Ổ cứng
  "6951f59b0c31403029000d1d": [
    "Thông số cơ bản",
    "Dung lượng",
    "Giao tiếp",
    "Form Factor",
    "Tình trạng",
    "Series",
    "Hiệu năng",
    "Tốc độ đọc tối đa",
    "Tốc độ ghi tối đa",
    "Công nghệ NAND",
    "Độ bền",
    "TBW (Tuổi thọ ghi)",
  ],

  // Kính
  "6951f3f2d5ed7d901b7c54a4": [
    "Thông số cơ bản",
    "Loại thiết bị",
    "Độ phân giải",
    "Trọng lượng",
    "Thời lượng pin",
    "Hiệu năng",
    "Tần số quét",
    "Góc nhìn",
    "Tính năng",
    "Lightweight",
    "Spatial Display",
    "Air Casting",
    "3DoF Tracking",
    "Electrochromic Dimming",
  ],
};

const formatSpecLabel = (field) => {
  // Nếu có dấu cách hoặc ký tự tiếng Việt thì giữ nguyên
  if (/[^a-z0-9_]/i.test(field)) return field;
  const pretty = field.replace(/_/g, ' ');
  return pretty.charAt(0).toUpperCase() + pretty.slice(1);
};

const MOCK_PRODUCTS = [
  { _id: 'p1', name: 'Laptop Asus ROG', price: 15490000, stock: 5, category: 'laptop' },
  { _id: 'p2', name: 'MacBook Air M1', price: 18000000, stock: 3, category: 'laptop' },
  { _id: 'p3', name: 'Tai nghe Sony', price: 5000000, stock: 12, category: 'accessory' },
];

const EMPTY_FORM = {
  name: '',
  price: '',
  discountPrice: '',
  stock: '',
  category: '',
  brand: '',
  description: '',
  specifications: {},
  highlightsText: '',
  warranty: '',
  origin: '',
  isActive: true,
  isBestSeller: false,
  isNew: true,
};

export const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [files, setFiles] = useState([]); // danh sách File mới theo thứ tự upload
  const [creating, setCreating] = useState(false);
  const [formError, setFormError] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [currentImages, setCurrentImages] = useState([]); // ảnh hiện đang có của sản phẩm (URL)

  const fetchProducts = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await axios.get('https://it4409-deploy-backend.onrender.com/api/products');
      setProducts(res.data || []);
    } catch (err) {
      setError('Không lấy được sản phẩm từ server, hiển thị dữ liệu mẫu.');
      setProducts(MOCK_PRODUCTS);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
    const fetchCategories = async () => {
      try {
        const res = await axios.get('https://it4409-deploy-backend.onrender.com/api/categories');
        setCategories(res.data || []);
      } catch (err) {
        console.warn('Could not load categories', err?.message || err);
      }
    };
    const fetchBrands = async () => {
      try {
        const res = await axios.get('https://it4409-deploy-backend.onrender.com/api/brands');
        setBrands(res.data || []);
      } catch (err) {
        console.warn('Could not load brands', err?.message || err);
      }
    };
    fetchCategories();
    fetchBrands();
  }, []);

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: value,
      // Khi đổi category thì reset lại thông số kỹ thuật để tránh lệch
      ...(name === 'category' ? { specifications: {} } : {}),
    }));
  };

  const handleSpecChange = (field, value) => {
    setForm(prev => ({
      ...prev,
      specifications: {
        ...(prev.specifications || {}),
        [field]: value,
      },
    }));
  };
  const onFilesChange = (e) => {
    const selected = Array.from(e.target.files || []);
    if (!selected.length) return;

    // Nối thêm ảnh mới vào cuối danh sách để có thể chọn nhiều lần
    setFiles((prev) => [...prev, ...selected].slice(0, 6));
  };

  const moveImage = (index, direction) => {
    setFiles((prev) => {
      const newFiles = [...prev];
      const newIndex = index + direction;
      if (newIndex < 0 || newIndex >= newFiles.length) return prev;
      const temp = newFiles[index];
      newFiles[index] = newFiles[newIndex];
      newFiles[newIndex] = temp;
      return newFiles;
    });
  };

  const removeImage = (index) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    setFormError('');
    if (!form.name || !form.price) {
      setFormError('Tên và giá là bắt buộc');
      return;
    }
    setCreating(true);
    try {
      const fd = new FormData();
      fd.append('name', form.name);
      fd.append('price', form.price);
      fd.append('discountPrice', form.discountPrice || 0);
      fd.append('stock', form.stock || 0);
      fd.append('category', form.category || '');
      fd.append('brand', form.brand || '');
      fd.append('description', form.description || '');
      const highlightsArr = (form.highlightsText || '')
        .split('\n')
        .map((s) => s.trim())
        .filter(Boolean);
      fd.append('highlights', JSON.stringify(highlightsArr));
      fd.append('warranty', form.warranty || '');
      fd.append('origin', form.origin || '');
      fd.append('isActive', form.isActive ? 'true' : 'false');
      fd.append('isBestSeller', form.isBestSeller ? 'true' : 'false');
      fd.append('isNew', form.isNew ? 'true' : 'false');
      fd.append('specifications', JSON.stringify(form.specifications || {}));
      files.slice(0, 6).forEach((file) => fd.append('images', file));

      const token = localStorage.getItem('token');
      const headers = token ? { Authorization: `Bearer ${token}` } : {};

      let res;
      if (!editingId) {
        const url = 'https://it4409-deploy-backend.onrender.com/api/products';
        res = await axios.post(url, fd, { headers });
      } else {
        const url = `https://it4409-deploy-backend.onrender.com/api/products/${editingId}`;
        res = await axios.put(url, fd, { headers });
      }

      setShowAdd(false);
      setEditingId(null);
      setForm(EMPTY_FORM);
      setFiles([]);
      fetchProducts();
    } catch (err) {
      setFormError(err?.response?.data?.message || 'Lỗi tạo sản phẩm');
    } finally {
      setCreating(false);
    }
  };

  const handleEditClick = (product) => {
    setEditingId(product._id);
    const existingImages =
      (Array.isArray(product.images) && product.images.length)
        ? product.images
        : (product.image || product.thumbnail || product.img)
          ? [product.image || product.thumbnail || product.img]
          : [];

    setForm({
      name: product.name || '',
      price: product.price ?? '',
      discountPrice: product.discountPrice ?? '',
      stock: product.stock ?? '',
      category: (product.category && product.category._id) ? product.category._id : (product.category || ''),
      brand: (product.brand && product.brand._id) ? product.brand._id : (product.brand || ''),
      description: product.description || '',
      specifications: product.specifications || {},
      highlightsText: Array.isArray(product.highlights) ? product.highlights.join('\n') : '',
      warranty: product.warranty || '',
      origin: product.origin || '',
      isActive: product.isActive ?? true,
      isBestSeller: product.isBestSeller ?? false,
      isNew: product.isNew ?? true,
    });
    setFiles([]);
    setCurrentImages(existingImages);
    setShowAdd(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('Bạn có chắc muốn xóa sản phẩm này?')) return;
    try {
      const token = localStorage.getItem('token');
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      const url = `https://it4409-deploy-backend.onrender.com/api/products/${id}`;
      await axios.delete(url, { headers });
      fetchProducts();
    } catch (err) {
      alert('Xóa sản phẩm thất bại');
    }
  };

  const normalizedSearch = search.trim().toLowerCase();
  const filteredProducts = normalizedSearch
    ? products.filter((p) => (p.name || '').toLowerCase().includes(normalizedSearch))
    : products;

  const specFields = CATEGORY_SPEC_FIELDS[form.category] || [];

  return (
    <div className="bg-white rounded-xl shadow p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold">Danh sách sản phẩm</h2>
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              setEditingId(null);
              setForm(EMPTY_FORM);
              setFiles([]);
              setCurrentImages([]);
              setShowAdd(true);
            }}
            aria-label="Thêm sản phẩm"
            className="p-2 bg-green-600 text-white rounded hover:bg-green-500"
          >
            <Plus size={16} />
          </button>
          <button onClick={fetchProducts} aria-label="Làm mới" className="p-2 border rounded hover:bg-gray-50">
            <RefreshCw size={16} />
          </button>
        </div>
      </div>

      {/* Tìm kiếm sản phẩm theo tên trong admin */}
      <div className="mb-4">
        <input
          type="text"
          className="w-full max-w-sm px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
          placeholder="Tìm sản phẩm theo tên..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {error && <div className="text-sm text-yellow-600 mb-3">{error}</div>}

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="p-3">ID</th>
              <th className="p-3">Ảnh</th>
              <th className="p-3">Tên</th>
              <th className="p-3">Giá</th>
              <th className="p-3">Kho</th>
              <th className="p-3">Danh mục</th>
              <th className="p-3">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={7} className="p-4 text-center">Đang tải...</td></tr>
            ) : (
              filteredProducts.map((p) => (
                <tr key={p._id} className="border-b hover:bg-gray-50">
                  <td className="p-3 font-medium text-blue-600">{p._id}</td>
                  <td className="p-3">
                    {(p.image || p.images?.[0] || p.thumbnail || p.img) ? (
                      <img src={p.image || p.images?.[0] || p.thumbnail || p.img} alt={p.name} className="w-16 h-12 object-cover rounded" />
                    ) : (
                      <div className="w-16 h-12 bg-gray-100 flex items-center justify-center text-xs text-gray-400">Không có ảnh</div>
                    )}
                  </td>
                  <td className="p-3">{p.name}</td>
                  <td className="p-3">{formatPriceAdmin(p.price)}</td>
                  <td className="p-3">{p.stock ?? '-'}</td>
                  <td className="p-3">
                    {(
                      p?.category?.name ||
                      (categories.find(c => c._id === (typeof p.category === 'string' ? p.category : p.category?._id)) || {}).name ||
                      '-'
                    )}
                  </td>
                  <td className="p-3 flex gap-2">
                    <button onClick={() => handleEditClick(p)} aria-label="Sửa" className="text-yellow-600 hover:bg-yellow-100 p-2 rounded">Sửa</button>
                    <button onClick={() => handleDelete(p._id)} aria-label="Xóa" className="text-red-600 hover:bg-red-100 p-2 rounded">Xóa</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {showAdd && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-lg w-full max-w-2xl p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Thêm sản phẩm mới</h3>
              <button onClick={() => { setShowAdd(false); setFormError(''); }} className="text-gray-500">Đóng</button>
            </div>
            <form onSubmit={handleCreate} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <input required name="name" value={form.name} onChange={onChange} placeholder="Tên sản phẩm" className="border p-2 rounded" />
                <input required name="price" value={form.price} onChange={onChange} placeholder="Giá (VND)" type="number" className="border p-2 rounded" />
                <input name="discountPrice" value={form.discountPrice} onChange={onChange} placeholder="Giá khuyến mãi (VND)" type="number" className="border p-2 rounded" />
                <input name="stock" value={form.stock} onChange={onChange} placeholder="Tồn kho" type="number" className="border p-2 rounded" />
                <select name="category" value={form.category} onChange={onChange} className="border p-2 rounded">
                  <option value="">-- Chọn danh mục --</option>
                  {categories.map(cat => (
                    <option key={cat._id} value={cat._id}>{cat.name}</option>
                  ))}
                </select>
                <select name="brand" value={form.brand} onChange={onChange} className="border p-2 rounded">
                  <option value="">-- Chọn thương hiệu --</option>
                  {brands.map(b => (
                    <option key={b._id} value={b._id}>{b.name}</option>
                  ))}
                </select>
              </div>
              <textarea name="description" value={form.description} onChange={onChange} placeholder="Mô tả" className="w-full border p-2 rounded" />
              {specFields.length > 0 && (
                <div className="mt-2 border-t pt-4">
                  <h4 className="font-semibold mb-2 text-sm">Thông số kỹ thuật</h4>
                  <div className="grid grid-cols-2 gap-3">
                    {specFields.map((field) => (
                      <div key={field} className="flex flex-col gap-1">
                        <label className="text-xs text-gray-600">{formatSpecLabel(field)}</label>
                        <input
                          type="text"
                          value={form.specifications?.[field] || ''}
                          onChange={(e) => handleSpecChange(field, e.target.value)}
                          className="border p-2 rounded text-sm"
                          placeholder={formatSpecLabel(field)}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}
              <div>
                <label className="text-sm">Ảnh sản phẩm</label>
                <input type="file" accept="image/*" multiple onChange={onFilesChange} className="mt-2" />
                {editingId && currentImages.length > 0 && (
                  <div className="mt-3 space-y-2">
                    <p className="text-xs text-gray-500">Ảnh hiện tại của sản phẩm (trên server):</p>
                    <div className="flex flex-wrap gap-3">
                      {currentImages.map((url, index) => (
                        <div key={index} className="border rounded p-1 flex flex-col items-center w-24">
                          <img
                            src={url}
                            alt={`image-${index}`}
                            className="w-20 h-16 object-cover rounded"
                          />
                          <p className="mt-1 text-[10px] text-center truncate w-full">
                            {index + 1}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                {files.length > 0 && (
                  <div className="mt-3 space-y-2">
                    <p className="text-xs text-gray-500">Thứ tự ảnh từ trái sang phải sẽ là thứ tự hiển thị.</p>
                    <div className="flex flex-wrap gap-3">
                      {files.map((file, index) => (
                        <div key={index} className="relative border rounded p-1 flex flex-col items-center w-24">
                          <img
                            src={URL.createObjectURL(file)}
                            alt={file.name}
                            className="w-20 h-16 object-cover rounded"
                          />
                          <p className="mt-1 text-[10px] text-center truncate w-full" title={file.name}>
                            {index + 1}. {file.name}
                          </p>
                          <div className="flex items-center justify-center gap-1 mt-1">
                            <button
                              type="button"
                              onClick={() => moveImage(index, -1)}
                              className="text-xs px-1 py-0.5 border rounded disabled:opacity-40"
                              disabled={index === 0}
                            >
                              ←
                            </button>
                            <button
                              type="button"
                              onClick={() => moveImage(index, 1)}
                              className="text-xs px-1 py-0.5 border rounded disabled:opacity-40"
                              disabled={index === files.length - 1}
                            >
                              →
                            </button>
                            <button
                              type="button"
                              onClick={() => removeImage(index)}
                              className="text-xs px-1 py-0.5 border rounded text-red-600"
                            >
                              ✕
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="text-sm">Điểm nổi bật (mỗi dòng một ý)</label>
                  <textarea
                    name="highlightsText"
                    value={form.highlightsText}
                    onChange={onChange}
                    placeholder={"Ví dụ:\n- Màn hình 144Hz\n- SSD 512GB"}
                    className="w-full border p-2 rounded text-sm mt-1"
                    rows={3}
                  />
                </div>
                <div>
                  <label className="text-sm">Bảo hành</label>
                  <input
                    name="warranty"
                    value={form.warranty}
                    onChange={onChange}
                    placeholder="VD: 12 tháng"
                    className="border p-2 rounded w-full text-sm mt-1"
                  />
                </div>
                <div>
                  <label className="text-sm">Xuất xứ</label>
                  <input
                    name="origin"
                    value={form.origin}
                    onChange={onChange}
                    placeholder="VD: Chính hãng"
                    className="border p-2 rounded w-full text-sm mt-1"
                  />
                </div>
                <div className="flex items-center gap-3 col-span-2 mt-2">
                  <label className="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={form.isActive}
                      onChange={(e) => setForm(prev => ({ ...prev, isActive: e.target.checked }))}
                    />
                    Hoạt động
                  </label>
                  <label className="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={form.isBestSeller}
                      onChange={(e) => setForm(prev => ({ ...prev, isBestSeller: e.target.checked }))}
                    />
                    Bán chạy
                  </label>
                  <label className="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={form.isNew}
                      onChange={(e) => setForm(prev => ({ ...prev, isNew: e.target.checked }))}
                    />
                    Sản phẩm mới
                  </label>
                </div>
              </div>
              {formError && <div className="text-sm text-red-600">{formError}</div>}
              <div className="flex justify-end gap-3">
                <button type="button" onClick={() => { setShowAdd(false); setFormError(''); }} className="px-4 py-2 border rounded">Hủy</button>
                <button type="submit" disabled={creating} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-500">
                  {creating
                    ? 'Đang gửi...'
                    : editingId
                    ? 'Lưu'
                    : 'Tạo sản phẩm'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProducts;
