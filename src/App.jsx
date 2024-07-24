import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
// import HomePage from "../pages/HomePage";
// import Product from "../pages/Product";
// import Pricing from "../pages/Pricing";
// import PageNotFound from "../pages/PageNotFound";
// import AppLayout from "../pages/AppLayout";
// import Login from "../pages/Login";
import CityList from "../components/CityList";
import CountryList from "../components/CountryList";
import City from "../components/City";
import Form from "../components/Form";
import SpinnerFullPage from "../components/SpinnerFullPage";
import { CitiesProvider } from "../contexts/CitiesContext";
import { AuthProvider } from "../contexts/AuthContext";
import ProtectRoutes from "../pages/ProtectRoutes";
import { Suspense, lazy } from "react";
const HomePage = lazy(() => import("../pages/HomePage"));
const Product = lazy(() => import("../pages/Product"));
const Pricing = lazy(() => import("../pages/Pricing"));
const PageNotFound = lazy(() => import("../pages/PageNotFound"));
const AppLayout = lazy(() => import("../pages/AppLayout"));
const Login = lazy(() => import("../pages/Login"));

function App() {
  return (
    <AuthProvider>
      <CitiesProvider>
        <BrowserRouter>
          <Suspense fallback={<SpinnerFullPage />}>
            <Routes>
              <Route index element={<HomePage />} />
              <Route path="products" element={<Product />} />
              <Route path="pricing" element={<Pricing />} />
              <Route path="*" element={<PageNotFound />} />
              <Route
                path="app"
                element={
                  <ProtectRoutes>
                    <AppLayout />
                  </ProtectRoutes>
                }
              >
                <Route index element={<Navigate to="cities" replace />} />
                <Route path="cities" element={<CityList />} />
                <Route path="countries" element={<CountryList />} />
                <Route path="cities/:id" element={<City />} />
                <Route path="form" element={<Form />} />
              </Route>
              <Route path="login" element={<Login />} />
            </Routes>
          </Suspense>
        </BrowserRouter>
      </CitiesProvider>
    </AuthProvider>
  );
}
export default App;
