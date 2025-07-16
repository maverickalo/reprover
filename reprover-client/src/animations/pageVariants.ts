export const pageVariants = {
  initial: { 
    opacity: 0, 
    x: 40 
  },
  enter: { 
    opacity: 1, 
    x: 0,  
    transition: { 
      duration: 0.3, 
      ease: "easeOut" 
    } 
  },
  exit: { 
    opacity: 0, 
    x: -40, 
    transition: { 
      duration: 0.2, 
      ease: "easeIn" 
    } 
  }
};