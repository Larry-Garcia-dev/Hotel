import React from 'react';
import Header from '../../components/common/Header';
import Footer from '../../components/common/Footer';
import Hero from '../../components/public/Hero';
import Amenities from '../../components/public/Amenities';
import RoomList from '../../components/public/RoomList';
import AvailabilityForm from '../../components/public/AvailabilityForm';
import Contact from '../../components/public/Contact';

function HomePage() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <Amenities />
        <AvailabilityForm />
        <RoomList />
        <Contact />
      </main>
      <Footer />
    </>
  );
}

export default HomePage;
