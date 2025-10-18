import { useState, useEffect } from 'react';
import { FiMail, FiGithub, FiPhone, FiCheckCircle, FiXCircle, FiX } from 'react-icons/fi';
import emailjs from '@emailjs/browser';
import type { ChangeEvent, FormEvent, FC } from 'react';

// Types
interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  message: string;
}

type ToastType = 'success' | 'error';

interface Toast {
  show: boolean;
  type: ToastType;
  message: string;
  title: string;
}

interface ContactInfo {
  icon: FC<{ className?: string }>;
  label: string;
  value: string;
  bgGradient: string;
  shadowColor: string;
  href?: string;
  delay: string;
}

// Constants
const INITIAL_FORM_DATA: FormData = {
  firstName: '',
  lastName: '',
  email: '',
  message: '',
};

const TOAST_DURATION = 10000;
const PAGE_LOAD_DELAY = 800;

const EMAIL_CONFIG = {
  serviceId: 'service_494g1rj',
  templateId: 'template_4nfkstg',
  publicKey: '7xQSteLcqcPmnByqd',
} as const;

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const CONTACT_INFO: ContactInfo[] = [
  {
    icon: FiMail,
    label: 'Email',
    value: 'zentheriun@gmail.com',
    bgGradient: 'from-red-500 to-red-700',
    shadowColor: 'shadow-red-500/50 group-hover:shadow-red-500/60',
    delay: '0.3s',
  },
  {
    icon: FiPhone,
    label: 'Phone',
    value: '+573214174002',
    bgGradient: 'from-green-500 to-green-700',
    shadowColor: 'shadow-green-500/50 group-hover:shadow-green-500/60',
    delay: '0.4s',
  },
  {
    icon: FiGithub,
    label: 'GitHub',
    value: '@zentheriun',
    href: 'https://github.com/zentheriun',
    bgGradient: 'from-gray-800 to-black',
    shadowColor: 'shadow-gray-800/50 group-hover:shadow-gray-800/60',
    delay: '0.5s',
  },
];

// Utility Functions
const validateEmail = (email: string): boolean => EMAIL_REGEX.test(email);

const validateFormData = (data: FormData): { isValid: boolean; error?: string } => {
  if (!data.firstName || !data.lastName || !data.email || !data.message) {
    return { isValid: false, error: 'Please fill in all fields before submitting.' };
  }

  if (!validateEmail(data.email)) {
    return { isValid: false, error: 'Please enter a valid email address.' };
  }

  return { isValid: true };
};

// Custom Hook: Toast Management
const useToast = () => {
  const [toast, setToast] = useState<Toast>({
    show: false,
    type: 'success',
    message: '',
    title: '',
  });

  const showToast = (type: ToastType, title: string, message: string): void => {
    setToast({ show: true, type, title, message });

    setTimeout(() => {
      setToast((prev) => ({ ...prev, show: false }));
    }, TOAST_DURATION);
  };

  const closeToast = (): void => {
    setToast((prev) => ({ ...prev, show: false }));
  };

  return { toast, showToast, closeToast };
};

// Custom Hook: Form Management
const useContactForm = (onSuccess: () => void, onError: (error: string) => void) => {
  const [formData, setFormData] = useState<FormData>(INITIAL_FORM_DATA);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const resetForm = (): void => {
    setFormData(INITIAL_FORM_DATA);
  };

  const handleSubmit = async (e: FormEvent): Promise<void> => {
    e.preventDefault();

    const validation = validateFormData(formData);
    if (!validation.isValid) {
      onError(validation.error!);
      return;
    }

    setIsLoading(true);

    const templateParams = {
      from_name: formData.firstName,
      from_lastname: formData.lastName,
      from_email: formData.email,
      message: formData.message,
    };

    try {
      const response = await emailjs.send(
        EMAIL_CONFIG.serviceId,
        EMAIL_CONFIG.templateId,
        templateParams,
        EMAIL_CONFIG.publicKey
      );

      console.log('Email sent successfully:', response.status, response.text);
      onSuccess();
      resetForm();
    } catch (error) {
      console.error('Email sending failed:', error);
      onError('There was an error sending your message. Please try again or contact me directly at zentheriun@gmail.com');
    } finally {
      setIsLoading(false);
    }
  };

  return { formData, isLoading, handleChange, handleSubmit };
};

