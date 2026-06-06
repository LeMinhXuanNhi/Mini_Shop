-- =====================================================
-- SCRIPT THÊM DỮ LIỆU MẪU CHO MINI SHOP
-- Chạy trong pgAdmin: Query Tool của database shop_db
-- =====================================================

-- 1. Thêm danh mục sản phẩm
INSERT INTO categories (name, slug, description) VALUES
('Điện thoại', 'dien-thoai', 'Điện thoại thông minh các hãng'),
('Laptop', 'laptop', 'Máy tính xách tay'),
('Phụ kiện', 'phu-kien', 'Tai nghe, sạc, ốp lưng và phụ kiện khác'),
('Máy tính bảng', 'may-tinh-bang', 'iPad, tablet các loại'),
('Đồng hồ thông minh', 'dong-ho-thong-minh', 'Smartwatch, đồng hồ fitness')
ON CONFLICT (name) DO NOTHING;

-- 2. Thêm tài khoản admin (password: Admin@123)
-- BCrypt hash của "Admin@123"
INSERT INTO users (username, email, password_hash, full_name, phone, role, created_at)
VALUES (
    'admin',
    'admin@minishop.com',
    '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iAt6Z5EH',
    'Quản trị viên',
    '0901234567',
    'ADMIN',
    NOW()
)
ON CONFLICT (username) DO NOTHING;

-- Lấy ID admin để dùng khi tạo sản phẩm
-- (Bạn có thể kiểm tra: SELECT id FROM users WHERE username = 'admin')

-- 3. Thêm sản phẩm mẫu
INSERT INTO products (name, description, price, original_price, stock_quantity, image_url, is_active, created_at, category_id, created_by)
SELECT
    'iPhone 15 Pro Max',
    'iPhone 15 Pro Max với chip A17 Pro, camera 48MP, màn hình 6.7 inch Super Retina XDR. Thiết kế titan cao cấp, pin lâu dài.',
    34990000,
    37990000,
    50,
    'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=500',
    true,
    NOW(),
    c.id,
    u.id
FROM categories c, users u
WHERE c.slug = 'dien-thoai' AND u.username = 'admin'
ON CONFLICT DO NOTHING;

INSERT INTO products (name, description, price, original_price, stock_quantity, image_url, is_active, created_at, category_id, created_by)
SELECT
    'Samsung Galaxy S24 Ultra',
    'Samsung Galaxy S24 Ultra với bút S-Pen tích hợp, camera 200MP, màn hình Dynamic AMOLED 6.8 inch, chip Snapdragon 8 Gen 3.',
    29990000,
    32990000,
    35,
    'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=500',
    true,
    NOW(),
    c.id,
    u.id
FROM categories c, users u
WHERE c.slug = 'dien-thoai' AND u.username = 'admin'
ON CONFLICT DO NOTHING;

INSERT INTO products (name, description, price, original_price, stock_quantity, image_url, is_active, created_at, category_id, created_by)
SELECT
    'MacBook Pro 14 M3',
    'MacBook Pro 14 inch với chip Apple M3, RAM 18GB, SSD 512GB. Hiệu năng vượt trội, pin 22 giờ, màn hình Liquid Retina XDR.',
    52990000,
    55990000,
    20,
    'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500',
    true,
    NOW(),
    c.id,
    u.id
FROM categories c, users u
WHERE c.slug = 'laptop' AND u.username = 'admin'
ON CONFLICT DO NOTHING;

INSERT INTO products (name, description, price, original_price, stock_quantity, image_url, is_active, created_at, category_id, created_by)
SELECT
    'Dell XPS 15 2024',
    'Dell XPS 15 với Intel Core i7 thế hệ 14, RAM 32GB, SSD 1TB, màn hình OLED 4K 15.6 inch. Thiết kế cao cấp cho dân chuyên nghiệp.',
    45990000,
    49990000,
    15,
    'https://images.unsplash.com/photo-1593642702821-c8da6771f0c6?w=500',
    true,
    NOW(),
    c.id,
    u.id
FROM categories c, users u
WHERE c.slug = 'laptop' AND u.username = 'admin'
ON CONFLICT DO NOTHING;

