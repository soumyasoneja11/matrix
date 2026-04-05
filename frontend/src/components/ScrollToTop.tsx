import { useState, useEffect } from 'react';
import { FaArrowUp } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

const ScrollToTop = () => {
  const [isVisible, setIsVisible] = useState(false);

  // Consider the main scrollable container in layout
  useEffect(() => {
    const mainContainer = document.getElementById('main-scroll-container');
    
    // In case no specific container, fallback to window, but MainLayout has specific overflow container.
    const toggleVisibility = () => {
      if (mainContainer) {
        if (mainContainer.scrollTop > 200) {
          setIsVisible(true);
        } else {
          setIsVisible(false);
        }
      } else {
        if (window.scrollY > 200) {
          setIsVisible(true);
        } else {
          setIsVisible(false);
        }
      }
    };

    if (mainContainer) {
      mainContainer.addEventListener('scroll', toggleVisibility);
    } else {
      window.addEventListener('scroll', toggleVisibility);
    }

    return () => {
      if (mainContainer) {
        mainContainer.removeEventListener('scroll', toggleVisibility);
      } else {
        window.removeEventListener('scroll', toggleVisibility);
      }
    };
  }, []);

  const scrollToTop = () => {
    const mainContainer = document.getElementById('main-scroll-container');
    if (mainContainer) {
      mainContainer.scrollTo({
        top: 0,
        behavior: 'smooth',
      });
    } else {
      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      });
    }
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.button
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 20 }}
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 z-50 p-3 rounded-full bg-[#247B7B] text-white shadow-md transition-colors duration-200 hover:bg-[#1a5f5f] hover:scale-105"
          aria-label="Scroll to top"
        >
          <FaArrowUp />
        </motion.button>
      )}
    </AnimatePresence>
  );
};

export default ScrollToTop;
