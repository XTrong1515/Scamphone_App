import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ShoppingCart } from "lucide-react";

interface AnimationDot {
  id: string;
  startX: number;
  startY: number;
  endX: number;
  endY: number;
}

interface AddToCartAnimationProps {
  trigger: boolean;
  onComplete: () => void;
  buttonRef?: React.RefObject<HTMLElement | null>;
}

export function AddToCartAnimation({ trigger, onComplete, buttonRef }: AddToCartAnimationProps) {
  const [animationDot, setAnimationDot] = useState<AnimationDot | null>(null);

  useEffect(() => {
    if (trigger && buttonRef?.current) {
      // Get button position
      const buttonRect = buttonRef.current.getBoundingClientRect();
      
      // Get cart icon position (approximate - you can make this more precise)
      const cartIcon = document.querySelector('[data-cart-icon]');
      let endX = window.innerWidth - 100; // Default position
      let endY = 80; // Default position
      
      if (cartIcon) {
        const cartRect = cartIcon.getBoundingClientRect();
        endX = cartRect.left + cartRect.width / 2;
        endY = cartRect.top + cartRect.height / 2;
      }

      const dot: AnimationDot = {
        id: Date.now().toString(),
        startX: buttonRect.left + buttonRect.width / 2,
        startY: buttonRect.top + buttonRect.height / 2,
        endX: endX,
        endY: endY,
      };

      setAnimationDot(dot);

      // Clear animation after completion
      setTimeout(() => {
        setAnimationDot(null);
        onComplete();
      }, 800);
    }
  }, [trigger, buttonRef, onComplete]);

  return (
    <AnimatePresence>
      {animationDot && (
        <motion.div
          key={animationDot.id}
          className="fixed top-0 left-0 pointer-events-none z-50"
          initial={{
            x: animationDot.startX,
            y: animationDot.startY,
            scale: 1,
            opacity: 1,
          }}
          animate={{
            x: animationDot.endX,
            y: animationDot.endY,
            scale: 0.3,
            opacity: 0.8,
          }}
          exit={{
            scale: 0,
            opacity: 0,
          }}
          transition={{
            duration: 0.8,
            ease: [0.23, 1, 0.32, 1], // Custom easing for smooth arc
            scale: {
              duration: 0.3,
              delay: 0.5,
            },
            opacity: {
              duration: 0.2,
              delay: 0.6,
            },
          }}
        >
          <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center shadow-lg">
            <ShoppingCart className="w-4 h-4 text-white" />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}