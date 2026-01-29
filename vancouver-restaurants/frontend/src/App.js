import { useState, useEffect } from "react";

function App() {
    const [restaurants, setRestaurants] = useState([]);


    useEffect(() => {
        fetch("http://localhost:5000/restaurants")
            .then(response => response.json())  // parse JSON
            .then(data => setRestaurants(data)) // save to state
            .catch(err => console.error("Error fetching restaurants:", err));
    }, []);

    return (
        <div>
            <h1>Restaurants</h1>
            <ul>
                {restaurants.map(r => (
                    <li key={r.id}>
                        {r.name} - {r.cuisine} - {r.price_range}
                    </li>
                ))}
            </ul>
        </div>
      );

}

export default App;