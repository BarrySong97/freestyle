import './App.css'

import routes from 'freestyle:routes';
import { useRoutes } from 'react-router-dom';
function App() {

   const routeElement = useRoutes(routes);
  return routeElement;
}

export default App
