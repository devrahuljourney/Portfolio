"use client";

import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "motion/react";
import React, { useRef, useState, useEffect } from "react";

/**
 * Accent-colored beams that fall and burst on contact with the floor line.
 * Theme-aware (uses --color-accent) and rendered as an absolute fill layer.
 */
export function BackgroundBeams({ className }) {
  const containerRef = useRef(null);
  const parentRef = useRef(null);

  const beams = [
    { initialX: 60, translateX: 60, duration: 7, repeatDelay: 3, delay: 2, className: "h-14" },
    { initialX: 220, translateX: 220, duration: 6, repeatDelay: 4, delay: 3, className: "h-8" },
    { initialX: 420, translateX: 420, duration: 5, repeatDelay: 6, delay: 2, className: "h-12" },
    { initialX: 620, translateX: 620, duration: 8, repeatDelay: 3, delay: 4, className: "h-14" },
    { initialX: 840, translateX: 840, duration: 11, repeatDelay: 2, delay: 3, className: "h-20" },
    { initialX: 1120, translateX: 1120, duration: 10, repeatDelay: 5, delay: 0, className: "h-16" },
    { initialX: 1320, translateX: 1320, duration: 8, repeatDelay: 2, delay: 3, className: "h-10" },
    { initialX: 1420, translateX: 1320, duration: 8, repeatDelay: 2, delay: 3, className: "h-10" },
    { initialX: 1520, translateX: 1320, duration: 8, repeatDelay: 2, delay: 3, className: "h-10" },


  ];

  return (
    <div
      ref={parentRef}
      className={cn("absolute inset-0 overflow-hidden", className)}
    >
      {beams.map((beam) => (
        <CollisionMechanism
          key={beam.initialX + "beam-idx"}
          beamOptions={beam}
          containerRef={containerRef}
          parentRef={parentRef}
        />
      ))}
      <div ref={containerRef} className="absolute bottom-0 inset-x-0 h-px w-full bg-[color:var(--color-line)] pointer-events-none" />
    </div>
  );
}

const CollisionMechanism = React.forwardRef(({ parentRef, containerRef, beamOptions = {} }, ref) => {
  const beamRef = useRef(null);
  const [collision, setCollision] = useState({ detected: false, coordinates: null });
  const [beamKey, setBeamKey] = useState(0);
  const [cycleCollisionDetected, setCycleCollisionDetected] = useState(false);

  useEffect(() => {
    const checkCollision = () => {
      if (beamRef.current && containerRef.current && parentRef.current && !cycleCollisionDetected) {
        const beamRect = beamRef.current.getBoundingClientRect();
        const containerRect = containerRef.current.getBoundingClientRect();
        const parentRect = parentRef.current.getBoundingClientRect();
        if (beamRect.bottom >= containerRect.top) {
          const relativeX = beamRect.left - parentRect.left + beamRect.width / 2;
          const relativeY = beamRect.bottom - parentRect.top;
          setCollision({ detected: true, coordinates: { x: relativeX, y: relativeY } });
          setCycleCollisionDetected(true);
        }
      }
    };
    const interval = setInterval(checkCollision, 50);
    return () => clearInterval(interval);
  }, [cycleCollisionDetected, containerRef, parentRef]);

  useEffect(() => {
    if (collision.detected && collision.coordinates) {
      const t1 = setTimeout(() => {
        setCollision({ detected: false, coordinates: null });
        setCycleCollisionDetected(false);
      }, 2000);
      const t2 = setTimeout(() => setBeamKey((k) => k + 1), 2000);
      return () => {
        clearTimeout(t1);
        clearTimeout(t2);
      };
    }
  }, [collision]);

  return (
    <>
      <motion.div
        key={beamKey}
        ref={beamRef}
        animate="animate"
        initial={{
          translateY: beamOptions.initialY || "-200px",
          translateX: beamOptions.initialX || "0px",
          rotate: beamOptions.rotate || 0,
        }}
        variants={{
          animate: {
            translateY: beamOptions.translateY || "1800px",
            translateX: beamOptions.translateX || "0px",
            rotate: beamOptions.rotate || 0,
          },
        }}
        transition={{
          duration: beamOptions.duration || 8,
          repeat: Infinity,
          repeatType: "loop",
          ease: "linear",
          delay: beamOptions.delay || 0,
          repeatDelay: beamOptions.repeatDelay || 0,
        }}
        className={cn(
          "absolute left-0 top-20 m-auto h-14 w-px rounded-full opacity-50",
          "bg-gradient-to-t from-[color:var(--color-accent)] via-[color:var(--color-accent)]/40 to-transparent",
          beamOptions.className
        )}
      />
      <AnimatePresence>
        {collision.detected && collision.coordinates && (
          <Explosion
            key={`${collision.coordinates.x}-${collision.coordinates.y}`}
            style={{
              left: `${collision.coordinates.x}px`,
              top: `${collision.coordinates.y}px`,
              transform: "translate(-50%, -50%)",
            }}
          />
        )}
      </AnimatePresence>
    </>
  );
});
CollisionMechanism.displayName = "CollisionMechanism";

const Explosion = ({ ...props }) => {
  const spans = Array.from({ length: 18 }, (_, index) => ({
    id: index,
    directionX: Math.floor(Math.random() * 80 - 40),
    directionY: Math.floor(Math.random() * -50 - 10),
  }));

  return (
    <div {...props} className={cn("absolute z-20 h-2 w-2", props.className)}>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 1.5, ease: "easeOut" }}
        className="absolute -inset-x-10 top-0 m-auto h-2 w-10 rounded-full bg-gradient-to-r from-transparent via-[color:var(--color-accent)] to-transparent blur-sm"
      />
      {spans.map((span) => (
        <motion.span
          key={span.id}
          initial={{ x: 0, y: 0, opacity: 1 }}
          animate={{ x: span.directionX, y: span.directionY, opacity: 0 }}
          transition={{ duration: Math.random() * 1.5 + 0.5, ease: "easeOut" }}
          className="absolute h-1 w-1 rounded-full bg-[color:var(--color-accent)]"
        />
      ))}
    </div>
  );
};
