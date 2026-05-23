USE amazon_clone;

DELETE FROM order_items;
DELETE FROM orders;
DELETE FROM wishlist;
DELETE FROM carts;
DELETE FROM product_images;
DELETE FROM products;

INSERT INTO users (id, name, email, password_hash)
VALUES (1, 'Saksham', 'default@amazon-clone.local', '$2a$10$vV9ejsyHS4IN4/XcI2Qbm.LM40piV8jVWjk4VrmpeQAwzrFKOhLcW')
ON DUPLICATE KEY UPDATE name = VALUES(name), email = VALUES(email);

INSERT INTO products (name, category, price, stock, rating, description, specifications) VALUES
('Sony Wireless Headphones', 'electronics', 2499.00, 34, 4.4, 'Comfortable over-ear wireless headphones with punchy bass, long battery life, and fast USB-C charging.', JSON_OBJECT('Battery', '40 hours', 'Connectivity', 'Bluetooth 5.3', 'Warranty', '1 year')),
('Samsung Tablet', 'electronics', 14999.00, 18, 4.2, 'Slim 10-inch tablet for streaming, browsing, reading, and everyday productivity.', JSON_OBJECT('Display', '10.4 inch FHD', 'Storage', '128 GB', 'RAM', '6 GB')),
('ChefMate Non-Stick Cookware Set', 'kitchen', 3299.00, 27, 4.5, 'Three-piece non-stick cookware set with stay-cool handles for everyday Indian cooking.', JSON_OBJECT('Pieces', '3', 'Material', 'Aluminium', 'Induction Ready', 'Yes')),
('Pigeon Electric Kettle', 'kitchen', 1299.00, 42, 4.3, 'Fast boiling electric kettle with auto shut-off and stainless steel inner body.', JSON_OBJECT('Capacity', '1.8 L', 'Power', '1500 W', 'Safety', 'Auto cut-off')),
('CozyNest Cotton Bedsheet Set', 'home', 1899.00, 51, 4.1, 'Soft breathable cotton bedsheet set with two pillow covers and long-lasting color.', JSON_OBJECT('Size', 'Queen', 'Material', '100% cotton', 'Thread Count', '220')),
('LumaDesk LED Study Lamp', 'home', 899.00, 63, 4.0, 'Compact LED desk lamp with brightness controls and flexible neck.', JSON_OBJECT('Modes', '3 brightness levels', 'Power', 'USB', 'Color', 'Warm white')),
('Zebronics GX Mechanical Keyboard', 'gaming', 4599.00, 21, 4.6, 'RGB mechanical keyboard with tactile switches and anti-ghosting for gaming sessions.', JSON_OBJECT('Switches', 'Blue mechanical', 'Lighting', 'RGB', 'Layout', 'TKL')),
('Zebronics Gaming Mouse', 'gaming', 1999.00, 38, 4.4, 'Lightweight gaming mouse with adjustable DPI and programmable buttons.', JSON_OBJECT('DPI', '12000', 'Buttons', '7 programmable', 'Weight', '78 g')),
('Atomic Habits Paperback', 'books', 499.00, 100, 4.8, 'A practical guide to building good habits, breaking bad ones, and improving every day.', JSON_OBJECT('Author', 'James Clear', 'Format', 'Paperback', 'Language', 'English')),
('The Pragmatic Programmer', 'books', 799.00, 56, 4.7, 'A timeless programming book covering habits, practices, and engineering judgment.', JSON_OBJECT('Authors', 'Andrew Hunt, David Thomas', 'Format', 'Paperback', 'Language', 'English')),
('Nike Running Shoes', 'fashion', 2799.00, 44, 4.2, 'Lightweight running shoes with breathable mesh and cushioned sole.', JSON_OBJECT('Upper', 'Mesh', 'Sole', 'EVA', 'Closure', 'Lace-up')),
('Classic Denim Jacket', 'fashion', 2199.00, 31, 4.1, 'Casual denim jacket with a regular fit and durable metal buttons.', JSON_OBJECT('Material', 'Denim cotton blend', 'Fit', 'Regular', 'Care', 'Machine wash'));

INSERT INTO product_images (product_id, image_url, sort_order) VALUES
((SELECT id FROM products WHERE name = 'Sony Wireless Headphones'), '/images/image1.webp', 1),
((SELECT id FROM products WHERE name = 'Sony Wireless Headphones'), '/images/image2.webp', 2),
((SELECT id FROM products WHERE name = 'Sony Wireless Headphones'), '/images/image3.jpeg', 3),
((SELECT id FROM products WHERE name = 'Samsung Tablet'), '/images/image4.webp', 1),
((SELECT id FROM products WHERE name = 'Samsung Tablet'), '/images/image5.webp', 2),
((SELECT id FROM products WHERE name = 'ChefMate Non-Stick Cookware Set'), '/images/image6.jpeg', 1),
((SELECT id FROM products WHERE name = 'ChefMate Non-Stick Cookware Set'), '/images/image7.jpeg', 2),
((SELECT id FROM products WHERE name = 'Pigeon Electric Kettle'), '/images/image8.jpg', 1),
((SELECT id FROM products WHERE name = 'Pigeon Electric Kettle'), '/images/image9.jpeg', 2),
((SELECT id FROM products WHERE name = 'CozyNest Cotton Bedsheet Set'), '/images/image10.jpeg', 1),
((SELECT id FROM products WHERE name = 'CozyNest Cotton Bedsheet Set'), '/images/image11.jpeg', 2),
((SELECT id FROM products WHERE name = 'LumaDesk LED Study Lamp'), '/images/image12.jpeg', 1),
((SELECT id FROM products WHERE name = 'LumaDesk LED Study Lamp'), '/images/image13.jpeg', 2),
((SELECT id FROM products WHERE name = 'Zebronics GX Mechanical Keyboard'), '/images/image14.jpeg', 1),
((SELECT id FROM products WHERE name = 'Zebronics GX Mechanical Keyboard'), '/images/image15.jpeg', 2),
((SELECT id FROM products WHERE name = 'Zebronics Gaming Mouse'), '/images/image16.jpeg', 1),
((SELECT id FROM products WHERE name = 'Zebronics Gaming Mouse'), '/images/image17.jpeg', 2),
((SELECT id FROM products WHERE name = 'Atomic Habits Paperback'), '/images/image18.webp', 1),
((SELECT id FROM products WHERE name = 'Atomic Habits Paperback'), '/images/image19.jpeg', 2),
((SELECT id FROM products WHERE name = 'The Pragmatic Programmer'), '/images/image20.jpeg', 1),
((SELECT id FROM products WHERE name = 'The Pragmatic Programmer'), '/images/image21.png', 2),
((SELECT id FROM products WHERE name = 'Nike Running Shoes'), '/images/image22.webp', 1),
((SELECT id FROM products WHERE name = 'Nike Running Shoes'), '/images/image23.webp', 2),
((SELECT id FROM products WHERE name = 'Classic Denim Jacket'), '/images/image24.jpeg', 1),
((SELECT id FROM products WHERE name = 'Classic Denim Jacket'), '/images/image25.jpeg', 2);

