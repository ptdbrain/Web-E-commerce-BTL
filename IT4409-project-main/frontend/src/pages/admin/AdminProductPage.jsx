import { useContext, useState } from "react";
import { ProductContext } from "../../contexts/ProductContext";
import ProductForm from "../../components/admin/ProductForm";
import { toast } from "react-toastify";
import { Pencil, Plus, Trash } from "lucide-react";

export default function ProductAdminPage() {
  const { products, addProduct, updateProduct, deleteProduct } = useContext(ProductContext);
  const [mode, setMode] = useState(null); // "create" | "edit" | null
  const [editingId, setEditingId] = useState(null);

  const editingProduct = products.find((p) => p.id === editingId);

  const handleDelete = (id) => {
    if (window.confirm("Bạn có chắc muốn xóa sản phẩm này?")) {
      deleteProduct(id);
      toast.success("Xóa sản phẩm thành công!");
    }
  };

  const handleSubmit = (values) => {
    if (mode === "create") {
      addProduct(values);
      toast.success("Thêm sản phẩm thành công!");
    } else if (mode === "edit" && editingProduct) {
      updateProduct(editingProduct.id, values);
      toast.success("Cập nhật sản phẩm thành công!");
    }
    setMode(null);
    setEditingId(null);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Quản lý sản phẩm</h2>
        <button
          onClick={() => setMode("create")}
          className="bg-green-600 text-white px-3 py-2 rounded flex items-center gap-2"
        >
          <Plus size={16} /> Thêm sản phẩm
        </button>
      </div>

      {/* Danh sách sản phẩm */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {products.map((p) => (
          <div key={p.id} className="bg-white p-4 rounded shadow">
            <div className="flex justify-between">
              <h3 className="font-semibold">{p.name}</h3>
              <div className="flex gap-2">
                {/* Nút sửa */}
                <button
                  onClick={() => {
                    setMode("edit");
                    setEditingId(p.id);
                  }}
                  className="p-2 bg-blue-100 rounded hover:bg-blue-200"
                  title="Sửa sản phẩm"
                >
                  <Pencil size={16} />
                </button>

                {/* Nút xóa */}
                <button
                  onClick={() => handleDelete(p.id)}
                  className="p-2 bg-red-100 rounded hover:bg-red-200"
                  title="Xóa sản phẩm"
                >
                  <Trash size={16} />
                </button>
              </div>
            </div>

            <p className="text-sm text-gray-600 mt-1">Giá: {p.price.toLocaleString()}₫</p>

            {p.image ? (
              <img
                src={p.image}
                alt={p.name}
                className="mt-3 h-32 w-full object-cover rounded border"
              />
            ) : (
              <div className="mt-3 h-32 w-full rounded border bg-gray-50 flex items-center justify-center text-gray-400">
                Chưa có ảnh
              </div>
            )}

            <div className="mt-3 text-sm text-gray-600">Đã bán: {p.sold || 0}</div>
          </div>
        ))}
      </div>

      {/* Modal form thêm/sửa */}
      {mode && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded shadow-lg w-full max-w-md">
            <div className="border-b p-4 font-semibold">
              {mode === "create" ? "Thêm sản phẩm" : "Chỉnh sửa sản phẩm"}
            </div>
            <ProductForm
              initialValues={
                mode === "edit" && editingProduct
                  ? { name: editingProduct.name, price: editingProduct.price, image: editingProduct.image || "" }
                  : { name: "", price: "", image: "" }
              }
              onSubmit={handleSubmit}
              onCancel={() => {
                setMode(null);
                setEditingId(null);
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}