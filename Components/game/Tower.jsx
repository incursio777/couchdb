import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRef } from 'react';

// Mapeo de torres a sus enemigos objetivo
const towerTargets = {
  validator: 'syntax',
  replicator: 'netlag',
  compactor: 'overwriter',
  index: 'conflict',
  security: 'nullvalue'
};

// Breve descripción de cada tipo de torre
const towerDescriptions = {
  validator: 'Elimina errores de sintaxis rápidamente.',
  replicator: 'Ataca virus de red (Netlag).',
  compactor: 'Limpia datos sobreescritos (Overwriter).',
  index: 'Optimiza búsquedas, ideal contra conflictos.',
  security: 'Bloquea valores nulos (Nullvalue).'
};

export default function Tower({
  tower = {},
  cellSize = 32,
  enemies = [],
  onEnemyHit = () => {},
  onUpgrade = () => {},
  onRemove = () => {},
  isSelected = false,
  currentRound = 1
}) {
  const prevLevelRef = useRef(tower.level);
  const [showFireworks, setShowFireworks] = useState(false);
  const [target, setTarget] = useState(null);
  const [projectiles, setProjectiles] = useState([]);

  const towerColors = {
    validator: '#22c55e',
    replicator: '#3b82f6',
    compactor: '#f59e0b',
    index: '#eab308',
    security: '#a855f7'
  };

  const towerIcons = {
    validator: '🧰',
    replicator: '⚙️',
    compactor: '🧹',
    index: '🔍',
    security: '🔒'
  };

  // --- Lógica de ataque automático ---
  useEffect(() => {
    const attackSpeed = typeof tower.attackSpeed === 'number' ? tower.attackSpeed : 1000;
    const interval = setInterval(() => {
      if (!tower || !tower.canAttack) return;

      const targetType = towerTargets[tower.type];

      // Buscar enemigo en rango
      const inRange = (enemies || []).find(enemy => {
        if (!enemy || typeof enemy.health !== 'number' || enemy.health <= 0) return false;

        const canAttack =
          enemy.type === targetType ||
          (tower.level === 3 && enemy.level === 1) ||
          enemy.type === 'boss';

        if (!canAttack) return false;

        const ex = enemy.position?.x ?? 0;
        const ey = enemy.position?.y ?? 0;
        const tx = tower.x ?? 0;
        const ty = tower.y ?? 0;

        const dx = ex - tx;
        const dy = ey - ty;
        const distance = Math.sqrt(dx * dx + dy * dy);

        return distance <= (tower.range ?? 0);
      });

      if (inRange && inRange.health > 0) {
        setTarget(inRange);

        const projectile = {
          id: Date.now() + Math.random(),
          targetId: inRange.id,
          startX: tower.x ?? 0,
          startY: tower.y ?? 0,
          endX: inRange.position?.x ?? 0,
          endY: inRange.position?.y ?? 0
        };

        setProjectiles(prev => [...prev, projectile]);

        setTimeout(() => {
          onEnemyHit && onEnemyHit(inRange.id, tower.damage ?? 0);
          setProjectiles(prev => prev.filter(p => p.id !== projectile.id));
        }, 150);
      } else {
        setTarget(null);
      }
    }, attackSpeed);

    return () => clearInterval(interval);
  }, [enemies, tower, onEnemyHit]);

  // --- Detect level up to trigger fireworks ---
  useEffect(() => {
    const prev = prevLevelRef.current ?? tower.level;
    if (tower.level > prev) {
      setShowFireworks(true);
      const t = setTimeout(() => setShowFireworks(false), 900);
      prevLevelRef.current = tower.level;
      return () => clearTimeout(t);
    }
    prevLevelRef.current = tower.level;
  }, [tower.level]);

  // --- Posiciones y tamaños ---
  const cx = (tower.x ?? 0) * cellSize + cellSize / 2;
  const cy = (tower.y ?? 0) * cellSize + cellSize / 2;

  const ringSize = (tower.range ?? 0) * cellSize * 2;
  const towerSize = Math.max(28, cellSize * 0.6);
  const projSize = Math.max(6, cellSize * 0.12);

  let angleDeg = 0;
  if (target) {
    const tx = ((target.position && target.position.x) ?? target.x ?? 0) * cellSize + cellSize / 2;
    const ty = ((target.position && target.position.y) ?? target.y ?? 0) * cellSize + cellSize / 2;
    const dx = tx - cx;
    const dy = ty - cy;
    angleDeg = Math.atan2(dy, dx) * (180 / Math.PI);
  }

  // --- Render principal ---
  return (
    <>
      {/* Círculo de rango */}
      <AnimatePresence>
        {isSelected && (
          <motion.div
            className="pointer-events-none"
            style={{
              position: 'absolute',
              left: cx - ringSize / 2,
              top: cy - ringSize / 2,
              width: ringSize,
              height: ringSize,
              borderRadius: '50%',
              border: `2px solid ${towerColors[tower.type] ?? '#fff'}`,
              background: `${(towerColors[tower.type] ?? '#fff')}20`,
              zIndex: 4,
              transformOrigin: '50% 50%'
            }}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
          />
        )}
      </AnimatePresence>

      {/* Torre visual */}
      <motion.div
        className="pointer-events-auto" // ✅ permite clics
        style={{
          position: 'absolute',
          left: cx - towerSize / 2,
          top: cy - towerSize / 2,
          zIndex: 10
        }}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1, rotate: angleDeg }}
        transition={{ type: 'spring', stiffness: 260, damping: 20 }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: 8,
            border: '2px solid transparent',
            width: towerSize,
            height: towerSize,
            backgroundColor: towerColors[tower.type] ?? '#888',
            borderColor: towerColors[tower.type] ?? '#666',
            boxShadow: `0 0 20px ${(towerColors[tower.type] ?? '#888')}80`,
            position: 'relative'
          }}
        >
          <span style={{ fontSize: Math.max(16, cellSize * 0.28) }}>
            {towerIcons[tower.type] ?? '🔰'}
          </span>

          {/* Nivel */}
          <div
            style={{
              position: 'absolute',
              right: -8,
              top: -8,
              width: 22,
              height: 22,
              background: '#065f46', // verde más oscuro
              borderRadius: 11,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 12,
              fontWeight: 800,
              color: '#fff',
              border: '2px solid #000'
            }}
          >
            <span style={{
              lineHeight: 1,
              WebkitTextStroke: '1px #000',
              textShadow: '0 0 2px rgba(0,0,0,0.9)'
            }}>{tower.level}</span>
          </div>
        </div>
      </motion.div>

      {/* Proyectiles */}
      {projectiles.map(proj => {
        const dx = (proj.endX - proj.startX);
        const dy = (proj.endY - proj.startY);
        const angleDegProj = Math.atan2(dy, dx) * (180 / Math.PI);

        // Styles per tower type to make projectiles distintive
        const variant = {
          validator: { w: projSize, h: projSize, borderRadius: 4, content: null, bg: towerColors.validator },
          replicator: { w: projSize * 1.2, h: projSize * 1.2, borderRadius: projSize, content: '⚙️', bg: towerColors.replicator },
          compactor: { w: projSize * 2.2, h: projSize * 0.9, borderRadius: 3, content: null, bg: towerColors.compactor },
          index: { w: projSize * 1.6, h: projSize * 1.6, borderRadius: 999, content: '🔍', bg: towerColors.index },
          security: { w: projSize * 1.4, h: projSize * 1.4, borderRadius: 6, content: '🔒', bg: towerColors.security }
        }[tower.type] || { w: projSize, h: projSize, borderRadius: projSize, content: null, bg: towerColors[tower.type] };

        const left = (proj.startX + 0.5) * cellSize - variant.w / 2;
        const top = (proj.startY + 0.5) * cellSize - variant.h / 2;

        return (
          <motion.div
            key={proj.id}
            style={{
              position: 'absolute',
              left,
              top,
              width: variant.w,
              height: variant.h,
              borderRadius: variant.borderRadius,
              backgroundColor: variant.bg ?? '#fff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff',
              fontSize: Math.max(10, projSize * 0.9),
              boxShadow: `0 0 12px ${(variant.bg ?? '#fff')}80`,
              zIndex: 5,
              pointerEvents: 'none'
            }}
            animate={{
              x: (proj.endX - proj.startX) * cellSize,
              y: (proj.endY - proj.startY) * cellSize,
              rotate: angleDegProj
            }}
            transition={{ duration: 0.15, ease: 'linear' }}
          >
            {variant.content && <span style={{filter: 'drop-shadow(0 0 2px rgba(0,0,0,0.9))'}}>{variant.content}</span>}
          </motion.div>
        );
      })}

      {/* Panel de mejora y descripción */}
      <AnimatePresence>
        {isSelected && (
          <motion.div
            style={{
              position: 'absolute',
              left: cx + cellSize * 0.8,
              top: cy - cellSize * 1.2,
              background: 'rgba(0,0,0,0.8)',
              color: 'white',
              borderRadius: 8,
              padding: '8px 10px',
              zIndex: 50,
              width: 180,
              fontSize: 12,
              boxShadow: '0 0 10px #000',
              pointerEvents: 'auto' // ✅ necesario para clicks
            }}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.25 }}
          >
            <strong>{towerIcons[tower.type]} Torre {tower.type}</strong>
            <p style={{ margin: '6px 0' }}>{towerDescriptions[tower.type]}</p>

            {/* 🔼 BOTÓN DE MEJORA (sigue la regla de rondas: nivel1->2 en r >=8, nivel2->3 en r >=15) */}
            {(() => {
              const canUpgrade =
                tower.level < 3 &&
                !(tower.level === 1 && currentRound < 8) &&
                !(tower.level === 2 && currentRound < 15);

              return (
                <button
                  onClick={() => {
                    if (!tower || !canUpgrade) return;

                    const upgradedTower = {
                      ...tower,
                      level: tower.level + 1,
                      damage: Math.round(tower.damage * 1.4),
                      range: tower.range + 0.2,
                      attackSpeed: Math.max(200, tower.attackSpeed - 50),
                    };

                    console.log('Intentando mejorar torre:', upgradedTower); // 🧠 Debug

                    if (onUpgrade) onUpgrade(upgradedTower);
                  }}
                  style={{
                    background: canUpgrade ? '#3b82f6' : '#6b7280',
                    border: 'none',
                    borderRadius: 6,
                    color: 'white',
                    padding: '4px 8px',
                    cursor: canUpgrade ? 'pointer' : 'not-allowed',
                    width: '100%',
                    transition: '0.2s ease',
                  }}
                  disabled={!canUpgrade}
                  onMouseEnter={e => {
                    if (canUpgrade) e.target.style.background = '#2563eb';
                  }}
                  onMouseLeave={e => {
                    if (canUpgrade) e.target.style.background = '#3b82f6';
                  }}
                >
                  🔼 Mejorar torre
                </button>
              );
            })()}
            <div style={{height:8}} />
            <button
              onClick={() => {
                if (!tower) return;
                if (onRemove) onRemove(tower.id);
              }}
              style={{
                marginTop: 6,
                background: '#ef4444',
                border: 'none',
                borderRadius: 6,
                color: 'white',
                padding: '6px 8px',
                cursor: 'pointer',
                width: '100%'
              }}
            >
              Reubicar
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Fireworks on level up */}
      <AnimatePresence>
        {showFireworks && (
          <motion.div
            style={{position:'absolute', left: cx - 40, top: cy - 40, width: 80, height: 80, pointerEvents:'none', zIndex:60}}
            initial={{opacity:1}}
            animate={{opacity:1}}
            exit={{opacity:0}}
          >
            {Array.from({length:8}).map((_, i) => {
              const angle = (i / 8) * Math.PI * 2;
              const rx = Math.cos(angle) * (20 + Math.random() * 10);
              const ry = Math.sin(angle) * (20 + Math.random() * 10);
              const color = Object.values(towerColors)[i % Object.values(towerColors).length];
              return (
                <motion.div
                  key={i}
                  style={{
                    position:'absolute',
                    left: 40,
                    top: 40,
                    width:8,
                    height:8,
                    borderRadius:4,
                    background: color,
                    boxShadow: `0 0 8px ${color}80`
                  }}
                  initial={{x:0,y:0, scale:1, opacity:1}}
                  animate={{x: rx, y: ry, scale: 0.8, opacity: 0}}
                  transition={{duration: 0.8, ease: 'circOut'}}
                />
              )
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
