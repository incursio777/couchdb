import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Trophy, Medal, Award, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { motion } from 'framer-motion';
import { Skeleton } from '@/components/ui/skeleton';

export default function LeaderboardPage() {
  const navigate = useNavigate();

  const { data: scores, isLoading } = useQuery({
    queryKey: ['scores'],
    queryFn: () => base44.entities.GameScore.list('-score', 100),
    initialData: []
  });

  const topScores = (scores || []).slice(0, 5);

  const getRankIcon = (index) => {
    if (index === 0) return <Trophy className="w-6 h-6 text-yellow-400" />;
    if (index === 1) return <Medal className="w-6 h-6 text-gray-400" />;
    if (index === 2) return <Award className="w-6 h-6 text-amber-600" />;
    return <span className="text-gray-400 font-bold">#{index + 1}</span>;
  };

  const getMapColor = (map) => {
    const colors = {
      easy: 'bg-green-100 text-green-800 border-green-200',
      medium: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      hard: 'bg-red-100 text-red-800 border-red-200'
    };
    return colors[map] || colors.easy;
  };

  const getMapName = (map) => {
    const names = {
      easy: 'Fácil',
      medium: 'Medio',
      hard: 'Difícil'
    };
    return names[map] || map;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-blue-950 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4"
        >
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-white flex items-center gap-3">
              <Trophy className="w-8 h-8 text-yellow-400" />
              Tabla de Posiciones
            </h1>
            <p className="text-gray-400 mt-2">Los mejores defensores de CouchDB</p>
          </div>
          <Button
            onClick={() => navigate(createPageUrl('Game'))}
            variant="outline"
            className="border-blue-500 text-white hover:bg-slate-800"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver al Juego
          </Button>
        </motion.div>

        {/* Top 3 destacado */}
        {!isLoading && topScores.length >= 3 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="grid md:grid-cols-3 gap-4 mb-8"
          >
            {/* Segundo lugar */}
            <Card className="bg-slate-800/50 border-gray-500 backdrop-blur-sm">
              <CardContent className="p-6 text-center">
                <Medal className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <h3 className="text-xl font-bold text-white mb-1">{topScores[1].player_name}</h3>
                <p className="text-3xl font-bold text-gray-300 mb-2">{topScores[1].score}</p>
                <Badge variant="secondary" className={getMapColor(topScores[1].map)}>
                  {getMapName(topScores[1].map)}
                </Badge>
              </CardContent>
            </Card>

            {/* Primer lugar */}
            <Card className="bg-gradient-to-b from-yellow-900/50 to-slate-800/50 border-yellow-400 backdrop-blur-sm md:-mt-4">
              <CardContent className="p-6 text-center">
                <Trophy className="w-16 h-16 text-yellow-400 mx-auto mb-3" />
                <h3 className="text-2xl font-bold text-white mb-1">{topScores[0].player_name}</h3>
                <p className="text-4xl font-bold text-yellow-400 mb-2">{topScores[0].score}</p>
                <Badge variant="secondary" className={getMapColor(topScores[0].map)}>
                  {getMapName(topScores[0].map)}
                </Badge>
              </CardContent>
            </Card>

            {/* Tercer lugar */}
            <Card className="bg-slate-800/50 border-amber-600 backdrop-blur-sm">
              <CardContent className="p-6 text-center">
                <Award className="w-12 h-12 text-amber-600 mx-auto mb-3" />
                <h3 className="text-xl font-bold text-white mb-1">{topScores[2].player_name}</h3>
                <p className="text-3xl font-bold text-amber-400 mb-2">{topScores[2].score}</p>
                <Badge variant="secondary" className={getMapColor(topScores[2].map)}>
                  {getMapName(topScores[2].map)}
                </Badge>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Lista completa */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="bg-slate-900/80 border-blue-500 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-white">Mejores Puntajes</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-3">
                  {Array(10).fill(0).map((_, i) => (
                    <Skeleton key={i} className="h-16 bg-slate-800" />
                  ))}
                </div>
              ) : (
                <div className="space-y-2">
                  {topScores.map((score, index) => (
                    <motion.div
                      key={score.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="flex items-center justify-between p-4 bg-slate-800 rounded-lg hover:bg-slate-700 transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-10 flex justify-center">
                          {getRankIcon(index)}
                        </div>
                        <div>
                          <p className="font-semibold text-white text-lg">{score.player_name}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <Badge variant="secondary" className={getMapColor(score.map)}>
                          {getMapName(score.map)}
                        </Badge>
                        <p className="text-3xl font-bold text-white">{score.score}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}

              {!isLoading && topScores.length === 0 && (
                <div className="text-center py-12">
                  <Trophy className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                  <p className="text-gray-400">Aún no hay puntajes registrados</p>
                  <p className="text-gray-500 text-sm mt-2">¡Sé el primero en jugar!</p>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}