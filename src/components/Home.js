import React from 'react';
import { Link } from 'react-router-dom';

function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-r from-purple-600 to-indigo-600 flex flex-col items-center justify-center text-white">
      <h1 className="text-4xl md:text-6xl font-bold mb-4">WebAstro AI</h1>
      <p className="text-lg md:text-xl mb-8 text-center px-4">
        Apki kundli, apka bhavishya! Abhi chat karen aur janiye apki zindagi ke raaz.
      </p>
      <Link
        to="/chat"
        className="bg-yellow-400 text-black px-6 py-3 rounded-full text-lg font-semibold hover:bg-yellow-500 transition"
      >
        Abhi Chat Karen
      </Link>
    </div>
  );
}

export default Home;
