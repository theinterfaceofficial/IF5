import { motion } from "motion/react";
import "./HeroSection.css";

export default function HeroSection() {
  const words = ["Plan.", "Interface.", "Succeed"];

  return (
    <div
      className="hero min-h-screen"
      style={{
        maskImage:
          "linear-gradient(to bottom, rgba(0,0,0,1) 70%, rgba(0,0,0,0))",
        WebkitMaskImage:
          "linear-gradient(to bottom, rgba(0,0,0,1) 70%, rgba(0,0,0,0))",
      }}
    >
      <div className="hero-content w-full min-h-screen md:justify-start justify-center">
        {words.map((word, index) => (
          <motion.span
            key={index}
            initial={{ opacity: 0, y: 20, filter: "blur(10px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{
              delay: index * 0.3 + 0.3,
              duration: 0.6,
              ease: "easeInOut",
            }}
            className="text-4xl font-bold text-primary"
          >
            {word}
          </motion.span>
        ))}
      </div>
    </div>
  );
}
