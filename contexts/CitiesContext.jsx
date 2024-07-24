import {
  useEffect,
  createContext,
  useContext,
  useReducer,
  useCallback,
} from "react";

const BASE_URL = "https://react-quiz-backend-3onp.onrender.com";
const CitiesContext = createContext();
const initialState = {
  cities: [],
  isLoading: false,
  currentCity: {},
  error: "",
};
function reducer(state, action) {
  switch (action.type) {
    case "loading":
      return { ...state, isLoading: true };
    case "cities/loaded":
      return { ...state, cities: action.payLoad, isLoading: false };
    case "rejected":
      return { ...state, isLoading: false, error: action.payLoad };
    case "city/loaded":
      return { ...state, currentCity: action.payLoad, isLoading: false };
    case "city/created":
      return {
        ...state,
        cities: [...state.cities, action.payLoad],
        currentCity: action.payLoad,
        isLoading: false,
      };
    case "city/deleted":
      return {
        ...state,
        cities: state.cities.filter((city) => city.id !== action.payLoad),
        isLoading: false,
        currentCity: {},
      };
  }
}
function CitiesProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const { cities, isLoading, currentCity, error } = state;
  // const [cities, setCities] = useState([]);
  // const [isLoading, setIsloading] = useState(false);
  // const [currentCity, setCurrentCity] = useState({});
  useEffect(function () {
    async function fetchCities() {
      try {
        dispatch({ type: "loading" });
        const response = await fetch(`${BASE_URL}/cities`);
        const citiesData = await response.json();
        dispatch({ type: "cities/loaded", payLoad: citiesData.cities.cities });
      } catch (err) {
        dispatch({ type: "rejected", payLoad: err.message });
      }
    }
    fetchCities();
  }, []);

  const getCity = useCallback(async function getCity(id) {
    try {
      dispatch({ type: "loading" });
      const response = await fetch(`${BASE_URL}/cities/${id}`);
      const cityData = await response.json();
      dispatch({ type: "city/loaded", payLoad: cityData });
    } catch (err) {
      dispatch({ type: "rejected", payLoad: err.message });
    }
  }, []);

  async function createCity(newCity) {
    try {
      dispatch({ type: "loading" });
      const response = await fetch(`${BASE_URL}/cities`, {
        method: "POST",
        body: JSON.stringify(newCity),
        headers: {
          "Content-Type": "application/json",
        },
      });
      const cityData = await response.json();
      dispatch({ type: "city/created", payLoad: cityData });
    } catch (err) {
      dispatch({ type: "rejected", payLoad: err.message });
    }
  }

  async function deleteCity(id) {
    try {
      dispatch({ type: "loading" });
      await fetch(`${BASE_URL}/cities/${id}`, {
        method: "DELETE",
      });
      dispatch({ type: "city/deleted", payLoad: id });
    } catch (err) {
      dispatch({ type: "rejected", payLoad: err.message });
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
        error,
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
