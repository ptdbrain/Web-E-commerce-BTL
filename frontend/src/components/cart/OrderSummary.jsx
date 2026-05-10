import React from 'react';

function formatPrice(price) {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
}

export function OrderSummary({ cartItems, voucherResult }) {
  const subtotal = cartItems.reduce(
    (acc, item) => acc + item.newPrice * item.quantity,
    0
  );
  const shippingFee = subtotal > 0 ? 30000 : 0;

  const discountAmount = voucherResult?.discountAmount || 0;
  const discountedSubtotal = Math.max(subtotal - discountAmount, 0);
  const total = discountedSubtotal + shippingFee;

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-xl font-semibold mb-4">Xác nhận đơn hàng</h3>
      
      
      <div className="space-y-4 mb-4 max-h-60 overflow-y-auto pr-2">
        {cartItems.map((item) => {
          const itemResult = voucherResult?.itemResults?.find(
            (r) => String(r.productId) === String(item.id)
          );
          const eligible = voucherResult?.voucher && itemResult?.eligible;

          return (
            <div key={item.id} className="flex items-center gap-4">
              <img
                src={item.imageUrl}
                alt={item.name}
                className="w-16 h-16 object-contain rounded-md border"
              />
              <div className="flex-grow">
                <p className="text-sm font-medium text-gray-800">{item.name}</p>
                <p className="text-xs text-gray-500">Số lượng: {item.quantity}</p>
                {voucherResult?.voucher && (
                  <p
                    className={`text-xs mt-1 ${eligible ? 'text-green-600' : 'text-red-500'}`}
                  >
                    {eligible
                      ? 'Áp dụng voucher'
                      : 'Không áp dụng voucher cho sản phẩm này'}
                  </p>
                )}
              </div>
              <span className="text-sm font-medium">
                {formatPrice(item.newPrice * item.quantity)}
              </span>
            </div>
          );
        })}
      </div>

      
      <div className="border-t border-gray-200 pt-4 space-y-2">
        <div className="flex justify-between text-sm text-gray-600">
          <span>Tạm tính</span>
          <span>{formatPrice(subtotal)}</span>
        </div>
        {discountAmount > 0 && (
          <div className="flex justify-between text-sm text-green-700">
            <span>Giảm giá từ voucher</span>
            <span>-{formatPrice(discountAmount)}</span>
          </div>
        )}
        <div className="flex justify-between text-sm text-gray-600">
          <span>Phí giao hàng</span>
          <span>{formatPrice(shippingFee)}</span>
        </div>
        <div className="flex justify-between text-lg font-bold text-gray-900 pt-2">
          <span>Tổng tiền</span>
          <span>{formatPrice(total)}</span>
        </div>
      </div>
    </div>
  );
}