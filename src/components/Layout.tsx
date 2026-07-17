import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import Container from './Container';

const Layout: React.FC = () => {
  return (
    <div className="min-h-screen bg-white text-neutral-dark flex flex-col">
      <Navbar />
      
      <main className="flex-grow flex flex-col justify-start">
        <Container className="py-6">
          <Outlet />
        </Container>
      </main>

      <Footer />
    </div>
  );
};

export default Layout;
