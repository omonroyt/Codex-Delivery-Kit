INSERT INTO users (email, password_hash, name, role)
VALUES ('admin@example.com', '$2a$10$eh9X4j7dHp0xajsp9xthFOfn9jWeWwcdbeYQ8Y8HFxG4Xq4UN4QwK', 'Admin', 'admin')
ON CONFLICT (email) DO NOTHING;
