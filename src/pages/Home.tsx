import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';

const Home: React.FC = () => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [textLoaded, setTextLoaded] = useState(false);
  const { user } = useAuth();
  const [userData, setUserData] = useState<any>(null);

  useEffect(() => {
    fetchUserData();
    setTimeout(() => setTextLoaded(true), 100);
  }, [user]);

  const fetchUserData = async () => {
    if (user) {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (!error && data) {
        setUserData(data);
      }
    }
  };

  const displayName = userData?.full_name || user?.user_metadata?.full_name || user?.email?.split('@')[0] || user?.phone || 'Guest';

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-600 via-blue-500 to-blue-600 flex flex-col items-center justify-center overflow-hidden relative">
      <div className="md:hidden absolute top-28 w-full px-4">
        <h1 
          className={`text-white text-8xl font-bold text-center -mb-2 transition-all duration-[1500ms] ease-out ${
            textLoaded 
              ? 'opacity-100 blur-0 translate-y-0' 
              : 'opacity-0 blur-lg translate-y-8'
          }`}
          style={{ fontFamily: 'Arial, sans-serif' }}
        >
          Welcome
        </h1>
        <p 
          className={`text-white text-2xl font-semibold text-left pl-8 transition-all duration-[1500ms] ease-out ${
            textLoaded 
              ? 'opacity-100 blur-0 translate-y-0' 
              : 'opacity-0 blur-lg translate-y-8'
          }`}
          style={{ 
            fontFamily: 'Arial, sans-serif',
            transitionDelay: '200ms'
          }}
        >
          {displayName}
        </p>
      </div>

      <div className="hidden md:block absolute top-32 left-1/2 transform -translate-x-1/2" style={{ marginLeft: '128px' }}>
        <h1 
          className={`text-white text-7xl font-bold text-center mb-2 transition-all duration-[1500ms] ease-out ${
            textLoaded 
              ? 'opacity-100 blur-0 translate-y-0' 
              : 'opacity-0 blur-lg translate-y-8'
          }`}
          style={{ fontFamily: 'Arial, sans-serif' }}
        >
          Welcome
        </h1>
        <p 
          className={`text-white text-4xl font-semibold text-center transition-all duration-[1500ms] ease-out ${
            textLoaded 
              ? 'opacity-100 blur-0 translate-y-0' 
              : 'opacity-0 blur-lg translate-y-8'
          }`}
          style={{ 
            fontFamily: 'Arial, sans-serif',
            transitionDelay: '200ms'
          }}
        >
          {displayName}
        </p>
      </div>

      <div className="relative w-full max-w-full px-2 md:px-8 mt-16 md:mt-32">
        <img
          src="/src/assets/images/home/homeworld.png"
          alt="Home World"
          className={`w-full h-auto transition-all duration-[1500ms] ease-out md:scale-100 scale-[2] ${
            imageLoaded 
              ? 'opacity-100 blur-0 translate-y-0' 
              : 'opacity-0 blur-lg translate-y-8'
          }`}
          onLoad={() => setImageLoaded(true)}
        />
      </div>
    </div>
  );
};

export default Home;