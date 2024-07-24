import { useState, useEffect, createContext, useContext } from "react";
import { json } from "react-router-dom";

const BASE_URL = "http://localhost:8000";
const CitiesContext = createContext();
function CitiesProvider({ children }) {
  const [cities, setCities] = useState([]);
  const [isLoading, setIsloading] = useState(false);
  const [currentCity, setCurrentCity] = useState({});
  useEffect(function () {
    async function fetchCities() {
      try {
        setIsloading(true);
        const response = await fetch(`${BASE_URL}/cities`);
        const citiesData = await response.json();
        setCities(citiesData);
      } catch (err) {
        console.error(err.message);
      } finally {
        setIsloading(false);
      }
    }
    fetchCities();
  }, []);

  async function getCity(id) {
    try {
      setIsloading(true);
      const response = await fetch(`${BASE_URL}/cities/${id}`);
      const cityData = await response.json();

      setCurrentCity(cityData);
    } catch (err) {
      console.error(err.message);
    } finally {
      setIsloading(false);
    }
  }

  async function createCity(newCity) {
    try {
      setIsloading(true);
      const response = await fetch(`${BASE_URL}/cities`, {
        method: "POST",
        body: JSON.stringify(newCity),
        headers: {
          "Content-Type": "application/json",
        },
      });
      const cityData = await response.json();
      setCities((cities) => [...cities, cityData]);
    } catch (err) {
      console.error(err.message);
    } finally {
      setIsloading(false);
    }
  }

  async function deleteCity(id) {
    try {
      setIsloading(true);
      await fetch(`${BASE_URL}/cities/${id}`, {
        method: "DELETE",
      });
      setCities((cities) => cities.filter((city) => city.id !== id));
    } catch (err) {
      console.error(err.message);
    } finally {
      setIsloading(false);
    }
  }
  return (
    <CitiesContext.Provider
      value={{
        cities,
        isLoading,
        getCity,
        currentCity,
        createCity,
        deleteCity,
      }}
    >
      {children}
    </CitiesContext.Provider>
  );
}
function useCities() {
  const context = useContext(CitiesContext);
  if (context === undefined)
    throw new Error("Context was used outside the cities provider");
  return context;
}

export { CitiesProvider, useCities };