// Component: Loading Spinner
const LoadingSpinner: FC = () => (
  <div className="fixed inset-0 bg-gradient-to-br from-pink-50 via-gray-50 to-gray-100 flex items-center justify-center z-50">
    <div className="text-center">
      <div className="relative w-24 h-24 mx-auto mb-6">
        <div className="absolute inset-0 border-4 border-pink-200 rounded-full animate-ping" />
        <div className="absolute inset-0 border-4 border-t-red-600 border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin" />
        <div className="absolute inset-2 border-4 border-t-transparent border-r-pink-400 border-b-transparent border-l-transparent rounded-full animate-spin-slow" />
      </div>
      <p className="text-gray-600 font-semibold text-lg animate-pulse">Loading Contact Page...</p>
    </div>
  </div>
);

// Component: Contact Info Item
interface ContactInfoItemProps {
  info: ContactInfo;
}

const ContactInfoItem: FC<ContactInfoItemProps> = ({ info }) => {
  const Icon = info.icon;
  const Component = info.href ? 'a' : 'div';
  const linkProps = info.href
    ? { href: info.href, target: '_blank', rel: 'noopener noreferrer' }
    : {};

  return (
    <Component
      {...linkProps}
      className="flex items-center space-x-3 sm:space-x-4 group hover:translate-x-2 transition-transform duration-300 animate-slideInLeft"
      style={{ animationDelay: info.delay }}
    >
      <div
        className={`w-11 h-11 sm:w-14 sm:h-14 bg-gradient-to-br ${info.bgGradient} rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg ${info.shadowColor} transition-all`}
      >
        <Icon className="w-5 h-5 sm:w-7 sm:h-7 text-white" />
      </div>
      <div className="flex-1">
        <p className="text-gray-900 font-bold text-xs sm:text-base break-all">{info.value}</p>
      </div>
    </Component>
  );
};

// Component: Contact Info Section
const ContactInfoSection: FC = () => (
  <div className="relative p-4 sm:p-8 lg:p-12 xl:p-16 flex flex-col justify-center animate-slideInLeft">
    <div className="relative w-full mb-4 lg:mb-10 animate-scaleIn" style={{ animationDelay: '0.2s' }}>
      <div className="relative w-48 h-48 sm:w-52 sm:h-52 md:w-56 md:h-56 lg:w-72 lg:h-72 xl:w-80 xl:h-80 mx-auto">
        <img
          src="/src/assets/images/contact/buzon.png"
          alt="Contact Mailbox"
          className="w-full h-full object-contain transition-all duration-300 hover:drop-shadow-[0_20px_40px_rgba(239,68,68,0.5)]"
        />
      </div>
    </div>

    <div className="space-y-2 lg:space-y-5 relative z-20 max-w-md mx-auto lg:mx-0 w-full">
      {CONTACT_INFO.map((info) => (
        <ContactInfoItem key={info.label} info={info} />
      ))}
    </div>

    <div
      className="mt-4 lg:mt-10 space-y-2 lg:space-y-4 relative z-20 max-w-md mx-auto lg:mx-0 animate-fadeIn"
      style={{ animationDelay: '0.6s' }}
    >
      <p className="text-gray-700 text-xs sm:text-base leading-relaxed">
        Do you have a project in mind or need a hand to make it a reality? I'm here to help. I can support you at every
        stage of the development process – from planning and design to implementation and maintenance.
      </p>
      <p className="text-gray-700 text-xs sm:text-base leading-relaxed">
        If you'd like to work with me or simply talk about your idea, feel free to reach out – I'd love to hear more
        about your project.
      </p>
    </div>
  </div>
);

// Component: Form Input
interface FormInputProps {
  name: string;
  type: string;
  placeholder: string;
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  disabled: boolean;
  delay: string;
  rows?: number;
}

