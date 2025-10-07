import CocaColaGrid from './cocacola/CocaColaGrid';
import CocaColaModal from './cocacola/CocaColaModal';
import { COCA_COLA_CONFIG } from '../../data/cocacola';

const CocaColaSection = () => {
  const { assets, animationDelays, content, snowflakeCount } = COCA_COLA_CONFIG;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200 relative overflow-hidden pt-24">
      <CocaColaModal snowflakeCount={snowflakeCount} />
      <CocaColaGrid 
        assets={assets}
        animationDelays={animationDelays}
        content={content}
      />
    </div>
  );
};

export default CocaColaSection;