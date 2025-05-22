
import React from 'react';
import InteractiveHero from '../components/elab/InteractiveHero';
import TestCatalog from '../components/elab/TestCatalog';
import TopRatedTests from '../components/elab/TopRatedTests';

const Index = () => {
  return (
    <div className="container mx-auto px-4">
      <InteractiveHero />
      <TestCatalog />
      <TopRatedTests />
    </div>
  );
};

export default Index;
