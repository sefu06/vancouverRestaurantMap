import 'dotenv/config';
import fetch from 'node-fetch';
import pkg from 'pg';
const { Pool } = pkg;

// PostgreSQL pool
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

async function seedRestaurants() {
    const limit = 100;
    let offset = 0;
    let totalInserted = 0;

    // First, fetch total_count from API
    const firstRes = await fetch(
        `https://opendata.vancouver.ca/api/explore/v2.1/catalog/datasets/storefronts-inventory/records?limit=100&refine=retail_category%3A%22Food%20%26%20Beverage%22`
    );
    if (!firstRes.ok) {
        console.error('Failed to fetch API:', firstRes.status, firstRes.statusText);
        return;
    }
    const firstJson = await firstRes.json();
    const totalRecords = firstJson.total_count;
    console.log(`Total records to fetch: ${totalRecords}`);

    while (offset < totalRecords) {
        const url = `https://opendata.vancouver.ca/api/explore/v2.1/catalog/datasets/storefronts-inventory/records?limit=${limit}&offset=${offset}&refine=retail_category%3A%22Food%20%26%20Beverage%22`;

        console.log(`Fetching records ${offset} - ${Math.min(offset + limit, totalRecords)}...`);

        const res = await fetch(url);
        if (!res.ok) {
            console.error('Failed to fetch API:', res.status, res.statusText);
            break;
        }

        const json = await res.json();
        const records = json.results;

        if (!records || records.length === 0) {
            console.log('No more records to fetch.');
            break;
        }

        for (const r of records) {
            if (!r.business_name || !r.geo_point_2d) continue;

            const name = r.business_name;
            const lat = r.geo_point_2d.lat;
            const lng = r.geo_point_2d.lon;

            if (!lat || !lng) continue;

            try {
                await pool.query(
                    `INSERT INTO restaurants (name, latitude, longitude, cuisine, source)
           VALUES ($1, $2, $3, $4, $5)
           ON CONFLICT DO NOTHING`,
                    [name, lat, lng, null, 'Vancouver Open Data']
                );
                totalInserted++;

                // Log progress every 100 inserts
                if (totalInserted % 100 === 0) {
                    console.log(`Inserted ${totalInserted} records so far...`);
                }
            } catch (err) {
                console.error('Insert failed for', name, err);
            }
        }

        offset += limit;
    }

    console.log(`Seeding complete. Total inserted: ${totalInserted}`);
    await pool.end();
}

seedRestaurants().catch(err => console.error('Seeding failed:', err));
