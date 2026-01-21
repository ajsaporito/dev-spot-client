import { Outlet } from 'react-router-dom';

import Navbar from './components/Navbar.tsx'

function App() {
  return (
    <>
      <Navbar />
      <main>
        <Outlet />
      </main>
    </>
  )
}

export default App;
