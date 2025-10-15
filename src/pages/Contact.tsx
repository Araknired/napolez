import React, { useState, useEffect } from 'react';
import type { ChangeEvent, FormEvent } from 'react';
import { FiMail, FiGithub, FiPhone, FiCheckCircle, FiXCircle, FiX } from 'react-icons/fi';
import emailjs from '@emailjs/browser';

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  message: string;
}

interface Toast {
  show: boolean;
  type: 'success' | 'error';
  message: string;
  title: string;
}

const ContactPage: React.FC = () => {
  const [isPageLoading, setIsPageLoading] = useState(true);
  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    email: '',
    message: ''
  });

  const [isLoading, setIsLoading] = useState(false);
  const [toast, setToast] = useState<Toast>({
    show: false,
    type: 'success',
    message: '',
    title: ''
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsPageLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  const showToast = (type: 'success' | 'error', title: string, message: string) => {
    setToast({ show: true, type, title, message });
    
    setTimeout(() => {
      setToast(prev => ({ ...prev, show: false }));
    }, 10000);
  };

  const closeToast = () => {
    setToast(prev => ({ ...prev, show: false }));
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.message) {
      showToast('error', 'Missing Information', 'Please fill in all fields before submitting.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      showToast('error', 'Invalid Email', 'Please enter a valid email address.');
      return;
    }

    setIsLoading(true);

    const templateParams = {
      from_name: formData.firstName,
      from_lastname: formData.lastName,
      from_email: formData.email,
      message: formData.message,
    };

    emailjs.send(
      'service_494g1rj',
      'template_4nfkstg',
      templateParams,
      '7xQSteLcqcPmnByqd'
    )
    .then((response) => {
      console.log('SUCCESS!', response.status, response.text);
      showToast(
        'success', 
        'Message Sent Successfully!', 
        'Thank you for reaching out! I will get back to you as soon as possible.'
      );
      
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        message: ''
      });
    })
    .catch((error) => {
      console.error('FAILED...', error);
      showToast(
        'error', 
        'Failed to Send Message', 
        'There was an error sending your message. Please try again or contact me directly at zentheriun@gmail.com'
      );
    })
    .finally(() => {
      setIsLoading(false);
    });
  };

  if (isPageLoading) {
    return (
      <div className="fixed inset-0 bg-gradient-to-br from-pink-50 via-gray-50 to-gray-100 flex items-center justify-center z-50">
        <div className="text-center">
          <div className="relative w-24 h-24 mx-auto mb-6">
            <div className="absolute inset-0 border-4 border-pink-200 rounded-full animate-ping"></div>
            <div className="absolute inset-0 border-4 border-t-red-600 border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin"></div>
            <div className="absolute inset-2 border-4 border-t-transparent border-r-pink-400 border-b-transparent border-l-transparent rounded-full animate-spin-slow"></div>
          </div>
          <p className="text-gray-600 font-semibold text-lg animate-pulse">Loading Contact Page...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-gray-50 to-gray-100 pt-0 lg:pt-20 pb-0 lg:pb-0">
      <div className="h-full lg:h-[calc(100vh-5rem)]">
        <div className="bg-white h-full shadow-2xl overflow-hidden relative rounded-t-3xl lg:rounded-none mx-0 lg:mx-0 mt-0 lg:my-0 animate-fadeInUp">
          
          <div className="absolute -top-40 -left-40 w-96 h-96 bg-pink-300 rounded-full opacity-20 blur-3xl animate-float"></div>
          <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-red-300 rounded-full opacity-20 blur-3xl animate-float-delayed"></div>
          <div className="absolute top-1/3 -right-40 w-96 h-96 bg-pink-200 rounded-full opacity-15 blur-3xl animate-float-slow"></div>
          <div className="absolute bottom-1/4 right-20 w-80 h-80 bg-purple-200 rounded-full opacity-10 blur-3xl animate-float"></div>
          
          <div className="grid lg:grid-cols-2 h-full relative">
            
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
                
                <div className="flex items-center space-x-3 sm:space-x-4 group hover:translate-x-2 transition-transform duration-300 animate-slideInLeft" style={{ animationDelay: '0.3s' }}>
                  <div className="w-11 h-11 sm:w-14 sm:h-14 bg-gradient-to-br from-red-500 to-red-700 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg shadow-red-500/50 group-hover:shadow-xl group-hover:shadow-red-500/60 transition-all">
                    <FiMail className="w-5 h-5 sm:w-7 sm:h-7 text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="text-gray-900 font-bold text-xs sm:text-base break-all">zentheriun@gmail.com</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3 sm:space-x-4 group hover:translate-x-2 transition-transform duration-300 animate-slideInLeft" style={{ animationDelay: '0.4s' }}>
                  <div className="w-11 h-11 sm:w-14 sm:h-14 bg-gradient-to-br from-green-500 to-green-700 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg shadow-green-500/50 group-hover:shadow-xl group-hover:shadow-green-500/60 transition-all">
                    <FiPhone className="w-5 h-5 sm:w-7 sm:h-7 text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="text-gray-900 font-bold text-xs sm:text-base">+573214174002</p>
                  </div>
                </div>

                <a 
                  href="https://github.com/zentheriun" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center space-x-3 sm:space-x-4 group hover:translate-x-2 transition-transform duration-300 animate-slideInLeft"
                  style={{ animationDelay: '0.5s' }}
                >
                  <div className="w-11 h-11 sm:w-14 sm:h-14 bg-gradient-to-br from-gray-800 to-black rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg shadow-gray-800/50 group-hover:shadow-xl group-hover:shadow-gray-800/60 transition-all">
                    <FiGithub className="w-5 h-5 sm:w-7 sm:h-7 text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="text-gray-900 font-bold text-xs sm:text-base">@zentheriun</p>
                  </div>
                </a>
              </div>

              <div className="mt-4 lg:mt-10 space-y-2 lg:space-y-4 relative z-20 max-w-md mx-auto lg:mx-0 animate-fadeIn" style={{ animationDelay: '0.6s' }}>
                <p className="text-gray-700 text-xs sm:text-base leading-relaxed">
                  Do you have a project in mind or need a hand to make it a reality? I'm here to help. I can support you at every stage of the development process — from planning and design to implementation and maintenance.
                </p>
                <p className="text-gray-700 text-xs sm:text-base leading-relaxed">
                  If you'd like to work with me or simply talk about your idea, feel free to reach out — I'd love to hear more about your project.
                </p>
              </div>
            </div>

            <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-4 sm:p-8 lg:p-12 xl:p-16 flex flex-col justify-center animate-slideInRight">
              <h2 className="text-2xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold text-gray-900 mb-4 sm:mb-8 lg:mb-10 animate-fadeIn" style={{ animationDelay: '0.2s' }}>Contact Us</h2>
            
              <form onSubmit={handleSubmit} className="space-y-2.5 lg:space-y-5">
                <div className="animate-slideInRight" style={{ animationDelay: '0.3s' }}>
                  <input
                    type="text"
                    name="firstName"
                    placeholder="First Name"
                    value={formData.firstName}
                    onChange={handleChange}
                    disabled={isLoading}
                    className="w-full px-4 sm:px-5 lg:px-6 py-2.5 sm:py-3.5 lg:py-4 text-sm sm:text-base bg-white border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all placeholder:text-gray-500 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                  />
                </div>

                <div className="animate-slideInRight" style={{ animationDelay: '0.4s' }}>
                  <input
                    type="text"
                    name="lastName"
                    placeholder="Last Name"
                    value={formData.lastName}
                    onChange={handleChange}
                    disabled={isLoading}
                    className="w-full px-4 sm:px-5 lg:px-6 py-2.5 sm:py-3.5 lg:py-4 text-sm sm:text-base bg-white border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all placeholder:text-gray-500 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                  />
                </div>

                <div className="animate-slideInRight" style={{ animationDelay: '0.5s' }}>
                  <input
                    type="email"
                    name="email"
                    placeholder="E-mail"
                    value={formData.email}
                    onChange={handleChange}
                    disabled={isLoading}
                    className="w-full px-4 sm:px-5 lg:px-6 py-2.5 sm:py-3.5 lg:py-4 text-sm sm:text-base bg-white border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all placeholder:text-gray-500 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                  />
                </div>

                <div className="animate-slideInRight" style={{ animationDelay: '0.6s' }}>
                  <textarea
                    name="message"
                    placeholder="Message"
                    value={formData.message}
                    onChange={handleChange}
                    disabled={isLoading}
                    rows={5}
                    className="w-full px-4 sm:px-5 lg:px-6 py-2.5 sm:py-3.5 lg:py-4 text-sm sm:text-base bg-white border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none transition-all placeholder:text-gray-500 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                  />
                </div>

                <div className="flex justify-end pt-2 sm:pt-4 animate-fadeIn" style={{ animationDelay: '0.7s' }}>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full sm:w-auto px-10 sm:px-12 lg:px-14 py-2.5 sm:py-3.5 lg:py-4 bg-gradient-to-r from-red-600 to-red-700 text-white font-bold text-sm sm:text-base tracking-wider rounded-xl hover:from-red-700 hover:to-red-800 transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:hover:shadow-xl"
                  >
                    {isLoading ? (
                      <span className="flex items-center justify-center gap-2">
                        <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
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
          </div>
        </div>
      </div>

      {toast.show && (
        <div 
          className="fixed inset-0 z-[9999] flex items-center justify-center p-4 animate-fadeIn"
          onClick={closeToast}
        >
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm"></div>

          <div 
            className="relative bg-white rounded-2xl shadow-2xl overflow-hidden max-w-md w-full animate-scaleIn"
            onClick={(e) => e.stopPropagation()}
          >
            <div className={`h-2 ${
              toast.type === 'success' 
                ? 'bg-gradient-to-r from-green-500 to-green-600' 
                : 'bg-gradient-to-r from-red-500 to-red-600'
            }`}></div>

            <div className="p-6 sm:p-8">
              <button
                onClick={closeToast}
                className="absolute top-4 right-4 w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center transition-colors group"
              >
                <FiX className="w-5 h-5 text-gray-400 group-hover:text-gray-600" />
              </button>

              <div className="flex justify-center mb-4">
                <div className={`w-16 h-16 rounded-full flex items-center justify-center ${
                  toast.type === 'success' 
                    ? 'bg-green-100' 
                    : 'bg-red-100'
                }`}>
                  {toast.type === 'success' ? (
                    <FiCheckCircle className="w-8 h-8 text-green-600" />
                  ) : (
                    <FiXCircle className="w-8 h-8 text-red-600" />
                  )}
                </div>
              </div>

              <div className="text-center">
                <h3 className={`font-bold text-xl mb-3 ${
                  toast.type === 'success' ? 'text-green-900' : 'text-red-900'
                }`}>
                  {toast.title}
                </h3>
                <p className="text-base text-gray-600 leading-relaxed">
                  {toast.message}
                </p>
              </div>

              <div className="mt-6 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                <div 
                  className={`h-full ${
                    toast.type === 'success' 
                      ? 'bg-gradient-to-r from-green-500 to-green-600' 
                      : 'bg-gradient-to-r from-red-500 to-red-600'
                  }`}
                  style={{
                    animation: 'progress 10s linear forwards'
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slideInLeft {
          from {
            opacity: 0;
            transform: translateX(-50px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes slideInRight {
          from {
            opacity: 0;
            transform: translateX(50px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: scale(0.8);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        @keyframes float {
          0%, 100% {
            transform: translateY(0) translateX(0);
          }
          50% {
            transform: translateY(-20px) translateX(10px);
          }
        }

        @keyframes progress {
          from {
            width: 100%;
          }
          to {
            width: 0%;
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out forwards;
        }

        .animate-fadeInUp {
          animation: fadeInUp 0.6s ease-out forwards;
        }

        .animate-slideInLeft {
          animation: slideInLeft 0.6s ease-out forwards;
          opacity: 0;
        }

        .animate-slideInRight {
          animation: slideInRight 0.6s ease-out forwards;
          opacity: 0;
        }

        .animate-scaleIn {
          animation: scaleIn 0.4s ease-out forwards;
        }

        .animate-float {
          animation: float 6s ease-in-out infinite;
        }

        .animate-float-delayed {
          animation: float 8s ease-in-out infinite;
          animation-delay: 1s;
        }

        .animate-float-slow {
          animation: float 10s ease-in-out infinite;
          animation-delay: 0.5s;
        }

        .animate-spin-slow {
          animation: spin 3s linear infinite;
        }

        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
};

export default ContactPage;