import React, { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';

export default function Enemy({ enemy, path, cellSize, onReachEnd }) {
  const [position, setPosition] = useState({ x: path[0].x, y: path[0].y });
  const [pathIndex, setPathIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const animationFrameRef = useRef(null);
  const lastUpdateRef = useRef(Date.now());
  const hasReachedEnd = useRef(false);

  const enemyIcons = {
    syntax: '🐞',
    conflict: '🔄',
    netlag: '🌐',
    overwriter: '⚠️',
    nullvalue: '💀',
    boss: '👾'
  };

  const enemyGlowColors = {
    syntax: '#10b981',
    conflict: '#f59e0b',
    netlag: '#3b82f6',
    overwriter: '#ef4444',
    nullvalue: '#8b5cf6',
    boss: '#dc2626'
  };

  // Movimiento del enemigo
  useEffect(() => {
    if (enemy.health <= 0 || hasReachedEnd.current) return;

    const animate = () => {
      const now = Date.now();
      const deltaTime = (now - lastUpdateRef.current) / 1000;
      lastUpdateRef.current = now;

      setProgress(prev => {
        const newProgress = prev + (enemy.speed * deltaTime);

        if (newProgress >= 1) {
          setPathIndex(current => {
            const next = current + 1;
            if (next >= path.length) {
              if (!hasReachedEnd.current) {
                hasReachedEnd.current = true;
                onReachEnd();
              }
              return current;
            }
            return next;
          });
          return 0;
        }

        return newProgress;
      });

      if (!hasReachedEnd.current) {
        animationFrameRef.current = requestAnimationFrame(animate);
      }
    };

    animationFrameRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [enemy.health, pathIndex]);

  // Actualizar posición del enemigo
  useEffect(() => {
    if (pathIndex < path.length - 1) {
      const current = path[pathIndex];
      const next = path[pathIndex + 1];

      const x = current.x + (next.x - current.x) * progress;
      const y = current.y + (next.y - current.y) * progress;

      enemy.position = { x, y };
      setPosition({ x, y });
    } else if (pathIndex < path.length) {
      const current = path[pathIndex];
      enemy.position = { x: current.x, y: current.y };
      setPosition({ x: current.x, y: current.y });
    }
  }, [progress, pathIndex, path]);

  if (enemy.health <= 0) return null;

  // Calcular posición centrada
  const x = (position.x + 0.5) * cellSize;
  const y = (position.y + 0.5) * cellSize;

  const healthPercent = (enemy.health / enemy.maxHealth) * 100;

  // Escala de tamaño (boss 30% más grande)
  const sizeMultiplier = enemy.type === 'boss' ? 1.3 : 1.0;

  return (
    <motion.div
      className="pointer-events-none"
      style={{
        position: 'absolute',
        left: x,
        top: y,
        transform: 'translate(-50%, -50%)',
        zIndex: 12
      }}
      initial={{ scale: 0 }}
      animate={{ scale: 0.85 * sizeMultiplier }}
      exit={{ scale: 0 }}
    >
      {/* Emoji del enemigo */}
      <div
        className="relative flex items-center justify-center"
        style={{
          fontSize: cellSize * 0.85 * sizeMultiplier,
          filter: `drop-shadow(0 0 ${cellSize * 0.25}px ${enemyGlowColors[enemy.type]}) drop-shadow(0 0 ${cellSize * 0.5}px ${enemyGlowColors[enemy.type]}80)`,
          textShadow: `0 0 ${cellSize * 0.15}px ${enemyGlowColors[enemy.type]}`,
          position: 'relative'
        }}
      >
        <span
          style={{
            fontSize: 'inherit',
            lineHeight: 1,
            display: 'block'
          }}
        >
          {enemyIcons[enemy.type]}
        </span>
      </div>

      {/* Barra de salud + nivel */}
      <div
        style={{
          position: 'absolute',
          bottom: -(cellSize * 0.25),
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          alignItems: 'center',
          gap: '4px'
        }}
      >
        {/* Nivel con estilo resaltado */}
        {enemy.level > 1 && (
          <div
            style={{
              backgroundColor: 'white',
              border: '2px solid red',
              borderRadius: '50%',
              width: 20,
              height: 20,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 12,
              fontWeight: 'bold',
              color: 'black',
              textShadow: '0 0 3px red',
              boxShadow: '0 0 8px red'
            }}
          >
            {enemy.level}
          </div>
        )}

        {/* Barra de vida */}
        <div
          style={{
            width: Math.max(28, cellSize * 0.75),
            height: Math.max(4, cellSize * 0.08),
            backgroundColor: 'rgba(0, 0, 0, 0.3)',
            borderRadius: 9999,
            overflow: 'hidden',
            border: `1px solid ${enemyGlowColors[enemy.type]}40`
          }}
        >
          <motion.div
            style={{
              height: '100%',
              backgroundColor: enemyGlowColors[enemy.type],
              width: `${healthPercent}%`,
              boxShadow: `0 0 5px ${enemyGlowColors[enemy.type]}`
            }}
            initial={{ width: '100%' }}
            animate={{ width: `${healthPercent}%` }}
            transition={{ duration: 0.2 }}
          />
        </div>
      </div>
    </motion.div>
  );
}
