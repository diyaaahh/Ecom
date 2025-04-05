const pool = require("../database");

// Add item to cart
const addToCart = async (req, res) => {
  try {
    const { userEmail,productId, quantity } = req.body;
     console.log("Request Body:", req.body);

    // Check if item already exists in cart
    const checkQuery = "SELECT * FROM cart_items WHERE user_email = $1 AND product_id = $2";
    const checkResult = await pool.query(checkQuery, [userEmail, productId]);
    
    if (checkResult.rows.length > 0) {
      // Update existing cart item
      const updateQuery = "UPDATE cart_items SET quantity = $1, updated_at = CURRENT_TIMESTAMP WHERE user_email = $2 AND product_id = $3 RETURNING *";
      const result = await pool.query(updateQuery, [quantity, userEmail, productId]);
      return res.json(result.rows[0]);
    } else {
      // Insert new cart item
      const insertQuery = "INSERT INTO cart_items (user_email, product_id, quantity) VALUES ($1, $2, $3) RETURNING *";
      const result = await pool.query(insertQuery, [userEmail, productId, quantity]);
      return res.status(201).json(result.rows[0]);
    }
  } catch (error) {
    console.error("Error adding item to cart:", error);
    res.status(500).json({ error: "Failed to add item to cart" });
  }
};

// Get user's cart
const getCart = async (req, res) => {
  try {
    const userEmail = req.user?.email || req.query.userEmail;
    
    // Join with products table to get product details
    const query = `
      SELECT ci.id, ci.quantity, ci.product_id, 
             p.name, p.price, p.pictures, 
             (p.price * ci.quantity) as subtotal
      FROM cart_items ci
      JOIN products p ON ci.product_id = p.id
      WHERE ci.user_email = $1
      ORDER BY ci.created_at DESC
    `;
    
    const result = await pool.query(query, [userEmail]);
    
    // Calculate cart totals
    const items = result.rows;
    const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
    const subtotal = items.reduce((sum, item) => sum + parseFloat(item.subtotal), 0);
    
    res.json({
      items,
      totalItems,
      subtotal
    });
  } catch (error) {
    console.error("Error fetching cart:", error);
    res.status(500).json({ error: "Failed to fetch cart" });
  }
};

// Update cart item quantity
const updateCartItem = async (req, res) => {
  try {
    const { id } = req.params;
    const { quantity } = req.body;
    const userEmail = req.user.email;
    
    if (quantity < 1) {
      return res.status(400).json({ error: "Quantity must be at least 1" });
    }
    
    const query = "UPDATE cart_items SET quantity = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 AND user_email = $3 RETURNING *";
    const result = await pool.query(query, [quantity, id, userEmail]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Cart item not found" });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error("Error updating cart item:", error);
    res.status(500).json({ error: "Failed to update cart item" });
  }
};

// Remove item from cart
const removeFromCart = async (req, res) => {
  try {
    const { id, userEmail } = req.body;
    
    
    const query = "DELETE FROM cart_items WHERE id = $1 AND user_email = $2 RETURNING *";
    const result = await pool.query(query, [id, userEmail]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Cart item not found" });
    }
    
    res.json({ message: "Item removed from cart" });
  } catch (error) {
    console.error("Error removing item from cart:", error);
    res.status(500).json({ error: "Failed to remove item from cart" });
  }
};

// Clear cart
const clearCart = async (req, res) => {
  try {
    const userEmail = req.query.userEmail;
    
    const query = "DELETE FROM cart_items WHERE user_email = $1";
    await pool.query(query, [userEmail]);
    
    res.json({ message: "Cart cleared successfully" });
  } catch (error) {
    console.error("Error clearing cart:", error);
    res.status(500).json({ error: "Failed to clear cart" });
  }
};

module.exports = {
  addToCart,
  getCart,
  updateCartItem,
  removeFromCart,
  clearCart
};