import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { motion } from 'framer-motion';

const enemyDefinitions = {
  syntax: {
    icon: '🐞',
    name: 'SyntaxError',
    color: '#ef4444',
    description: 'Avanza rápido en grupos grandes'
  },
  conflict: {
    icon: '🔄',
    name: 'Conflict Demon',
    color: '#f59e0b',
    description: 'Lento pero muy resistente'
  },
  netlag: {
    icon: '🌐',
    name: 'NetLag',
    color: '#3b82f6',
    description: 'Puede teletransportarse una vez'
  },
  overwriter: {
    icon: '⚠️',
    name: 'Overwriter',
    color: '#a855f7',
    description: 'Resiste ataques débiles'
  },
  nullvalue: {
    icon: '💀',
    name: 'NullValue',
    color: '#64748b',
    description: 'Se vuelve invisible periódicamente'
  },
  boss: {
    icon: '👾',
    name: 'Master Corruptor',
    color: '#dc2626',
    description: 'Error que absorbió toda corrupción digital. ¡Derrota instantánea si llega al núcleo!'
  }
};

export default function WavePreview({ round, waveComposition }) {
  if (round === 21) {
    const boss = enemyDefinitions.boss;
    return (
      <Card className="bg-gradient-to-r from-red-900/50 to-purple-900/50 border-red-500">
        <CardContent className="p-4">
          <h3 className="text-white font-bold text-lg mb-3 flex items-center gap-2">
            ⚠️ JEFE FINAL - RONDA 21
          </h3>
          <div className="flex items-start gap-4">
            <div 
              className="w-16 h-16 rounded-lg flex items-center justify-center text-4xl border-2 shadow-lg"
              style={{ 
                backgroundColor: boss.color,
                borderColor: boss.color,
                boxShadow: `0 0 30px ${boss.color}80`
              }}
            >
              {boss.icon}
            </div>
            <div className="flex-1">
              <h4 className="text-white font-bold text-lg">{boss.name}</h4>
              <p className="text-gray-300 text-sm mt-1">{boss.description}</p>
              <div className="mt-2 flex items-center gap-3 text-xs">
                <span className="text-red-400 font-semibold">❤️ 1500 HP</span>
                <span className="text-yellow-400 font-semibold">⚡ Lento</span>
                <span className="text-purple-400 font-semibold">💀 Derrota instantánea</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Obtener tipos únicos de enemigos en la oleada
  const uniqueTypes = [...new Set(waveComposition.map(e => e.type))];

  return (
    <Card className="panel">
      <CardContent>
        <h3 className="text-white font-semibold mb-3">🧠 Amenazas Detectadas - Ronda {round}</h3>

        <div style={{display:'flex', gap:10, alignItems:'stretch', overflowX:'auto'}}>
          {uniqueTypes.map((type) => {
            const enemy = enemyDefinitions[type];
            const count = waveComposition.filter(e => e.type === type).length;
            const levels = [...new Set(waveComposition.filter(e => e.type === type).map(e => e.level))];
            
            return (
              <motion.div
                key={type}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                className="panel"
                style={{minWidth:180, display:'flex', gap:12, alignItems:'center'}}
              >
                <div 
                  style={{ width:48, height:48, borderRadius:10, display:'flex', alignItems:'center', justifyContent:'center', border:`2px solid ${enemy.color}`, background:`${enemy.color}20` }}
                >
                  <div style={{fontSize:22}}>{enemy.icon}</div>
                </div>
                <div style={{flex:1}}>
                  <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
                    <div style={{fontWeight:700}}>{enemy.name}</div>
                    <div className="small-text">x{count}</div>
                  </div>
                  <div className="small-text" style={{marginTop:6}}>{enemy.description}</div>
                  <div style={{display:'flex', gap:6, marginTop:8}}>
                    {levels.map(level => (
                      <div key={level} style={{padding:'3px 8px', borderRadius:12, background:'#0b1220', color:'#cbd5e1', fontSize:12}}>
                        Nivel {level}
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}