const FormInput: FC<FormInputProps> = ({ name, type, placeholder, value, onChange, disabled, delay, rows }) => {
  const baseClasses =
    'w-full px-4 sm:px-5 lg:px-6 py-2.5 sm:py-3.5 lg:py-4 text-sm sm:text-base bg-white border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all placeholder:text-gray-500 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed';

  return (
    <div className="animate-slideInRight" style={{ animationDelay: delay }}>
      {rows ? (
        <textarea
          name={name}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          disabled={disabled}
          rows={rows}
          className={`${baseClasses} resize-none`}
        />
      ) : (
        <input
          type={type}
          name={name}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          disabled={disabled}
          className={baseClasses}
        />
      )}
    </div>
  );
};

// Component: Contact Form Section
interface ContactFormSectionProps {
  formData: FormData;
  isLoading: boolean;
  onSubmit: (e: FormEvent) => void;
  onChange: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

const ContactFormSection: FC<ContactFormSectionProps> = ({ formData, isLoading, onSubmit, onChange }) => (
  <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-4 sm:p-8 lg:p-12 xl:p-16 flex flex-col justify-center animate-slideInRight">
    <h2
      className="text-2xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold text-gray-900 mb-4 sm:mb-8 lg:mb-10 animate-fadeIn"
      style={{ animationDelay: '0.2s' }}
    >
      Contact Us
    </h2>

    <form onSubmit={onSubmit} className="space-y-2.5 lg:space-y-5">
      <FormInput
        name="firstName"
        type="text"
        placeholder="First Name"
        value={formData.firstName}
        onChange={onChange}
        disabled={isLoading}
        delay="0.3s"
      />

      <FormInput
        name="lastName"
        type="text"
        placeholder="Last Name"
        value={formData.lastName}
        onChange={onChange}
        disabled={isLoading}
        delay="0.4s"
      />

      <FormInput
        name="email"
        type="email"
        placeholder="E-mail"
        value={formData.email}
        onChange={onChange}
        disabled={isLoading}
        delay="0.5s"
      />

      <FormInput
        name="message"
        type="text"
        placeholder="Message"
        value={formData.message}
        onChange={onChange}
        disabled={isLoading}
        delay="0.6s"
        rows={5}
      />

      <div className="flex justify-end pt-2 sm:pt-4 animate-fadeIn" style={{ animationDelay: '0.7s' }}>
        <button
          type="submit"
          disabled={isLoading}
          className="w-full sm:w-auto px-10 sm:px-12 lg:px-14 py-2.5 sm:py-3.5 lg:py-4 bg-gradient-to-r from-red-600 to-red-700 text-white font-bold text-sm sm:text-base tracking-wider rounded-xl hover:from-red-700 hover:to-red-800 transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:hover:shadow-xl"
        >
          {isLoading ? (
            <span className="flex items-center justify-center gap-2">
              <svg
                className="animate-spin h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              SENDING...
            </span>
          ) : (
            'SUBMIT'
          )}
        </button>
      </div>
    </form>
  </div>
);

// Component: Toast Notification
interface ToastNotificationProps {
  toast: Toast;
  onClose: () => void;
}

const ToastNotification: FC<ToastNotificationProps> = ({ toast, onClose }) => {
  const isSuccess = toast.type === 'success';
  const gradientColor = isSuccess ? 'from-green-500 to-green-600' : 'from-red-500 to-red-600';
  const bgColor = isSuccess ? 'bg-green-100' : 'bg-red-100';
  const textColor = isSuccess ? 'text-green-900' : 'text-red-900';
  const iconColor = isSuccess ? 'text-green-600' : 'text-red-600';

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 animate-fadeIn" onClick={onClose}>
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />

      <div
        className="relative bg-white rounded-2xl shadow-2xl overflow-hidden max-w-md w-full animate-scaleIn"
        onClick={(e) => e.stopPropagation()}
      >
        <div className={`h-2 bg-gradient-to-r ${gradientColor}`} />

        <div className="p-6 sm:p-8">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center transition-colors group"
            aria-label="Close notification"
          >
            <FiX className="w-5 h-5 text-gray-400 group-hover:text-gray-600" />
          </button>

          <div className="flex justify-center mb-4">
            <div className={`w-16 h-16 rounded-full flex items-center justify-center ${bgColor}`}>
              {isSuccess ? (
                <FiCheckCircle className={`w-8 h-8 ${iconColor}`} />
              ) : (
                <FiXCircle className={`w-8 h-8 ${iconColor}`} />
              )}
            </div>
          </div>

          <div className="text-center">
            <h3 className={`font-bold text-xl mb-3 ${textColor}`}>{toast.title}</h3>
            <p className="text-base text-gray-600 leading-relaxed">{toast.message}</p>
          </div>

          <div className="mt-6 h-1.5 bg-gray-100 rounded-full overflow-hidden">
            <div
              className={`h-full bg-gradient-to-r ${gradientColor}`}
              style={{ animation: 'progress 10s linear forwards' }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

// Component: Background Decorations
const BackgroundDecorations: FC = () => (
  <>
    <div className="absolute -top-40 -left-40 w-96 h-96 bg-pink-300 rounded-full opacity-20 blur-3xl animate-float" />
    <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-red-300 rounded-full opacity-20 blur-3xl animate-float-delayed" />
    <div className="absolute top-1/3 -right-40 w-96 h-96 bg-pink-200 rounded-full opacity-15 blur-3xl animate-float-slow" />
    <div className="absolute bottom-1/4 right-20 w-80 h-80 bg-purple-200 rounded-full opacity-10 blur-3xl animate-float" />
  </>
);

// Main Component
const ContactPage: FC = () => {
  const [isPageLoading, setIsPageLoading] = useState(true);
  const { toast, showToast, closeToast } = useToast();

  const handleSuccess = (): void => {
    showToast('success', 'Message Sent Successfully!', 'Thank you for reaching out! I will get back to you as soon as possible.');
  };

  const handleError = (message: string): void => {
    const title = message.includes('fill in all fields') ? 'Missing Information' : 'Invalid Email';
    showToast('error', title, message);
  };

  const { formData, isLoading, handleChange, handleSubmit } = useContactForm(handleSuccess, handleError);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsPageLoading(false);
    }, PAGE_LOAD_DELAY);

    return () => clearTimeout(timer);
  }, []);

  if (isPageLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-gray-50 to-gray-100 pt-0 lg:pt-20 pb-0 lg:pb-0">
      <div className="h-full lg:h-[calc(100vh-5rem)]">
        <div className="bg-white h-full shadow-2xl overflow-hidden relative rounded-t-3xl lg:rounded-none mx-0 lg:mx-0 mt-0 lg:my-0 animate-fadeInUp">
          <BackgroundDecorations />

          <div className="grid lg:grid-cols-2 h-full relative">
            <ContactInfoSection />
            <ContactFormSection
              formData={formData}
              isLoading={isLoading}
              onSubmit={handleSubmit}
              onChange={handleChange}
            />
          </div>
        </div>
      </div>

      {toast.show && <ToastNotification toast={toast} onClose={closeToast} />}

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes slideInLeft {
          from { opacity: 0; transform: translateX(-50px); }
          to { opacity: 1; transform: translateX(0); }
        }

        @keyframes slideInRight {
          from { opacity: 0; transform: translateX(50px); }
          to { opacity: 1; transform: translateX(0); }
        }

        @keyframes scaleIn {
          from { opacity: 0; transform: scale(0.8); }
          to { opacity: 1; transform: scale(1); }
        }

        @keyframes float {
          0%, 100% { transform: translateY(0) translateX(0); }
          50% { transform: translateY(-20px) translateX(10px); }
        }

        @keyframes progress {
          from { width: 100%; }
          to { width: 0%; }
        }

        .animate-fadeIn { animation: fadeIn 0.5s ease-out forwards; }
        .animate-fadeInUp { animation: fadeInUp 0.6s ease-out forwards; }
        .animate-slideInLeft { animation: slideInLeft 0.6s ease-out forwards; opacity: 0; }
        .animate-slideInRight { animation: slideInRight 0.6s ease-out forwards; opacity: 0; }
        .animate-scaleIn { animation: scaleIn 0.4s ease-out forwards; }
        .animate-float { animation: float 6s ease-in-out infinite; }
        .animate-float-delayed { animation: float 8s ease-in-out infinite; animation-delay: 1s; }
        .animate-float-slow { animation: float 10s ease-in-out infinite; animation-delay: 0.5s; }
        .animate-spin-slow { animation: spin 3s linear infinite; }

        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default ContactPage;