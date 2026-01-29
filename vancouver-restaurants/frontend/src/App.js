import { useState, useEffect } from "react";
import "leaflet/dist/leaflet.css";
import Map from "./components/Map";


function App() {
    const [restaurants, setRestaurants] = useState([]);


    useEffect(() => {
        fetch("http://localhost:5001/restaurants")
            .then(response => response.json())  // parse JSON
            .then(data => {
                console.log("Fetched restaurants:", data);
                setRestaurants(data);
              })
            .catch(err => console.error("Error fetching restaurants:", err));
    }, []);
    
    return <Map restaurants={restaurants} />;


}

export default App;