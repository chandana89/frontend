import React, { useEffect, useState } from 'react';
import { api } from './api';

function App() {
  const [portfolio, setPortfolio] = useState<string>('');

  useEffect(() => {
   api.GetBio()
      .then(setPortfolio)
  }, []);

  return (
    <div>
      <h1>Portfolio</h1>
      {portfolio}
    </div>
  );
}

export default App;