import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { PortfolioRoutes } from './routes';

function App() {
  return (
  
      <Routes>
          {PortfolioRoutes.map(route =>
            <Route
              key={route.path}
              path={route.path}
              element={route.element}
            />
          )}
      </Routes>
  )
}

export default App;