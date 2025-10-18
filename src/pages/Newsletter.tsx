import type { FC } from 'react';

/**
 * Newsletter subscription page with gradient background and centered content.
 */
const Newsletter: FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0e27] via-[#1a1f3a] to-[#2a2f4a] px-12 pt-24">
      <div className="mx-auto max-w-7xl">
        <h1 className="mb-8 font-rammetto text-6xl text-white">
          Newsletter
        </h1>
        <p className="text-xl text-white/80">
          Subscribe to our newsletter...
        </p>
      </div>
    </div>
  );
};

export default Newsletter;