import { useState, useEffect } from "react";
import "leaflet/dist/leaflet.css";
import Map from "./components/Map";


function App() {
    const [restaurants, setRestaurants] = useState([]);


    useEffect(() => {
        fetch("http://localhost:5000/restaurants")
            .then(response => response.json())  // parse JSON
            .then(data => setRestaurants(data)) // save to state
            .catch(err => console.error("Error fetching restaurants:", err));
    }, []);
    
    return <Map restaurants={restaurants} />;


}

export default App;