import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { motion } from 'framer-motion';

import GameBoard from '../components/game/GameBoard';
import TowerPanel from '../components/game/TowerPanel';
import GameStats from '../components/game/GameStats';
import QuizModal from '../components/game/QuizModal';
import GameOverModal from '../components/game/GameOverModal';
import WavePreview from '../components/game/WavePreview';

export default function GamePage() {
  const navigate = useNavigate();
  const [gameState, setGameState] = useState('menu');
  const [selectedMap, setSelectedMap] = useState('easy');
  const [round, setRound] = useState(1);
  const [lives, setLives] = useState(100);
  const [score, setScore] = useState(0);
  const [towers, setTowers] = useState([]);
  const [enemies, setEnemies] = useState([]);
  const [selectedTowerType, setSelectedTowerType] = useState(null);
  const [enemiesDestroyed, setEnemiesDestroyed] = useState(0);
  const [quizCorrect, setQuizCorrect] = useState(0);
  const [showQuiz, setShowQuiz] = useState(false);
  const [bossDefeated, setBossDefeated] = useState(false);
  const [localScores, setLocalScores] = useState([]);
  const [roundInProgress, setRoundInProgress] = useState(false);
  const [waitingForStart, setWaitingForStart] = useState(true);
  const [nextWaveComposition, setNextWaveComposition] = useState([]);

  const maxLives = { easy: 100, medium: 75, hard: 50 };
  const mapMultiplier = { easy: 1, medium: 1.5, hard: 2 };
  const enemyTypes = ['syntax', 'conflict', 'netlag', 'overwriter', 'nullvalue'];

  const getEnemyStats = (type, level) => {
    const baseStats = {
      syntax: { health: 30, damage: 1, speed: 0.8 },
      conflict: { health: 60, damage: 2, speed: 0.5 },
      netlag: { health: 45, damage: 1, speed: 0.6 },
      overwriter: { health: 80, damage: 3, speed: 0.6 },
      nullvalue: { health: 50, damage: 2, speed: 0.7 },
      boss: { health: 7500, damage: Infinity, speed: 0.4 }
    };
    const stats = baseStats[type];
    return {
      health: stats.health * level,
      maxHealth: stats.health * level,
      damage: stats.damage * level,
      speed: stats.speed
    };
  };

  const prepareNextWave = (roundNumber) => {
    if (roundNumber === 21) {
      setNextWaveComposition([{ type: 'boss', level: 3 }]);
      return;
    }
    const waveSize = Math.floor(5 + roundNumber * 1.5);
    const composition = [];
    for (let i = 0; i < waveSize; i++) {
      let level = 1;
      if (roundNumber >= 16) level = Math.random() > 0.3 ? 3 : 2;
      else if (roundNumber >= 9) level = Math.random() > 0.5 ? 2 : 1;
      const type = enemyTypes[Math.floor(Math.random() * enemyTypes.length)];
      composition.push({ type, level });
    }
    setNextWaveComposition(composition);
  };

  const startRound = () => {
    setWaitingForStart(false);
    setShowQuiz(false);
    if (round === 21) {
      const boss = {
        id: Date.now() + Math.random() * 1000,
        type: 'boss',
        level: 3,
        position: { x: 0, y: 0 },
        ...getEnemyStats('boss', 1)
      };
      setEnemies([boss]);
    } else {
      setEnemies([]);
      nextWaveComposition.forEach((comp, i) => {
        setTimeout(() => {
          const newEnemy = {
            id: Date.now() + i + Math.random() * 1000,
            type: comp.type,
            level: comp.level,
            position: { x: 0, y: 0 },
            ...getEnemyStats(comp.type, comp.level)
          };
          setEnemies(prev => [...prev, newEnemy]);
        }, i * 1000);
      });
    }
    setRoundInProgress(true);
  };

  const handleStartGame = () => {
    setGameState('playing');
    setLives(maxLives[selectedMap]);
    setRound(1);
    setScore(0);
    setTowers([]);
    setEnemies([]);
    setEnemiesDestroyed(0);
    setQuizCorrect(0);
    setBossDefeated(false);
    setWaitingForStart(true);
    setRoundInProgress(false);
    prepareNextWave(1);
  };

  const handleTowerPlace = (x, y) => {
    if (!selectedTowerType) return;
    const maxTowersPerType = Math.min(3, Math.floor(round / 5) + 1);
    const towerCount = towers.filter(t => t.type === selectedTowerType).length;
    if (towerCount >= maxTowersPerType) return;
    const towerStats = {
      validator: { damage: 30, range: 2.5, attackSpeed: 600 },
      replicator: { damage: 25, range: 2.8, attackSpeed: 700 },
      compactor: { damage: 35, range: 2.5, attackSpeed: 450 },
      index: { damage: 40, range: 3.2, attackSpeed: 500 },
      security: { damage: 25, range: 2.5, attackSpeed: 650 }
    };
    const newTower = {
      id: Date.now() + Math.random(),
      type: selectedTowerType,
      x,
      y,
      level: 1,
      canAttack: true,
      ...towerStats[selectedTowerType]
    };
    setTowers(prev => [...prev, newTower]);
    setSelectedTowerType(null);
  };

  const handleTowerRemove = (towerId) => {
    setTowers(prev => {
      const t = prev.find(x => x.id === towerId);
      if (!t) return prev;
      // allow quick re-placement by selecting the same tower type
      setSelectedTowerType(t.type);
      return prev.filter(x => x.id !== towerId);
    });
  };

  // ✅ FUNCIÓN DE MEJORA DE TORRES: acepta un objeto `upgradedTower` o solo un `id`
  const handleTowerUpgrade = (payload) => {
    console.log('Game.jsx recibió upgrade:', payload);

    setTowers(prev =>
      prev.map(t => {
        // payload puede ser el objeto completo o solo el id
        const targetId = payload && typeof payload === 'object' ? payload.id : payload;
        if (t.id !== targetId) return t;

        // Si nos pasan el objeto completo, lo usamos directamente
        if (payload && typeof payload === 'object') {
          console.log('Actualizando torre (obj):', t.id);
          return { ...payload };
        }

        // Si solo nos pasan el id, calculamos la mejora mínima aquí
        if (t.level >= 3) return t;
        const upgraded = {
          ...t,
          level: t.level + 1,
          damage: Math.round(t.damage * 1.4),
          range: t.range + 0.2,
          attackSpeed: Math.max(200, t.attackSpeed - 50),
        };
        console.log('Actualizando torre (id):', t.id, '->', upgraded);
        return upgraded;
      })
    );
  };
  
  
  
  
  const handleEnemyDestroyed = (enemyId, damage) => {
    setEnemies(prev =>
      prev.map(enemy => {
        if (enemy.id === enemyId && enemy.health > 0) {
          const newHealth = Math.max(0, enemy.health - damage);
          if (newHealth === 0 && enemy.health > 0) {
            setEnemiesDestroyed(prevCount => prevCount + 1);
            setScore(prevScore => prevScore + 50);
            if (enemy.type === 'boss') {
              setBossDefeated(true);
              setScore(prevScore => prevScore + 1000);
            }
          }
          return { ...enemy, health: newHealth };
        }
        return enemy;
      })
    );
  };

  const handleEnemyReachEnd = (enemy) => {
    if (enemy.type === 'boss') endGame(false);
    else {
      setLives(prev => Math.max(0, prev - enemy.damage));
      setEnemies(prev => prev.filter(e => e.id !== enemy.id));
    }
  };

  const handleQuizAnswer = (correct) => {
    if (correct) {
      setQuizCorrect(prev => prev + 1);
      setScore(prev => prev + 100);
    }
  };

  const endGame = (victory) => setGameState('gameover');

  const handleSaveScore = async (playerName) => {
    try {
      await base44.entities.GameScore.create({
        player_name: playerName,
        score: Math.floor(score * mapMultiplier[selectedMap]),
        map: selectedMap,
        rounds_completed: round - 1,
        enemies_destroyed: enemiesDestroyed,
        quiz_correct: quizCorrect,
        boss_defeated: bossDefeated
      });
      // Also save a local copy so the menu can display recent scores without network
      try {
        const stored = JSON.parse(localStorage.getItem('localScores') || '[]');
        const entry = { player_name: playerName, score: Math.floor(score * mapMultiplier[selectedMap]), map: selectedMap, date: new Date().toISOString() };
        const updated = [entry, ...stored].slice(0, 20);
        localStorage.setItem('localScores', JSON.stringify(updated));
        setLocalScores(updated);
      } catch (e) {
        console.warn('No se pudo guardar puntaje localmente', e);
      }
    } catch (error) {
      console.error('Error guardando puntaje:', error);
    }
  };

  useEffect(() => {
    // Load local scores for display in menu
    try {
      const stored = JSON.parse(localStorage.getItem('localScores') || '[]');
      setLocalScores(stored.slice(0, 10));
    } catch (e) {
      setLocalScores([]);
    }
  }, []);

  useEffect(() => {
    if (lives <= 0 && gameState === 'playing') endGame(false);
  }, [lives, gameState]);

  useEffect(() => {
    if (gameState !== 'playing' || !roundInProgress) return;
    const allDead = enemies.every(e => e.health <= 0);
    if (allDead && enemies.length > 0) {
      setEnemies([]);
      setRoundInProgress(false);
      setWaitingForStart(true);

      if (round === 21 && bossDefeated) {
        setTimeout(() => endGame(true), 1000);
        return;
      }

      if (round % 5 === 0) {
        setTimeout(() => setShowQuiz(true), 1000);
      } else {
        const next = round + 1;
        setTimeout(() => {
          setRound(next);
          prepareNextWave(next);
        }, 1200);
      }
    }
  }, [enemies, roundInProgress, gameState, bossDefeated]);

  const disableStartButton =
    showQuiz || roundInProgress || enemies.some(enemy => enemy.health > 0);

  // --------------------------- RENDER ---------------------------
  if (gameState === 'menu') {
    const difficulties = [
      { id: 'easy', label: '🌱 Fácil', color: '#4ade80' },
      { id: 'medium', label: '⚔️ Media', color: '#facc15' },
      { id: 'hard', label: '💀 Difícil', color: '#ef4444' }
    ];

    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-blue-950 p-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-4">🎮 DATA DEFENSE</h1>
          <p className="text-2xl text-blue-300 mb-8">PROTECT THE COUCHDB</p>
          <Card className="bg-slate-900/80 border-blue-500 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-2xl text-white">Selecciona la Dificultad</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex justify-center gap-6">
                {difficulties.map(diff => (
                  <motion.button
                  key={diff.id}
                  onClick={() => setSelectedMap(diff.id)}
                  whileTap={{ scale: 0.95 }}
                  style={{
                    backgroundColor:
                      selectedMap === diff.id ? `${diff.color}cc` : diff.color,
                    color: '#000',
                    fontWeight: 700,
                    padding: '10px 18px',
                    borderRadius: 10,
                    border: '2px solid rgba(0,0,0,0.25)',
                    cursor: 'pointer',
                    filter:
                      selectedMap === diff.id ? 'brightness(0.8)' : 'brightness(1)',
                    transition: 'all 0.2s ease',
                    marginRight: 10, // 👉 espaciado horizontal
                    marginBottom: 10, // opcional, si están en varias filas
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.filter = 'brightness(0.85)')}
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.filter =
                      selectedMap === diff.id ? 'brightness(0.8)' : 'brightness(1)')}
                >
                  {diff.label}
                </motion.button>
                
                ))}
              </div>
              
              {/* Leaderboard local */}
              <div style={{marginTop:8, textAlign:'left'}}>
                <h4 style={{margin:0, marginBottom:6, color:'#e6eef8'}}>Últimos puntajes (local)</h4>
                {localScores.length === 0 ? (
                  <div className="small-text">No hay puntajes guardados aún</div>
                ) : (
                  <div style={{display:'flex', flexDirection:'column', gap:6}}>
                    {localScores.slice(0,5).map((s, i) => (
                      <div key={i} style={{display:'flex', justifyContent:'space-between', background:'rgba(255,255,255,0.02)', padding:'8px 10px', borderRadius:6}}>
                        <div style={{fontWeight:700}}>{s.player_name || 'Anónimo'}</div>
                        <div className="small-text">{s.score} — {s.map}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <motion.button
                onClick={handleStartGame}
                whileTap={{ scale: 0.95 }}
                style={{
                  backgroundColor: '#3b82f6',
                  color: 'white',
                  fontWeight: 700,
                  fontSize: 18,
                  borderRadius: 10,
                  padding: '12px 28px',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 8,
                  margin: '0 auto'
                }}
                onMouseEnter={(e) => (e.currentTarget.style.filter = 'brightness(0.85)')}
                onMouseLeave={(e) => (e.currentTarget.style.filter = 'brightness(1)')}
              >
                ▶️ Iniciar Juego
              </motion.button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (gameState === 'playing') {
    return (
      <div className="min-h-screen bg-slate-950 p-4">
        <div className="max-w-7xl mx-auto space-y-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-white">🎮 DATA DEFENSE</h1>
            <Button
              variant="outline"
              onClick={() => setGameState('menu')}
              className="border-slate-600 text-white hover:bg-slate-800"
            >
              <ArrowLeft className="w-4 h-4 mr-2" /> Menú
            </Button>
          </div>

          <GameStats
            lives={lives}
            maxLives={maxLives[selectedMap]}
            round={round}
            score={Math.floor(score * mapMultiplier[selectedMap])}
            enemiesDestroyed={enemiesDestroyed}
            difficulty={selectedMap}
          />

          {waitingForStart && !roundInProgress && (
            <div className="grid md:grid-cols-[2fr_1fr] gap-4">
              <WavePreview round={round} waveComposition={nextWaveComposition} />
              <Card className="bg-blue-900/50 border-blue-500">
                <CardContent className="p-4 flex flex-col justify-center items-center h-full">
                  <p className="text-white text-lg font-semibold mb-2 text-center">
                    {round === 21 ? '⚠️ Jefe Final' : `Ronda ${round}`}
                  </p>
                  <motion.button
                    onClick={startRound}
                    disabled={disableStartButton}
                    whileTap={{ scale: disableStartButton ? 1 : 0.95 }}
                    style={{
                      backgroundColor: disableStartButton ? '#6b7280' : '#3b82f6',
                      color: 'white',
                      fontWeight: 700,
                      borderRadius: 10,
                      padding: '10px 26px',
                      cursor: disableStartButton ? 'not-allowed' : 'pointer',
                      transition: 'all 0.2s ease',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 8,
                      width: 'auto'
                    }}
                    onMouseEnter={(e) => {
                      if (!disableStartButton)
                        e.currentTarget.style.filter = 'brightness(0.85)';
                    }}
                    onMouseLeave={(e) => {
                      if (!disableStartButton)
                        e.currentTarget.style.filter = 'brightness(1)';
                    }}
                  >
                    ▶️ Iniciar Ronda
                  </motion.button>
                </CardContent>
              </Card>
            </div>
          )}

          <div style={{ display: 'flex', gap: 16 }}>
            <div style={{ flex: 1 }}>
              <GameBoard
                map={selectedMap}
                towers={towers}
                enemies={enemies}
                lives={lives}
                round={round}
                onTowerPlace={handleTowerPlace}
                selectedTowerType={selectedTowerType}
                onEnemyReachEnd={handleEnemyReachEnd}
                onEnemyDestroyed={handleEnemyDestroyed}
                onTowerUpgrade={handleTowerUpgrade}
                onTowerRemove={handleTowerRemove}
              />
            </div>

            <div style={{ width: 560 }}>
              <TowerPanel
                towers={towers}
                selectedTowerType={selectedTowerType}
                onTowerSelect={setSelectedTowerType}
                onTowerUpgrade={handleTowerUpgrade} // ✅ restaurado
                currentRound={round}
              />
            </div>
          </div>
        </div>

        <QuizModal
          isOpen={showQuiz}
          onClose={() => {
            setShowQuiz(false);
            const nextRound = round + 1;
            setRound(nextRound);
            prepareNextWave(nextRound);
          }}
          onAnswer={handleQuizAnswer}
          round={round}
        />
      </div>
    );
  }

  if (gameState === 'gameover') {
    return (
      <GameOverModal
        isOpen={true}
        victory={round === 21 && bossDefeated}
        stats={{
          score: Math.floor(score * mapMultiplier[selectedMap]),
          enemiesDestroyed,
          roundsCompleted: round - 1,
          quizCorrect,
          bossDefeated,
          noLivesLost: lives === maxLives[selectedMap]
        }}
        onSaveScore={handleSaveScore}
        onPlayAgain={() => setGameState('menu')}
        onMainMenu={() => setGameState('menu')}
      />
    );
  }

  return null;
}
