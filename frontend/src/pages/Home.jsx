import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { productAPI, categoryAPI } from '../services/api'
import ProductCard from '../components/ProductCard'

export default function Home() {
  const { data: productsData } = useQuery({
    queryKey: ['products-featured'],
    queryFn: () => productAPI.getAll({ page: 0, size: 8 })
  })

  const { data: categoriesData } = useQuery({
    queryKey: ['categories'],
    queryFn: () => categoryAPI.getAll()
  })

  const products = productsData?.data?.content || []
  const categories = categoriesData?.data || []

  return (
    <>
      {/* Hero Section */}
      <section className="hero-section">
        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <div className="row align-items-center">
            <div className="col-lg-6">
              <div className="hero-badge">✨ Mới nhất 2024</div>
              <h1 className="hero-title mb-4">
                Khám phá<br />
                <span>Ngàn Sản Phẩm</span><br />
                Chất Lượng
              </h1>
              <p className="hero-subtitle mb-5">
                Mua sắm thông minh với hàng nghìn sản phẩm chính hãng.
                Giao hàng nhanh, giá tốt, đảm bảo chất lượng.
              </p>
              <div className="d-flex gap-3 flex-wrap">
                <Link to="/products">
                  <button className="btn-primary-custom" style={{ fontSize: '1rem', padding: '14px 32px' }}>
                    🛍️ Mua Sắm Ngay
                  </button>
                </Link>
                <Link to="/register">
                  <button className="btn-outline-custom" style={{ fontSize: '1rem', padding: '14px 32px' }}>
                    🚀 Đăng Ký Miễn Phí
                  </button>
                </Link>
              </div>

              {/* Stats */}
              <div className="d-flex gap-4 mt-5">
                {[
                  { val: '10K+', label: 'Sản phẩm' },
                  { val: '5K+', label: 'Khách hàng' },
                  { val: '99%', label: 'Hài lòng' },
                ].map(s => (
                  <div key={s.label}>
                    <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--primary-light)' }}>{s.val}</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{s.label}</div>
                  </div>
                ))}
              </div>
            </div>
            <div className="col-lg-6 d-none d-lg-flex justify-content-center">
              <div style={{
                width: 400,
                height: 400,
                background: 'radial-gradient(circle, rgba(108,99,255,0.3) 0%, transparent 70%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '10rem',
                animation: 'float 3s ease-in-out infinite',
              }}>
                🛍️
              </div>
            </div>
          </div>
        </div>
        <style>{`
          @keyframes float {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-20px); }
          }
        `}</style>
      </section>

      {/* Features */}
      <section style={{ padding: '5rem 0', background: 'var(--dark)' }}>
        <div className="container">
          <div className="row g-4">
            {[
              { icon: '🚀', title: 'Giao hàng nhanh', desc: 'Nhận hàng trong 24-48 giờ tại TP.HCM và Hà Nội' },
              { icon: '🛡️', title: 'Hàng chính hãng', desc: 'Cam kết 100% hàng chính hãng, có hoá đơn đầy đủ' },
              { icon: '💳', title: 'Thanh toán an toàn', desc: 'Hỗ trợ đa dạng phương thức thanh toán' },
              { icon: '🔄', title: 'Đổi trả dễ dàng', desc: 'Đổi trả miễn phí trong vòng 30 ngày' },
            ].map(f => (
              <div key={f.title} className="col-6 col-md-3">
                <div className="feature-card">
                  <div className="feature-icon">{f.icon}</div>
                  <h6 style={{ fontWeight: 700, marginBottom: '0.5rem' }}>{f.title}</h6>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', margin: 0 }}>{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      {categories.length > 0 && (
        <section style={{ padding: '3rem 0 5rem', background: 'var(--dark-card)' }}>
          <div className="container">
            <div className="text-center mb-4">
              <h2 className="section-title">Danh Mục</h2>
              <div className="section-line" />
            </div>
            <div className="d-flex flex-wrap gap-3 justify-content-center">
              {categories.map(cat => (
                <Link key={cat.id} to={`/products?categoryId=${cat.id}`} style={{ textDecoration: 'none' }}>
                  <div style={{
                    background: 'var(--dark)',
                    border: '1px solid var(--dark-border)',
                    borderRadius: '16px',
                    padding: '1rem 1.5rem',
                    textAlign: 'center',
                    cursor: 'pointer',
                    transition: 'var(--transition)',
                    minWidth: 120,
                  }}
                    onMouseEnter={e => {
                      e.currentTarget.style.borderColor = 'var(--primary)'
                      e.currentTarget.style.transform = 'translateY(-4px)'
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.borderColor = 'var(--dark-border)'
                      e.currentTarget.style.transform = 'translateY(0)'
                    }}
                  >
                    <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>📦</div>
                    <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{cat.name}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{cat.productCount} SP</div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Featured Products */}
      <section style={{ padding: '5rem 0' }}>
        <div className="container">
          <div className="text-center mb-5">
            <h2 className="section-title">Sản Phẩm Nổi Bật</h2>
            <div className="section-line" />
            <p className="section-subtitle">Những sản phẩm được yêu thích nhất</p>
          </div>

          {products.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon">📦</div>
              <h5 style={{ color: 'var(--text-secondary)' }}>Chưa có sản phẩm nào</h5>
              <p style={{ color: 'var(--text-muted)' }}>Admin hãy thêm sản phẩm để hiển thị tại đây</p>
            </div>
          ) : (
            <div className="row g-4">
              {products.map(product => (
                <div key={product.id} className="col-6 col-md-4 col-lg-3">
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          )}

          {products.length > 0 && (
            <div className="text-center mt-5">
              <Link to="/products">
                <button className="btn-primary-custom" style={{ padding: '14px 40px', fontSize: '1rem' }}>
                  Xem tất cả sản phẩm →
                </button>
              </Link>
            </div>
          )}
        </div>
      </section>
    </>
  )
}
