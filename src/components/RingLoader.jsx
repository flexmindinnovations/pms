import { forwardRef } from 'react';
import { motion } from 'framer-motion';

const RingLoader = forwardRef(({ style, ...others }, ref) => {
    const outerCircleVariants = {
        animate: {
            r: [6, 22], // Expand from 6 to 22
            strokeOpacity: [1, 0], // Fade out
            strokeWidth: [2, 0], // Reduce stroke width
        },
        initial: {
            r: 6, // Ensure a valid initial radius
            strokeOpacity: 1,
            strokeWidth: 2,
        },
    };

    const middleCircleVariants = {
        animate: {
            r: [6, 22],
            strokeOpacity: [1, 0],
            strokeWidth: [2, 0],
        },
        initial: {
            r: 6, // Ensure a valid initial radius
            strokeOpacity: 1,
            strokeWidth: 2,
        },
    };

    const innerCircleVariants = {
        animate: {
            r: [6, 1, 2, 3, 4, 5, 6], // Pulsate
        },
        initial: {
            r: 6, // Ensure a valid initial radius
        },
    };

    const transition = {
        duration: 3,
        repeat: Infinity,
        ease: 'easeInOut',
    };

    return (
        <motion.svg
            {...others}
            ref={ref}
            style={{
                width: '100px',
                height: '100px',
                stroke: 'var(--loader-color)',
                ...style,
            }}
            viewBox="0 0 45 45"
            xmlns="http://www.w3.org/2000/svg"
        >
            <motion.g
                fill="none"
                fillRule="evenodd"
                transform="translate(1 1)"
                strokeWidth="2"
            >
                {/* Outer Circle */}
                <motion.circle
                    cx="22"
                    cy="22"
                    variants={outerCircleVariants}
                    animate="animate"
                    initial="initial"  // Set initial state
                    transition={transition}
                />

                {/* Middle Circle */}
                <motion.circle
                    cx="22"
                    cy="22"
                    variants={middleCircleVariants}
                    animate="animate"
                    initial="initial"  // Set initial state
                    transition={{
                        ...transition,
                        delay: 1.5, // Delay for staggered animation
                    }}
                />

                {/* Inner Circle */}
                <motion.circle
                    cx="22"
                    cy="22"
                    variants={innerCircleVariants}
                    animate="animate"
                    initial="initial"  // Set initial state
                    transition={{
                        duration: 1.5,
                        repeat: Infinity,
                        ease: 'linear',
                    }}
                />
            </motion.g>
        </motion.svg>
    );
});

export default RingLoader;
