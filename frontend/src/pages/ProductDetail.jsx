import { useParams, useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'
import { productAPI } from '../services/api'
import { useCart } from '../context/CartContext'

export default function ProductDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { addToCart } = useCart()
  const [quantity, setQuantity] = useState(1)

  const { data, isLoading, isError } = useQuery({
    queryKey: ['product', id],
    queryFn: () => productAPI.getById(id)
  })

  const product = data?.data

  const formatPrice = (price) =>
    new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price)

  if (isLoading) return (
    <div className="loading-spinner" style={{ minHeight: '60vh' }}>
      <div className="spinner-custom" />
    </div>
  )

  if (isError || !product) return (
    <div className="container text-center" style={{ paddingTop: '5rem' }}>
      <div style={{ fontSize: '4rem' }}>😕</div>
      <h3>Không tìm thấy sản phẩm</h3>
      <button className="btn-primary-custom mt-3" onClick={() => navigate('/products')}>
        ← Quay lại
      </button>
    </div>
  )

  const discount = product.originalPrice && product.originalPrice > product.price
    ? Math.round((1 - product.price / product.originalPrice) * 100) : null

  return (
    <div style={{ padding: '3rem 0' }}>
      <div className="container">
        {/* Breadcrumb */}
        <div className="mb-4" style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
          <span style={{ cursor: 'pointer', color: 'var(--primary)' }} onClick={() => navigate('/')}>Trang chủ</span>
          {' / '}
          <span style={{ cursor: 'pointer', color: 'var(--primary)' }} onClick={() => navigate('/products')}>Sản phẩm</span>
          {' / '}
          <span>{product.name}</span>
        </div>

        <div className="row g-5">
          {/* Image */}
          <div className="col-md-5">
            <div style={{
              background: 'var(--dark-card)',
              borderRadius: 'var(--border-radius)',
              overflow: 'hidden',
              border: '1px solid var(--dark-border)',
              position: 'relative'
            }}>
              <img
                src={product.imageUrl || `https://picsum.photos/seed/${product.id}/600/500`}
                alt={product.name}
                style={{ width: '100%', height: 400, objectFit: 'cover' }}
              />
              {discount && (
                <span style={{
                  position: 'absolute',
                  top: '16px',
                  left: '16px',
                  background: 'var(--secondary)',
                  color: 'white',
                  fontSize: '0.9rem',
                  fontWeight: 700,
                  padding: '6px 14px',
                  borderRadius: '10px',
                }}>
                  -{discount}%
                </span>
              )}
            </div>
          </div>

          {/* Info */}
          <div className="col-md-7">
            {product.category && (
              <div className="product-card-category mb-2">{product.category.name}</div>
            )}
            <h1 style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: '1rem' }}>{product.name}</h1>

            {/* Price */}
            <div className="d-flex align-items-baseline gap-3 mb-4">
              <span style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--accent)' }}>
                {formatPrice(product.price)}
              </span>
              {product.originalPrice && product.originalPrice > product.price && (
                <span style={{ fontSize: '1.2rem', color: 'var(--text-muted)', textDecoration: 'line-through' }}>
                  {formatPrice(product.originalPrice)}
                </span>
              )}
            </div>

            {/* Stock */}
            <div className="d-flex align-items-center gap-2 mb-4">
              <span style={{
                padding: '4px 12px',
                borderRadius: '20px',
                fontSize: '0.8rem',
                fontWeight: 700,
                background: product.stockQuantity > 0 ? 'rgba(67,233,123,0.15)' : 'rgba(255,101,132,0.15)',
                color: product.stockQuantity > 0 ? 'var(--accent)' : 'var(--secondary)',
              }}>
                {product.stockQuantity > 0 ? `✅ Còn ${product.stockQuantity} sản phẩm` : '❌ Hết hàng'}
              </span>
            </div>

            {/* Description */}
            {product.description && (
              <div className="mb-4">
                <h6 style={{ fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '0.75rem' }}>Mô tả sản phẩm</h6>
                <p style={{ color: 'var(--text-secondary)', lineHeight: 1.8 }}>{product.description}</p>
              </div>
            )}

            {/* Quantity */}
            {product.stockQuantity > 0 && (
              <div className="mb-4">
                <h6 style={{ fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '0.75rem' }}>Số lượng</h6>
                <div className="qty-control" style={{ display: 'inline-flex' }}>
                  <button className="qty-btn" onClick={() => setQuantity(q => Math.max(1, q - 1))}>−</button>
                  <span className="qty-value">{quantity}</span>
                  <button
                    className="qty-btn"
                    onClick={() => setQuantity(q => Math.min(product.stockQuantity, q + 1))}
                  >+</button>
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="d-flex gap-3 flex-wrap">
              <button
                className="btn-primary-custom"
                style={{ fontSize: '1rem', padding: '14px 32px' }}
                disabled={product.stockQuantity === 0}
                onClick={() => addToCart(product, quantity)}
              >
                🛒 Thêm vào giỏ hàng
              </button>
              <button
                className="btn-outline-custom"
                style={{ fontSize: '1rem', padding: '14px 32px' }}
                onClick={() => navigate('/products')}
              >
                ← Tiếp tục mua sắm
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
