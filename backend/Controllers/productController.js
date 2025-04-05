const pool = require("../database");

// Add a new product with image upload
const addProduct = async (req, res) => {
    try {
      console.log("Received request body:", req.body);
      
  
      const { name, description, category, price } = req.body;
      const pictures = req.files ? req.files.map((file) => file.path) : [];
  
      if (!name || !category || !price) {
        return res.status(400).json({ error: "Name, category, and price are required" });
      }
  
      const query = `
        INSERT INTO products (name, description, category, price, pictures)
        VALUES ($1, $2, $3, $4, $5) RETURNING *;
      `;
  
      const values = [
        name,
        description ? JSON.stringify(description) : null,
        category,
        price,
        pictures,
      ];
  
      const result = await pool.query(query, values);
  
      res.status(201).json({
        message: "Product added successfully",
        product: result.rows[0],
      });
    } catch (error) {
      console.error("Error adding product:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  };

  const getLatestProduct = async (req, res) => {
    try {
        const query = "SELECT * FROM products ORDER BY created_at DESC LIMIT 1;";
        const result = await pool.query(query);

        if (result.rows.length === 0) {
            return res.status(404).json({ error: "No products found" });
        }

        res.json(result.rows[0]);
    } catch (error) {
        console.error("Error fetching latest product:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

const getRecentProducts = async (req, res) => {
    try {
        // Get the limit from query params or default to 5
        const limit = req.query.limit ? parseInt(req.query.limit) : 10;
        
        const query = "SELECT * FROM products ORDER BY created_at DESC LIMIT $1;";
        const result = await pool.query(query, [limit]);

        if (result.rows.length === 0) {
            return res.status(404).json({ error: "No products found" });
        }

        res.json(result.rows);
    } catch (error) {
        console.error("Error fetching recent products:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

const getRecentProductsByCategory = async (req, res) => {
    try {
        const query = `
            SELECT DISTINCT ON (category) * 
            FROM products 
            ORDER BY category, created_at DESC;
        `;

        const result = await pool.query(query);

        if (result.rows.length === 0) {
            return res.status(404).json({ error: "No products found" });
        }

        res.json(result.rows);
    } catch (error) {
        console.error("Error fetching recent products by category:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

const getTopSelling =  async (req, res) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit) : 12;
      
      const query = `
        SELECT * FROM products 
        ORDER BY qty_sold DESC 
        LIMIT $1
      `;
      
      const result = await pool.query(query, [limit]);
      
      res.json(result.rows);
    } catch (error) {
      console.error('Error fetching top selling products:', error);
      res.status(500).json({ error: 'Server error' });
    }
  }


  // Get products by category
const getProductsByCategory = async (req, res) => {
    try {
      const { category } = req.params;
      
      if (!category) {
        return res.status(400).json({ error: "Category parameter is required" });
      }
      
      const query = "SELECT * FROM products WHERE category = $1 ORDER BY created_at DESC;";
      const result = await pool.query(query, [category]);
  
      if (result.rows.length === 0) {
        return res.status(404).json({ error: "No products found in this category" });
      }
  
      res.json(result.rows);
    } catch (error) {
      console.error("Error fetching products by category:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  };

  const updateQuantitiesSold = async (req, res) => {
    try {
      const { productUpdates } = req.body;
      
      if (!productUpdates || !Array.isArray(productUpdates)) {
        return res.status(400).json({ error: "Invalid product updates format. Expected an array of product updates." });
      }
      
      // Begin a transaction to ensure all updates succeed or fail together
      const client = await pool.connect();
      
      try {
        await client.query('BEGIN');
        
        // Process each product update
        for (const update of productUpdates) {
          const { productId, quantitySold } = update;
          
          if (!productId || typeof quantitySold !== 'number' || quantitySold <= 0) {
            throw new Error(`Invalid update data for product ID ${productId}`);
          }
          
          // Update the product's qty_sold value
          const updateQuery = `
            UPDATE products 
            SET qty_sold = COALESCE(qty_sold, 0) + $1 
            WHERE id = $2
            RETURNING id, name, qty_sold;
          `;
          
          const result = await client.query(updateQuery, [quantitySold, productId]);
          
          if (result.rows.length === 0) {
            throw new Error(`Product with ID ${productId} not found`);
          }
        }
        
        // Commit the transaction if all updates were successful
        await client.query('COMMIT');
        
        res.status(200).json({ 
          message: "Product quantities sold updated successfully",
          count: productUpdates.length
        });
        
      } catch (error) {
        // Roll back the transaction if any update failed
        await client.query('ROLLBACK');
        throw error;
      } finally {
        // Release the client back to the pool
        client.release();
      }
      
    } catch (error) {
      console.error("Error updating product quantities sold:", error);
      res.status(500).json({ error: "Failed to update product quantities", message: error.message });
    }
  };

module.exports = { addProduct, getLatestProduct, getRecentProducts, getRecentProductsByCategory , getTopSelling, getProductsByCategory , updateQuantitiesSold};


