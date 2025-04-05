const pool = require('../database'); 

// Add or Update a Review
const rateProduct = async (req, res) => {
    try {
        const { user_email, product_id, rating, review_text } = req.body;

        if (!user_email || !product_id || !rating) {
            return res.status(400).json({ error: "user_email, product_id, and rating are required" });
        }

        // Upsert query (Insert or Update)
        const query = `
            INSERT INTO reviews (user_email, product_id, rating, review_text, created_at)
            VALUES ($1, $2, $3, $4, NOW())
            ON CONFLICT (user_email, product_id) 
            DO UPDATE SET rating = EXCLUDED.rating, review_text = EXCLUDED.review_text, created_at = NOW()
            RETURNING *;
        `;

        const values = [user_email, product_id, rating, review_text];

        const result = await pool.query(query, values);

        res.status(200).json({ message: "Review submitted successfully", review: result.rows[0] });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

// Get Average Rating for a Product
const getAverageRating = async (req, res) => {
    try {
        const { product_id } = req.query;

        if (!product_id) {
            return res.status(400).json({ error: "Product ID is required" });
        }

        const query = `
            SELECT COALESCE(AVG(rating), 0) AS average_rating, COUNT(*) AS total_reviews
            FROM reviews WHERE product_id = $1;
        `;

        const result = await pool.query(query, [product_id]);

        res.status(200).json({
            product_id,
            average_rating: parseFloat(result.rows[0].average_rating).toFixed(2),
            total_reviews: result.rows[0].total_reviews
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

module.exports = { rateProduct, getAverageRating };
