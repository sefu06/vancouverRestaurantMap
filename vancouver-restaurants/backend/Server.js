import express from "express";
import cors from "cors";
import pkg from "pg";
const { Pool } = pkg;

const app = express();
app.use(cors());
app.use(express.json());

const PORT = 5001;

//PostgreSQL pool Connection
const pool = new Pool({
    user: "selinafu", 
    hose: "localhost", 
    database: "vancouver_restaurants",
    password: "",
    port: 5432

});

//GET cuisuine and price endpoint
app.get("/restaurants", async (req, res) => {
    try {
        const { cuisine, price } = req.query;

        let query = "SELECT * FROM restaurants WHERE 1=1"
        const params = [];

        if (cuisine) {
            params.push(cuisine);
            query += ` AND cuisine ILIKE $${params.length}`;
        }

        if (price) {
            params.push(price);
            query += ` AND price_range = $${params.length}`;
        }
        
        const result = await pool.query(query, params);
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Database query failed" });
    }
    
});

app.get("/restaurants/:id/menu", async (req, res) => {
    try {
        const restaurantId = req.params.id;
        const result = await pool.query(
            "SELECT id, name, price FROM menu_items WHERE restaurant_id = $1",
            [restaurantId]
        );
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Database query failed" });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
  