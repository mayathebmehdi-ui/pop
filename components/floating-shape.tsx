'use client'

import { motion } from 'framer-motion'

export function FloatingShape() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <motion.div
        animate={{
          y: [0, -20, 0],
          rotate: [0, 5, 0],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className="absolute top-1/4 right-1/4 w-64 h-64 opacity-20"
      >
        <svg
          viewBox="0 0 200 200"
          className="w-full h-full"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="rgb(99, 102, 241)" stopOpacity="0.3" />
              <stop offset="100%" stopColor="rgb(139, 92, 246)" stopOpacity="0.1" />
            </linearGradient>
          </defs>
          <path
            fill="url(#gradient1)"
            d="M40.7,-47.3C54.2,-37.6,67.5,-25.2,71.6,-9.8C75.7,5.6,70.6,24,59.9,37.4C49.2,50.8,32.9,59.2,15.3,61.8C-2.3,64.4,-21.2,61.2,-36.9,52.4C-52.6,43.6,-65.1,29.2,-69.8,12.1C-74.5,-5,-71.4,-24.8,-62.1,-37.2C-52.8,-49.6,-37.3,-54.6,-21.8,-61.8C-6.3,-69,7.2,-78.4,19.9,-78.9C32.6,-79.4,44.5,-70.9,54.2,-58.8C63.9,-46.7,71.4,-31,73.3,-14.7C75.2,1.6,71.5,18.5,63.1,31.8C54.7,45.1,41.6,54.8,27.2,59.2C12.8,63.6,-2.9,62.7,-18.5,57.4C-34.1,52.1,-49.6,42.4,-59.6,28.5C-69.6,14.6,-74.1,-3.5,-72.9,-21.4C-71.7,-39.3,-64.8,-57,-52.8,-67.3C-40.8,-77.6,-23.7,-80.5,-7.8,-80.1C8.1,-79.7,25,-76,40.7,-47.3Z"
            transform="translate(100 100)"
          />
        </svg>
      </motion.div>

      <motion.div
        animate={{
          y: [0, 15, 0],
          rotate: [0, -3, 0],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: 1,
        }}
        className="absolute bottom-1/4 left-1/4 w-48 h-48 opacity-15"
      >
        <svg
          viewBox="0 0 200 200"
          className="w-full h-full"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="gradient2" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="rgb(59, 130, 246)" stopOpacity="0.4" />
              <stop offset="100%" stopColor="rgb(99, 102, 241)" stopOpacity="0.1" />
            </linearGradient>
          </defs>
          <path
            fill="url(#gradient2)"
            d="M44.9,-52.8C58.7,-41.9,70.6,-26.8,75.2,-9.1C79.8,8.6,77.1,28.9,68.6,44.8C60.1,60.7,45.8,72.2,28.9,76.8C12,81.4,-7.5,79.1,-24.8,71.8C-42.1,64.5,-57.2,52.2,-65.7,36.1C-74.2,20,-76.1,0.1,-72.8,-17.7C-69.5,-35.5,-61,-51.2,-48.2,-62.4C-35.4,-73.6,-18.3,-80.3,-0.2,-80.1C17.9,-79.9,35.8,-72.8,44.9,-52.8Z"
            transform="translate(100 100)"
          />
        </svg>
      </motion.div>
    </div>
  )
}

