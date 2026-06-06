import { Link, useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'

export default function Cart() {
  const { cartItems, removeFromCart, updateQuantity, cartTotal, clearCart } = useCart()
  const navigate = useNavigate()

  const formatPrice = (price) =>
    new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price)

  if (cartItems.length === 0) {
    return (
      <div style={{ padding: '5rem 0' }}>
        <div className="container">
          <div className="empty-state">
            <div className="empty-state-icon">🛒</div>
            <h3 style={{ fontWeight: 700, marginBottom: '1rem' }}>Giỏ hàng trống</h3>
            <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>
              Bạn chưa thêm sản phẩm nào vào giỏ hàng
            </p>
            <Link to="/products">
              <button className="btn-primary-custom" style={{ padding: '14px 32px', fontSize: '1rem' }}>
                🛍️ Tiếp tục mua sắm
              </button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div style={{ padding: '3rem 0' }}>
      <div className="container">
        <div className="page-header">
          <h1 className="section-title">🛒 Giỏ Hàng</h1>
          <div className="section-line" />
          <p className="section-subtitle">{cartItems.length} sản phẩm</p>
        </div>

        <div className="row g-4">
          {/* Cart items */}
          <div className="col-lg-8">
            {cartItems.map(item => (
              <div key={item.id} className="cart-item">
                <img
                  src={item.imageUrl || `https://picsum.photos/seed/${item.id}/200/200`}
                  alt={item.name}
                  className="cart-item-img"
                />
                <div className="flex-1" style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600, marginBottom: '0.25rem' }}>{item.name}</div>
                  {item.category && (
                    <div style={{ fontSize: '0.8rem', color: 'var(--primary-light)', marginBottom: '0.5rem' }}>
                      {item.category.name}
                    </div>
                  )}
                  <div style={{ color: 'var(--accent)', fontWeight: 700 }}>{formatPrice(item.price)}</div>
                </div>

                <div className="d-flex flex-column align-items-end gap-2">
                  <button
                    onClick={() => removeFromCart(item.id)}
                    style={{ background: 'none', border: 'none', color: 'var(--secondary)', cursor: 'pointer', fontSize: '1.2rem' }}
                  >🗑️</button>
                  <div className="qty-control">
                    <button className="qty-btn" onClick={() => updateQuantity(item.id, item.quantity - 1)}>−</button>
                    <span className="qty-value">{item.quantity}</span>
                    <button className="qty-btn" onClick={() => updateQuantity(item.id, item.quantity + 1)}>+</button>
                  </div>
                  <div style={{ fontWeight: 700, color: 'var(--accent)' }}>
                    {formatPrice(item.price * item.quantity)}
                  </div>
                </div>
              </div>
            ))}

            <div className="d-flex justify-content-between mt-3">
              <button
                className="btn-outline-custom"
                style={{ fontSize: '0.875rem', padding: '8px 20px' }}
                onClick={() => navigate('/products')}
              >
                ← Tiếp tục mua sắm
              </button>
              <button
                onClick={clearCart}
                style={{
                  background: 'none',
                  border: '1px solid var(--secondary)',
                  borderRadius: '10px',
                  padding: '8px 20px',
                  color: 'var(--secondary)',
                  cursor: 'pointer',
                  fontSize: '0.875rem',
                }}
              >
                🗑️ Xóa tất cả
              </button>
            </div>
          </div>

          {/* Summary */}
          <div className="col-lg-4">
            <div className="card-dark p-4" style={{ position: 'sticky', top: '90px' }}>
              <h5 style={{ fontWeight: 700, marginBottom: '1.5rem' }}>Tóm tắt đơn hàng</h5>

              <div className="d-flex justify-content-between mb-2" style={{ color: 'var(--text-secondary)' }}>
                <span>Tạm tính</span>
                <span>{formatPrice(cartTotal)}</span>
              </div>
              <div className="d-flex justify-content-between mb-2" style={{ color: 'var(--accent)' }}>
                <span>Phí vận chuyển</span>
                <span>Miễn phí</span>
              </div>

              <hr style={{ borderColor: 'var(--dark-border)' }} />

              <div className="d-flex justify-content-between mb-4">
                <span style={{ fontWeight: 700, fontSize: '1.1rem' }}>Tổng cộng</span>
                <span style={{ fontWeight: 800, fontSize: '1.3rem', color: 'var(--accent)' }}>
                  {formatPrice(cartTotal)}
                </span>
              </div>

              <button
                className="btn-primary-custom w-100"
                style={{ fontSize: '1rem', padding: '14px' }}
                onClick={() => navigate('/checkout')}
              >
                🏪 Tiến hành thanh toán
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
