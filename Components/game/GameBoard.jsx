import React, { useEffect, useRef, useState } from 'react';
import { Card } from '@/components/ui/card';
import { motion } from 'framer-motion';
import Tower from '@/Components/game/Tower';
import Enemy from './Enemy';

export default function GameBoard({ 
  map, 
  towers, 
  enemies, 
  lives, 
  round,
  onTowerPlace,
  selectedTowerType,
  onTowerUpgrade,
  onTowerRemove,
  onEnemyReachEnd,
  onEnemyDestroyed
}) {
  const canvasRef = useRef(null);
  const [hoveredCell, setHoveredCell] = useState(null);
  const [selectedTowerId, setSelectedTowerId] = useState(null);

  // Definir caminos según el mapa
  const paths = {
    easy: [
      { x: 0, y: 4 },
      { x: 2, y: 4 },
      { x: 2, y: 1 },
      { x: 4, y: 1 },
      { x: 4, y: 6 },
      { x: 6, y: 6 },
      { x: 6, y: 2 },
      { x: 8, y: 2 },
      { x: 8, y: 7 },
      { x: 10, y: 7 },
      { x: 10, y: 3 },
      { x: 12, y: 3 },
      { x: 12, y: 6 },
      { x: 14, y: 6 },
      { x: 14, y: 1 },
      { x: 16, y: 1 },
      { x: 16, y: 4 },
      { x: 17, y: 4 }
    ],
    medium: [
      { x: 0, y: 5 },
      { x: 5, y: 5 },
      { x: 5, y: 2 },
      { x: 2, y: 2 },
      { x: 2, y: 5 },
      { x: 5, y: 5 },
      { x: 5, y: 8 },
      { x: 10, y: 8 },
      { x: 10, y: 5 },
      { x: 13, y: 5 },
      { x: 13, y: 8 },
      { x: 10, y: 8 },
      { x: 10, y: 5 },
      { x: 17, y: 5 }
    ],
    hard: [
      { x: 8, y: 0 },
      { x: 8, y: 2 },
      { x: 6, y: 2 },
      { x: 6, y: 4 },
      { x: 8, y: 4 },
      { x: 8, y: 6 },
      { x: 6, y: 6 },
      { x: 6, y: 8 },
      { x: 8, y: 8 },
      { x: 8, y: 9 }
    ]
  };

  const currentPath = paths[map] || paths.easy;
  const gridSize = 18;

  // Función para verificar si una posición está en la línea del camino
  const isPositionOnPath = (x, y) => {
    // Verificar si está en algún punto exacto del camino
    if (currentPath.some(p => p.x === x && p.y === y)) {
      return true;
    }
    
    // Verificar si está en alguna línea entre puntos consecutivos
    for (let i = 0; i < currentPath.length - 1; i++) {
      const point1 = currentPath[i];
      const point2 = currentPath[i + 1];
      
      // Si es una línea horizontal
      if (point1.y === point2.y && point1.y === y) {
        const minX = Math.min(point1.x, point2.x);
        const maxX = Math.max(point1.x, point2.x);
        if (x >= minX && x <= maxX) {
          return true;
        }
      }
      
      // Si es una línea vertical
      if (point1.x === point2.x && point1.x === x) {
        const minY = Math.min(point1.y, point2.y);
        const maxY = Math.max(point1.y, point2.y);
        if (y >= minY && y <= maxY) {
          return true;
        }
      }
    }
    
    return false;
  };

  // Definir colores del camino según la dificultad
  const pathColors = {
    easy: {
      path: '#10b981', // emerald-500
      glow: '#34d399', // emerald-400
      start: '#22c55e', // green-500
      end: '#ef4444', // red-500
      middle: '#10b981' // emerald-500
    },
    medium: {
      path: '#f59e0b', // amber-500
      glow: '#fbbf24', // amber-400
      start: '#22c55e', // green-500
      end: '#ef4444', // red-500
      middle: '#f59e0b' // amber-500
    },
    hard: {
      path: '#ef4444', // red-500
      glow: '#f87171', // red-400
      start: '#22c55e', // green-500
      end: '#ef4444', // red-500
      middle: '#ef4444' // red-500
    }
  };

  const currentColors = pathColors[map] || pathColors.easy;
  // Make cellSize responsive to viewport width so the map grows to fill screen
  const viewportWidth = typeof window !== 'undefined' ? window.innerWidth : 1200;
  // Use 60% of viewport to leave room for the side panel
  const maxBoardWidth = Math.min(viewportWidth * 0.6, gridSize * 80);
  const cellSize = Math.max(36, Math.floor(maxBoardWidth / gridSize));

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
  const width = gridSize * cellSize;
  const height = 10 * cellSize;

    canvas.width = width;
    canvas.height = height;

    // Limpiar canvas
    ctx.fillStyle = '#0a0e1a';
    ctx.fillRect(0, 0, width, height);

    // Dibujar grid
    ctx.strokeStyle = '#1a2332';
    ctx.lineWidth = 1;
    for (let i = 0; i <= gridSize; i++) {
      ctx.beginPath();
      ctx.moveTo(i * cellSize, 0);
      ctx.lineTo(i * cellSize, height);
      ctx.stroke();
    }
    for (let i = 0; i <= 10; i++) {
      ctx.beginPath();
      ctx.moveTo(0, i * cellSize);
      ctx.lineTo(width, i * cellSize);
      ctx.stroke();
    }

    // Dibujar camino con color según dificultad
    ctx.strokeStyle = currentColors.path;
    ctx.lineWidth = 4;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    ctx.beginPath();
    currentPath.forEach((point, index) => {
      const x = point.x * cellSize + cellSize / 2;
      const y = point.y * cellSize + cellSize / 2;
      if (index === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    });
    ctx.stroke();

    // Dibujar puntos del camino con bordes de esquina según dificultad
    currentPath.forEach((point, index) => {
      const x = point.x * cellSize + cellSize / 2;
      const y = point.y * cellSize + cellSize / 2;
      
      // Determinar si es punto de inicio, fin o esquina
      const isStart = index === 0;
      const isEnd = index === currentPath.length - 1;
      const isCorner = !isStart && !isEnd;
      
      if (isStart || isEnd) {
        // Puntos de inicio y fin como círculos con glow
        const gradient = ctx.createRadialGradient(x, y, 5, x, y, 15);
        gradient.addColorStop(0, isStart ? currentColors.start : currentColors.end);
        gradient.addColorStop(1, 'transparent');
        
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(x, y, 15, 0, Math.PI * 2);
        ctx.fill();

        // Core point
        ctx.fillStyle = isStart ? currentColors.start : currentColors.end;
        ctx.beginPath();
        ctx.arc(x, y, 5, 0, Math.PI * 2);
        ctx.fill();
      } else if (isCorner) {
        // Determinar la dirección de la esquina basada en los puntos adyacentes
        const prevPoint = currentPath[index - 1];
        const nextPoint = currentPath[index + 1];
        
        // Calcular las direcciones
        const prevDir = {
          x: point.x - prevPoint.x,
          y: point.y - prevPoint.y
        };
        const nextDir = {
          x: nextPoint.x - point.x,
          y: nextPoint.y - point.y
        };
        
        const cornerSize = 8;
        const glowSize = 12;
        
        // Glow effect para esquinas
        const gradient = ctx.createRadialGradient(x, y, cornerSize/2, x, y, glowSize);
        gradient.addColorStop(0, currentColors.glow);
        gradient.addColorStop(1, 'transparent');
        
        ctx.fillStyle = gradient;
        ctx.fillRect(x - glowSize, y - glowSize, glowSize * 2, glowSize * 2);

        // Dibujar esquina cortada con forma de L más clara
        ctx.strokeStyle = currentColors.middle;
        ctx.lineWidth = 6;
        ctx.lineCap = 'square';
        
        // Dibujar las dos líneas que forman la esquina
        ctx.beginPath();
        ctx.moveTo(x - prevDir.x * cornerSize/2, y - prevDir.y * cornerSize/2);
        ctx.lineTo(x, y);
        ctx.lineTo(x + nextDir.x * cornerSize/2, y + nextDir.y * cornerSize/2);
        ctx.stroke();
        
        // Dibujar un cuadrado más grande en la esquina para enfatizar el corte
        ctx.fillStyle = currentColors.glow;
        ctx.fillRect(x - 3, y - 3, 6, 6);
        
        // Dibujar líneas internas para crear efecto de esquina cortada
        ctx.strokeStyle = currentColors.glow;
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(x - prevDir.x * cornerSize/3, y - prevDir.y * cornerSize/3);
        ctx.lineTo(x, y);
        ctx.lineTo(x + nextDir.x * cornerSize/3, y + nextDir.y * cornerSize/3);
        ctx.stroke();
      }
    });

    // Hover effect
    if (hoveredCell) {
      if (!isPositionOnPath(hoveredCell.x, hoveredCell.y)) {
        ctx.fillStyle = selectedTowerType ? 'rgba(34, 197, 94, 0.2)' : 'rgba(59, 130, 246, 0.1)';
        ctx.fillRect(hoveredCell.x * cellSize, hoveredCell.y * cellSize, cellSize, cellSize);
      }
    }
  }, [map, hoveredCell, selectedTowerType, currentColors]);

  const handleCanvasClick = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    // Account for possible canvas CSS scaling
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const relativeX = (e.clientX - rect.left) * scaleX;
    const relativeY = (e.clientY - rect.top) * scaleY;
    const x = Math.floor(relativeX / cellSize);
    const y = Math.floor(relativeY / cellSize);

    // Verificar si se clickeó una torre existente
    const clickedTower = towers.find(t => t.x === x && t.y === y);
    if (clickedTower) {
      setSelectedTowerId(clickedTower.id);
      return;
    }

    // Si no, intentar colocar una torre
    if (!selectedTowerType) {
      setSelectedTowerId(null);
      return;
    }

    // Verificar que no esté en el camino (incluyendo toda la línea)
    if (isPositionOnPath(x, y)) return;

    // Verificar que no haya otra torre
    const hasTower = towers.some(t => t.x === x && t.y === y);
    if (hasTower) return;

    onTowerPlace(x, y);
    setSelectedTowerId(null);
  };

  const handleCanvasMove = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const relativeX = (e.clientX - rect.left) * scaleX;
    const relativeY = (e.clientY - rect.top) * scaleY;
    const x = Math.floor(relativeX / cellSize);
    const y = Math.floor(relativeY / cellSize);
    setHoveredCell({ x, y });
  };

  return (
    <div style={{position:'relative'}}>
      <div style={{position:'relative', zIndex:1}}>
        <canvas
          ref={canvasRef}
          onClick={handleCanvasClick}
          onMouseMove={handleCanvasMove}
          onMouseLeave={() => setHoveredCell(null)}
          className="border-2 border-blue-500/30 rounded-lg cursor-crosshair"
          style={{ width: gridSize * cellSize, height: 10 * cellSize, display:'block' }}
        />
      </div>

      {/* Torres */}
      <div style={{position:'absolute', left:0, top:0, width: gridSize * cellSize, height: 10 * cellSize, pointerEvents:'none', zIndex: 5}}>
        {towers.map((tower) => (
          <Tower
            key={tower.id}
            tower={tower}
            cellSize={cellSize}
            enemies={enemies}
            onEnemyHit={onEnemyDestroyed}
            onUpgrade={onTowerUpgrade}
            currentRound={round}
            onRemove={onTowerRemove}
            isSelected={selectedTowerId === tower.id}
          />
        ))}
      </div>

      {/* Enemigos */}
      <div style={{position:'absolute', left:0, top:0, width: gridSize * cellSize, height: 10 * cellSize, pointerEvents:'none', zIndex: 6}}>
        {enemies.map((enemy) => {
          // ensure enemy starts at path start if position not set
          if (!enemy.position || (enemy.position.x === 0 && enemy.position.y === 0)) {
            // mutate the object so Enemy component and Tower see the same reference
            enemy.position = { ...currentPath[0] };
          }
          return (
            <Enemy
              key={enemy.id}
              enemy={enemy}
              path={currentPath}
              cellSize={cellSize}
              onReachEnd={() => onEnemyReachEnd(enemy)}
            />
          )
        })}
      </div>
    </div>
  );
}