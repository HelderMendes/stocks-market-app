import { Button } from '@/components/ui/button';
import React from 'react';

const HomePage = () => {
  return (
    <div className="flex h-screen items-center justify-center">
      <Button
        variant={'ghost'}
        size={'lg'}
        onClick={(e) => {
          e.preventDefault();
          alert('Button clicked!');
          console.log('Button was clicked');
        }}
        className=""
      >
        Click Me
      </Button>
    </div>
  );
};

export default HomePage;
