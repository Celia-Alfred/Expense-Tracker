'use client';

import React from 'react';
import Header from './_components/Header';
import Hero from './_components/Hero';
import Testimonials from './_components/Testimonials';

const HomePage = () => {
  return (
    <>
      <Header />
      <Hero />
      
      {/* Testimonials Section */}
      <Testimonials />
    </>
  );
};

export default HomePage;
