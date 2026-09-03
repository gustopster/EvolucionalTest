import { Navigate, Route, Routes } from 'react-router-dom';

import { ProductsPage } from './pages/ProductsPage/ProductsPage';
import { ProductDetailsPage } from './pages/ProductDetailsPage/ProductDetailsPage';
import { ProductFormPage } from './pages/ProductFormPage/ProductFormPage';

const App = () => {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <Navigate
            to="/produtos"
            replace
          />
        }
      />

      <Route
        path="/produtos"
        element={<ProductsPage />}
      />

      <Route
        path="/produtos/novo"
        element={<ProductFormPage />}
      />

      <Route
        path="/produtos/:id/editar"
        element={<ProductFormPage />}
      />

      <Route
        path="/produtos/:id"
        element={<ProductDetailsPage />}
      />
    </Routes>
  );
};

export default App;