INSERT INTO products (name, description, price, original_price, stock_quantity, image_url, is_active, created_at, category_id, created_by)
SELECT
    'AirPods Pro 2',
    'AirPods Pro thế hệ 2 với chip H2, chống ồn chủ động ANC, Adaptive Transparency, pin 6 giờ + 24 giờ với hộp sạc.',
    6490000,
    7490000,
    100,
    'https://images.unsplash.com/photo-1588423771073-b8903febb85b?w=500',
    true,
    NOW(),
    c.id,
    u.id
FROM categories c, users u
WHERE c.slug = 'phu-kien' AND u.username = 'admin'
ON CONFLICT DO NOTHING;

INSERT INTO products (name, description, price, original_price, stock_quantity, image_url, is_active, created_at, category_id, created_by)
SELECT
    'iPad Pro 12.9 M2',
    'iPad Pro 12.9 inch với chip Apple M2, màn hình Liquid Retina XDR ProMotion 120Hz, hỗ trợ Apple Pencil 2 và Magic Keyboard.',
    27990000,
    29990000,
    25,
    'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=500',
    true,
    NOW(),
    c.id,
    u.id
FROM categories c, users u
WHERE c.slug = 'may-tinh-bang' AND u.username = 'admin'
ON CONFLICT DO NOTHING;

INSERT INTO products (name, description, price, original_price, stock_quantity, image_url, is_active, created_at, category_id, created_by)
SELECT
    'Apple Watch Series 9',
    'Apple Watch Series 9 với chip S9 mới nhất, tính năng Double Tap, màn hình sáng hơn 2000 nits, theo dõi sức khỏe toàn diện.',
    11990000,
    12990000,
    60,
    'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=500',
    true,
    NOW(),
    c.id,
    u.id
FROM categories c, users u
WHERE c.slug = 'dong-ho-thong-minh' AND u.username = 'admin'
ON CONFLICT DO NOTHING;

INSERT INTO products (name, description, price, original_price, stock_quantity, image_url, is_active, created_at, category_id, created_by)
SELECT
    'Samsung Galaxy Watch 6',
    'Samsung Galaxy Watch 6 với vòng cung chỉnh thể thao, theo dõi giấc ngủ nâng cao, đo huyết áp, đo ECG, pin 40 giờ.',
    7490000,
    8490000,
    45,
    'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500',
    true,
    NOW(),
    c.id,
    u.id
FROM categories c, users u
WHERE c.slug = 'dong-ho-thong-minh' AND u.username = 'admin'
ON CONFLICT DO NOTHING;

INSERT INTO products (name, description, price, original_price, stock_quantity, image_url, is_active, created_at, category_id, created_by)
SELECT
    'Ốp lưng iPhone 15 MagSafe',
    'Ốp lưng silicon cao cấp tương thích MagSafe cho iPhone 15/15 Plus/15 Pro/15 Pro Max. Chất liệu mềm, chống sốc, nhiều màu.',
    390000,
    490000,
    200,
    'https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=500',
    true,
    NOW(),
    c.id,
    u.id
FROM categories c, users u
WHERE c.slug = 'phu-kien' AND u.username = 'admin'
ON CONFLICT DO NOTHING;

INSERT INTO products (name, description, price, original_price, stock_quantity, image_url, is_active, created_at, category_id, created_by)
SELECT
    'Xiaomi 14 Ultra',
    'Xiaomi 14 Ultra với camera Leica 50MP, chip Snapdragon 8 Gen 3, sạc nhanh 90W, màn hình AMOLED 6.73 inch 120Hz.',
    25990000,
    27990000,
    30,
    'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500',
    true,
    NOW(),
    c.id,
    u.id
FROM categories c, users u
WHERE c.slug = 'dien-thoai' AND u.username = 'admin'
ON CONFLICT DO NOTHING;

-- Kiểm tra kết quả
SELECT 'Categories:' as info, COUNT(*) as total FROM categories
UNION ALL
SELECT 'Products:', COUNT(*) FROM products
UNION ALL
SELECT 'Users:', COUNT(*) FROM users;
