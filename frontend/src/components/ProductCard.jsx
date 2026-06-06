import { Link } from 'react-router-dom'
import { useCart } from '../context/CartContext'

export default function ProductCard({ product }) {
  const { addToCart } = useCart()

  const discount = product.originalPrice && product.originalPrice > product.price
    ? Math.round((1 - product.price / product.originalPrice) * 100)
    : null

  const formatPrice = (price) =>
    new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price)

  return (
    <div className="product-card">
      <div style={{ overflow: 'hidden', position: 'relative' }}>
        <img
          src={product.imageUrl || `https://picsum.photos/seed/${product.id}/400/280`}
          alt={product.name}
          className="product-card-img"
        />
        {discount && (
          <span style={{
            position: 'absolute',
            top: '12px',
            left: '12px',
            background: 'var(--secondary)',
            color: 'white',
            fontSize: '0.72rem',
            fontWeight: 700,
            padding: '4px 10px',
            borderRadius: '8px',
          }}>
            -{discount}%
          </span>
        )}
        {product.stockQuantity === 0 && (
          <div style={{
            position: 'absolute',
            inset: 0,
            background: 'rgba(0,0,0,0.6)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontWeight: 700
          }}>
            Hết hàng
          </div>
        )}
      </div>

      <div className="product-card-body">
        {product.category && (
          <div className="product-card-category">{product.category.name}</div>
        )}
        <div className="product-card-title">{product.name}</div>
        <div className="mt-auto">
          <div className="d-flex align-items-baseline gap-1 flex-wrap">
            <span className="product-price">{formatPrice(product.price)}</span>
            {product.originalPrice && product.originalPrice > product.price && (
              <span className="product-original-price">{formatPrice(product.originalPrice)}</span>
            )}
          </div>
          <div className="mt-1" style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
            Còn {product.stockQuantity} sản phẩm
          </div>
        </div>
      </div>

      <div className="product-card-footer">
        <button
          className="btn-add-cart"
          onClick={() => addToCart(product)}
          disabled={product.stockQuantity === 0}
        >
          🛒 Thêm vào giỏ
        </button>
        <Link to={`/products/${product.id}`}>
          <button className="btn-view-detail">👁️</button>
        </Link>
      </div>
    </div>
  )
}
