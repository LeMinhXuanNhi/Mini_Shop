import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { productAPI, categoryAPI } from '../services/api'
import ProductCard from '../components/ProductCard'

export default function ProductList() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [keyword, setKeyword] = useState(searchParams.get('keyword') || '')
  const [selectedCategory, setSelectedCategory] = useState(
    searchParams.get('categoryId') ? Number(searchParams.get('categoryId')) : null
  )
  const [page, setPage] = useState(0)

  const { data: productsData, isLoading } = useQuery({
    queryKey: ['products', page, selectedCategory, keyword],
    queryFn: () => productAPI.getAll({
      page,
      size: 12,
      categoryId: selectedCategory || undefined,
      keyword: keyword || undefined
    })
  })

  const { data: categoriesData } = useQuery({
    queryKey: ['categories'],
    queryFn: () => categoryAPI.getAll()
  })

  const products = productsData?.data?.content || []
  const totalPages = productsData?.data?.totalPages || 0
  const totalElements = productsData?.data?.totalElements || 0
  const categories = categoriesData?.data || []

  const handleSearch = (e) => {
    e.preventDefault()
    setPage(0)
  }

  const handleCategoryChange = (catId) => {
    setSelectedCategory(catId)
    setPage(0)
  }

  return (
    <div style={{ padding: '3rem 0' }}>
      <div className="container">
        {/* Header */}
        <div className="page-header">
          <h1 className="section-title">🛍️ Sản Phẩm</h1>
          <div className="section-line" />
          <p className="section-subtitle">{totalElements} sản phẩm được tìm thấy</p>
        </div>

        {/* Search */}
        <form onSubmit={handleSearch} className="mb-4">
          <div className="d-flex gap-3">
            <input
              type="text"
              className="form-control-dark flex-1"
              placeholder="🔍 Tìm kiếm sản phẩm..."
              value={keyword}
              onChange={e => setKeyword(e.target.value)}
              style={{ flex: 1 }}
            />
            <button type="submit" className="btn-primary-custom" style={{ whiteSpace: 'nowrap', padding: '10px 24px' }}>
              Tìm kiếm
            </button>
          </div>
        </form>

        {/* Category filter */}
        <div className="d-flex flex-wrap gap-2 mb-5">
          <button
            className={`category-filter-btn ${!selectedCategory ? 'active' : ''}`}
            onClick={() => handleCategoryChange(null)}
          >
            Tất cả
          </button>
          {categories.map(cat => (
            <button
              key={cat.id}
              className={`category-filter-btn ${selectedCategory === cat.id ? 'active' : ''}`}
              onClick={() => handleCategoryChange(cat.id)}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Products grid */}
        {isLoading ? (
          <div className="loading-spinner">
            <div className="spinner-custom" />
          </div>
        ) : products.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">🔍</div>
            <h5 style={{ color: 'var(--text-secondary)' }}>Không tìm thấy sản phẩm</h5>
            <p style={{ color: 'var(--text-muted)' }}>Thử từ khóa khác hoặc chọn danh mục khác</p>
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

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="d-flex justify-content-center gap-2 mt-5">
            <button
              className="btn-outline-custom"
              onClick={() => setPage(p => p - 1)}
              disabled={page === 0}
              style={{ padding: '8px 20px' }}
            >
              ← Trước
            </button>
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i}
                onClick={() => setPage(i)}
                style={{
                  padding: '8px 16px',
                  borderRadius: '8px',
                  border: 'none',
                  background: page === i ? 'var(--primary)' : 'var(--dark-card)',
                  color: page === i ? 'white' : 'var(--text-secondary)',
                  cursor: 'pointer',
                  fontWeight: 600,
                }}
              >
                {i + 1}
              </button>
            ))}
            <button
              className="btn-outline-custom"
              onClick={() => setPage(p => p + 1)}
              disabled={page >= totalPages - 1}
              style={{ padding: '8px 20px' }}
            >
              Sau →
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
