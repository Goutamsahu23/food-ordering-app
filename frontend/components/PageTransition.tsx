// frontend/components/PageTransition.tsx
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/router";

export default function PageTransition({ children }: { children: React.ReactNode }) {
  const { asPath } = useRouter();

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={asPath}
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -15 }}
        transition={{ duration: 0.4, ease: "easeInOut" }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
