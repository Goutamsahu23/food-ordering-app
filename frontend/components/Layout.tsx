import Footer from './Footer';
import Navbar from './Navbar';
import React from 'react';

export default function Layout({ children }: { children: React.ReactNode }){
  return (
    <div>
      <Navbar />
      <main className="container page-section">
        {children}
      </main>
      <Footer/>
    </div>
  );
}
