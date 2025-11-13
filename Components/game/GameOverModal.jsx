import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Trophy, Target, Heart, CheckCircle } from 'lucide-react';

export default function GameOverModal({ 
  isOpen, 
  victory, 
  stats, 
  onSaveScore,
  onPlayAgain,
  onMainMenu
}) {
  const [playerName, setPlayerName] = useState('');
  const [saved, setSaved] = useState(false);

  const handleSave = async () => {
    if (playerName.trim()) {
      await onSaveScore(playerName);
      setSaved(true);
    }
  };

  return (
    <Dialog open={isOpen}>
      <DialogContent className="sm:max-w-2xl bg-slate-900 border-blue-500">
        <DialogHeader>
          <DialogTitle className="text-3xl text-center text-white">
            {victory ? '🎉 ¡Victoria!' : '💀 Game Over'}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Estadísticas */}
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-slate-800 rounded-lg">
              <div className="flex items-center gap-3 mb-2">
                <Trophy className="w-5 h-5 text-yellow-400" />
                <span className="text-gray-400">Puntaje Final</span>
              </div>
              <p className="text-3xl font-bold text-white">{stats.score}</p>
            </div>

            <div className="p-4 bg-slate-800 rounded-lg">
              <div className="flex items-center gap-3 mb-2">
                <Target className="w-5 h-5 text-green-400" />
                <span className="text-gray-400">Enemigos</span>
              </div>
              <p className="text-3xl font-bold text-white">{stats.enemiesDestroyed}</p>
            </div>

            <div className="p-4 bg-slate-800 rounded-lg">
              <div className="flex items-center gap-3 mb-2">
                <Heart className="w-5 h-5 text-red-400" />
                <span className="text-gray-400">Rondas</span>
              </div>
              <p className="text-3xl font-bold text-white">{stats.roundsCompleted}/21</p>
            </div>

            <div className="p-4 bg-slate-800 rounded-lg">
              <div className="flex items-center gap-3 mb-2">
                <CheckCircle className="w-5 h-5 text-blue-400" />
                <span className="text-gray-400">Quiz</span>
              </div>
              <p className="text-3xl font-bold text-white">{stats.quizCorrect}</p>
            </div>
          </div>

          {/* Desglose de puntaje */}
          <div className="p-4 bg-slate-800 rounded-lg space-y-2">
            <h3 className="font-semibold text-white mb-3">Desglose de Puntaje</h3>
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Enemigos destruidos ({stats.enemiesDestroyed} × 50)</span>
              <span className="text-white font-medium">{stats.enemiesDestroyed * 50}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Preguntas correctas ({stats.quizCorrect} × 100)</span>
              <span className="text-white font-medium">{stats.quizCorrect * 100}</span>
            </div>
            {stats.bossDefeated && (
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Jefe derrotado</span>
                <span className="text-white font-medium">+1000</span>
              </div>
            )}
            {stats.noLivesLost && (
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Sin vidas perdidas</span>
                <span className="text-white font-medium">+500</span>
              </div>
            )}
          </div>

          {/* Guardar puntaje */}
          {!saved ? (
            <div className="space-y-3">
              <Label htmlFor="playerName" className="text-white">
                Guardar tu puntaje
              </Label>
              <div className="flex gap-2">
                <Input
                  id="playerName"
                  placeholder="Tu nombre"
                  value={playerName}
                  onChange={(e) => setPlayerName(e.target.value)}
                  className="bg-slate-800 border-slate-700 text-white"
                />
                <Button onClick={handleSave} className="bg-green-600 hover:bg-green-700">
                  Guardar
                </Button>
              </div>
            </div>
          ) : (
            <div className="p-4 bg-green-900/30 rounded-lg flex items-center gap-3">
              <CheckCircle className="w-5 h-5 text-green-400" />
              <span className="text-white">¡Puntaje guardado!</span>
            </div>
          )}

          {/* Botones */}
          <div className="flex gap-3">
            <Button
              onClick={onPlayAgain}
              className="flex-1 bg-blue-600 hover:bg-blue-700"
            >
              Jugar de Nuevo
            </Button>
            <Button
              onClick={onMainMenu}
              variant="outline"
              className="flex-1 border-slate-600 text-white hover:bg-slate-800"
            >
              Menú Principal
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}