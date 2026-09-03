import { Navigate, Route, Routes } from 'react-router-dom';

import { ProductsPage } from './pages/ProductsPage/ProductsPage';

import './App.css';

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/produtos" replace />} />
      <Route path="/produtos" element={<ProductsPage />} />
    </Routes>
  );
}

export default App;