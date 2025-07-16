export const staggerListVariants = {
  list: {
    show: { 
      transition: { 
        staggerChildren: 0.08, 
        delayChildren: 0.15 
      } 
    },
    hidden: {}
  },
  item: {
    hidden: { 
      opacity: 0, 
      y: 12 
    },
    show: { 
      opacity: 1, 
      y: 0, 
      transition: { 
        duration: 0.25 
      } 
    }
  }
};