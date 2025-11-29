import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/solid';
import Header from '../Common/Header';
import Sidebar from './Sidebar';
import BottomBar from './BottomBar';
import bgPattern from '../../assets/bg-pattern.svg';

const LayoutWrapper = ({
  children,
  showBottomNav = true,
  prevLabel = '',
  nextLabel = '',
  prevPath = '',
  nextPath = '',
  prevState = null,
  nextState = null,
  requiresCompletion = false,
  onPrevClick,
  onNextClick,
  fixedBackground = false,
  showSidebar = true,
}) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isCompleted, setIsCompleted] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if(showSidebar === false) {
      setSidebarOpen(false);
    }
  }, [showSidebar, children]);

  useEffect(() => {
    const handleCompletion = (e) => {
      setIsCompleted(e.detail.isCompleted);
    };

    window.addEventListener('material-completed', handleCompletion);
    return () => window.removeEventListener('material-completed', handleCompletion);
  }, []);

  const handlePrev = () => {
    if (prevPath) {
      navigate(prevPath, prevState ?  { state: prevState } : {});
    } else if (onPrevClick) {
      onPrevClick();
    }
  };

  const handleNext = () => {
    if (requiresCompletion && ! isCompleted) {
      console.log('Selesaikan materi terlebih dahulu');
      return;
    }

    if (nextPath) {
      navigate(nextPath, nextState ? { state: nextState } : {});
    } else if (onNextClick) {
      onNextClick();
    }
  };

  return (
    <div className={`min-h-screen flex flex-col ${fixedBackground ? 'fixed' : 'relative' } overflow-x-hidden w-full`}>
      {/* Header (fixed on top) */}
      <div className="fixed w-full z-30">
        <Header />
      </div>

      {/* Pattern wrapper -> covers the boxed area (content + sidebar) */}
      <div className={`pattern-container relative w-full ${fixedBackground ? 'right-[10px]' : 'right-0'} pt-[64px] lg:pt-[64px]`}>
        {/* Use single full image (no-repeat) for the boxed area */}
        <div
          className={`pattern-bg fixed inset-0 -z-10 pointer-events-none`}
          aria-hidden="true"
          style={{
            backgroundImage: `url(${bgPattern})`,
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'center top',
            backgroundSize: 'cover',
            opacity: 1
          }}
        />

        {/* Content Row (main + sidebar) */}
        <div className="flex flex-1 w-full">
          {/* Main Content */}
          <main
            className={`flex-1 pt-8 pb-20 w-full transition-all duration-300 flex justify-center relative z-10 ${
              sidebarOpen ? 'lg:pr-[320px]' : ''
            }`}
          >
            <div className={`w-full px-6 ${sidebarOpen ? 'max-w-4xl' : 'max-w-5xl'}`}>
              {/* content-box: solid white card (no pattern visible inside) */}
              <div className="content-box">
                {React.cloneElement(children, {
                  onCompletion: (completed) => setIsCompleted(completed)
                })}
              </div>
            </div>
          </main>

          {/* Sidebar - Desktop Only */}
          {showSidebar && 
            <div className={`hidden lg:block fixed ${fixedBackground ? 'right-[10px]' : 'right-0'} top-16 h-full z-20`}>
            <Sidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />
          </div>
          }
        </div>
      </div>

      {/* Mobile Sidebar Toggle */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="lg:hidden fixed bottom-[80px] right-5 z-40 w-14 h-14 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg flex items-center justify-center transition"
        aria-label="Toggle Sidebar Mobile"
      >
        {sidebarOpen ? <XMarkIcon className="w-7 h-7" /> : <Bars3Icon className="w-7 h-7" />}
      </button>

      {/* Mobile Sidebar Sheet */}
      {sidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-30 bg-black/50 flex items-end">
          <div className="w-full bg-white rounded-t-3xl p-6 max-h-[70vh] overflow-y-auto">
            <div className="flex justify-end mb-4">
              <button
                onClick={() => setSidebarOpen(false)}
                className="w-10 h-10 rounded-full bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center"
              >
                <XMarkIcon className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Bottom Navigation */}
      {showBottomNav && (
        <BottomBar
          prevLabel={prevLabel}
          nextLabel={nextLabel}
          onPrev={handlePrev}
          onNext={handleNext}
          nextDisabled={requiresCompletion && !isCompleted}
        />
      )}
    </div>
  );
};

export default LayoutWrapper;