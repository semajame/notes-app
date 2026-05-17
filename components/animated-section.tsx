"use client"

import { motion, MotionProps } from "framer-motion"
import { ReactNode } from "react"

interface AnimatedSectionProps extends MotionProps {
  children: ReactNode
  className?: string
}

const fadeUp = {
  hidden: { opacity: 0, y: 48 },
  visible: { opacity: 1, y: 0 },
}

export default function AnimatedSection({
  children,
  className,
  ...props
}: AnimatedSectionProps) {
  return (
    <motion.section
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      variants={fadeUp}
      {...props}
    >
      {children}
    </motion.section>
  )
}
