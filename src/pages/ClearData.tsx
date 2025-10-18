import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight, Trash2, AlertCircle } from 'lucide-react';
import type { FC } from 'react';

// Types
type ConfirmDialogType = 'cache' | 'history' | null;

interface DataOption {
  id: string;
  title: string;
  description: string;
  iconBgColor: string;
  iconColor: string;
  action: () => void;
}

interface ConfirmDialogConfig {
  title: string;
  description: string;
  confirmText: string;
  confirmButtonClass: string;
  onConfirm: () => void;
}

// Constants
const DIALOG_CONFIGS: Record<Exclude<ConfirmDialogType, null>, ConfirmDialogConfig> = {
  cache: {
    title: 'Clear Cache?',
    description: 'This will remove temporary files to free up storage space. Your data will remain safe.',
    confirmText: 'Clear',
    confirmButtonClass: 'bg-orange-500 hover:bg-orange-600',
    onConfirm: () => {
      // TODO: Implement cache clearing logic
      console.log('Cache cleared');
    },
  },
  history: {
    title: 'Clear History?',
    description: 'This will permanently delete your browsing history. This action cannot be undone.',
    confirmText: 'Clear',
    confirmButtonClass: 'bg-red-500 hover:bg-red-600',
    onConfirm: () => {
      // TODO: Implement history clearing logic
      console.log('History cleared');
    },
  },
};

// Component: Header
interface HeaderProps {
  onBack: () => void;
}

const Header: FC<HeaderProps> = ({ onBack }) => (
  <div className="bg-white">
    <div className="max-w-2xl mx-auto px-6 py-6">
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={onBack}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          aria-label="Go back"
        >
          <ChevronRight className="w-6 h-6 rotate-180" />
        </button>
        <h1 className="text-xl font-semibold">Clear Data</h1>
        <div className="w-10" aria-hidden="true" />
      </div>
    </div>
  </div>
);

// Component: Data Option Item
interface DataOptionItemProps {
  option: DataOption;
}

const DataOptionItem: FC<DataOptionItemProps> = ({ option }) => (
  <button
    onClick={option.action}
    className="w-full flex items-center justify-between px-6 py-5 hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0"
  >
    <div className="flex items-center gap-4">
      <div className={`w-10 h-10 ${option.iconBgColor} rounded-full flex items-center justify-center`}>
        <Trash2 className={`w-5 h-5 ${option.iconColor}`} />
      </div>
      <div className="flex flex-col items-start">
        <span className="font-medium text-gray-900">{option.title}</span>
        <span className="text-sm text-gray-500">{option.description}</span>
      </div>
    </div>
    <ChevronRight className="w-5 h-5 text-gray-400" />
  </button>
);

// Component: Info Banner
const InfoBanner: FC = () => (
  <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
    <div className="flex gap-3">
      <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
      <div>
        <h3 className="text-sm font-medium text-blue-900 mb-1">About Data Management</h3>
        <p className="text-sm text-blue-700">
          Clearing cache improves performance. Clearing history removes your browsing data permanently.
        </p>
      </div>
    </div>
  </div>
);

// Component: Confirmation Dialog
interface ConfirmDialogProps {
  config: ConfirmDialogConfig;
  onCancel: () => void;
}

const ConfirmDialog: FC<ConfirmDialogProps> = ({ config, onCancel }) => {
  const handleConfirm = (): void => {
    config.onConfirm();
    onCancel();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center px-6 z-50">
      <div className="bg-white rounded-2xl p-6 max-w-sm w-full">
        <h2 className="text-xl font-semibold text-gray-900 mb-2">{config.title}</h2>
        <p className="text-gray-600 mb-6">{config.description}</p>
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 px-4 py-2.5 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            className={`flex-1 px-4 py-2.5 text-white rounded-lg font-medium transition-colors ${config.confirmButtonClass}`}
          >
            {config.confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

// Main Component
const ClearData: FC = () => {
  const navigate = useNavigate();
  const [activeDialog, setActiveDialog] = useState<ConfirmDialogType>(null);

  const handleBack = (): void => {
    navigate('/profile');
  };

  const closeDialog = (): void => {
    setActiveDialog(null);
  };

  const dataOptions: DataOption[] = [
    {
      id: 'cache',
      title: 'Clear Cache',
      description: 'Free up storage space',
      iconBgColor: 'bg-orange-100',
      iconColor: 'text-orange-600',
      action: () => setActiveDialog('cache'),
    },
    {
      id: 'history',
      title: 'Clear History',
      description: 'Remove browsing history',
      iconBgColor: 'bg-red-100',
      iconColor: 'text-red-600',
      action: () => setActiveDialog('history'),
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <Header onBack={handleBack} />

      <div className="max-w-2xl mx-auto px-6 mt-4">
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden mb-4">
          {dataOptions.map((option) => (
            <DataOptionItem key={option.id} option={option} />
          ))}
        </div>

        <InfoBanner />
      </div>

      {activeDialog && (
        <ConfirmDialog config={DIALOG_CONFIGS[activeDialog]} onCancel={closeDialog} />
      )}
    </div>
  );
};

export default ClearData;