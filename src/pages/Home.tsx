import { useState, useEffect, useCallback } from 'react';
import type { FC } from 'react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import type { User } from '@supabase/supabase-js';

// Types
interface UserData {
  user_id: string;
  full_name?: string;
  email?: string;
  phone?: string;
  created_at?: string;
  updated_at?: string;
}

interface AnimationState {
  imageLoaded: boolean;
  textLoaded: boolean;
}

// Constants
const ANIMATION_DELAYS = {
  TEXT_INITIAL: 100,
  TEXT_STAGGER: 200,
  TRANSITION_DURATION: 1500,
} as const;

const ANIMATION_CLASSES = {
  visible: 'opacity-100 blur-0 translate-y-0',
  hidden: 'opacity-0 blur-lg translate-y-8',
} as const;

// Utility functions
const getDisplayName = (userData: UserData | null, user: User | null): string => {
  if (userData?.full_name) return userData.full_name;
  if (user?.user_metadata?.full_name) return user.user_metadata.full_name;
  if (user?.email) return user.email.split('@')[0];
  if (user?.phone) return user.phone;
  return 'Guest';
};

const getAnimationClass = (isLoaded: boolean): string => {
  return isLoaded ? ANIMATION_CLASSES.visible : ANIMATION_CLASSES.hidden;
};

// Subcomponents
interface WelcomeTextProps {
  displayName: string;
  isLoaded: boolean;
}

const MobileWelcomeText: FC<WelcomeTextProps> = ({ displayName, isLoaded }) => (
  <div className="md:hidden absolute top-28 w-full px-4">
    <h1
      className={`text-white text-8xl font-bold text-center -mb-2 transition-all duration-[1500ms] ease-out font-berkshire ${getAnimationClass(
        isLoaded
      )}`}
    >
      Welcome
    </h1>
    <p
      className={`text-white text-2xl font-semibold text-left pl-8 transition-all duration-[1500ms] ease-out ${getAnimationClass(
        isLoaded
      )}`}
      style={{
        fontFamily: 'Arial, sans-serif',
        transitionDelay: `${ANIMATION_DELAYS.TEXT_STAGGER}ms`,
      }}
    >
      {displayName}
    </p>
  </div>
);

const DesktopWelcomeText: FC<WelcomeTextProps> = ({ displayName, isLoaded }) => (
  <div
    className="hidden md:block absolute top-32 left-1/2 transform -translate-x-1/2"
    style={{ marginLeft: '128px' }}
  >
    <h1
      className={`text-white text-7xl font-bold text-center mb-2 transition-all duration-[1500ms] ease-out font-berkshire ${getAnimationClass(
        isLoaded
      )}`}
    >
      Welcome
    </h1>
    <p
      className={`text-white text-4xl font-semibold text-center transition-all duration-[1500ms] ease-out ${getAnimationClass(
        isLoaded
      )}`}
      style={{
        fontFamily: 'Arial, sans-serif',
        transitionDelay: `${ANIMATION_DELAYS.TEXT_STAGGER}ms`,
      }}
    >
      {displayName}
    </p>
  </div>
);

interface HeroImageProps {
  isLoaded: boolean;
  onLoad: () => void;
}

const HeroImage: FC<HeroImageProps> = ({ isLoaded, onLoad }) => (
  <div className="relative w-full max-w-full px-2 md:px-8 mt-16 md:mt-32">
    <img
      src="/images/home/homeworld.png"
      alt="Home World"
      className={`w-full h-auto transition-all duration-[1500ms] ease-out md:scale-100 scale-[2] ${getAnimationClass(
        isLoaded
      )}`}
      onLoad={onLoad}
      loading="eager"
    />
  </div>
);

// Main Component
const Home: FC = () => {
  const { user } = useAuth();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [animation, setAnimation] = useState<AnimationState>({
    imageLoaded: false,
    textLoaded: false,
  });

  const fetchUserData = useCallback(async () => {
    if (!user) {
      setUserData(null);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error) {
        console.error('Error fetching user data:', error);
        return;
      }

      if (data) {
        setUserData(data as UserData);
      }
    } catch (err) {
      console.error('Unexpected error:', err);
    }
  }, [user]);

  useEffect(() => {
    fetchUserData();

    const timer = setTimeout(() => {
      setAnimation((prev) => ({ ...prev, textLoaded: true }));
    }, ANIMATION_DELAYS.TEXT_INITIAL);

    return () => clearTimeout(timer);
  }, [fetchUserData]);

  const handleImageLoad = useCallback(() => {
    setAnimation((prev) => ({ ...prev, imageLoaded: true }));
  }, []);

  const displayName = getDisplayName(userData, user);

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-600 via-blue-500 to-blue-600 flex flex-col items-center justify-center overflow-hidden relative">
      <MobileWelcomeText displayName={displayName} isLoaded={animation.textLoaded} />
      <DesktopWelcomeText displayName={displayName} isLoaded={animation.textLoaded} />
      <HeroImage isLoaded={animation.imageLoaded} onLoad={handleImageLoad} />
    </div>
  );
};

export default Home;