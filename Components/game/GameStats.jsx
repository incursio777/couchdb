import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Heart, Trophy, Target, Shield } from 'lucide-react';

export default function GameStats({ lives, maxLives, round, score, enemiesDestroyed, difficulty = 'easy' }) {
  const livesPercent = (lives / maxLives) * 100;

  return (
    <div style={{display:'flex', gap:12, alignItems:'center', justifyContent:'space-between', flexWrap:'wrap'}}>
      <div style={{display:'flex', gap:12, alignItems:'center'}}>
        <Card className="panel" style={{display:'flex', alignItems:'center', gap:12}}>
          <CardContent className="" >
            <div style={{display:'flex', alignItems:'center', gap:12}}>
              <div style={{width:40, height:40, borderRadius:8, background:'#1f2937', display:'flex', alignItems:'center', justifyContent:'center'}}>
                <Heart className="" style={{width:18, height:18, color:'#ef4444'}} />
              </div>
              <div>
                <div className="small-text">Vidas</div>
                <div style={{fontWeight:700, fontSize:18}}>{lives} <span className="small-text">/ {maxLives}</span></div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="panel" style={{display:'flex', alignItems:'center', gap:12}}>
          <CardContent>
            <div style={{display:'flex', alignItems:'center', gap:12}}>
              <div style={{width:40, height:40, borderRadius:8, background:'#0f1724', display:'flex', alignItems:'center', justifyContent:'center'}}>
                <Shield style={{width:18, height:18, color:'#60a5fa'}} />
              </div>
              <div>
                <div className="small-text">Ronda</div>
                <div style={{fontWeight:700, fontSize:18}}>{round}/21</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="panel" style={{display:'flex', alignItems:'center', gap:12}}>
          <CardContent>
            <div style={{display:'flex', alignItems:'center', gap:12}}>
              <div style={{width:40, height:40, borderRadius:8, background:'#111827', display:'flex', alignItems:'center', justifyContent:'center'}}>
                <Trophy style={{width:18, height:18, color:'#f59e0b'}} />
              </div>
              <div>
                <div className="small-text">Puntaje</div>
                <div style={{fontWeight:700, fontSize:18}}>{score}</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="panel" style={{display:'flex', alignItems:'center', gap:12}}>
          <CardContent>
            <div style={{display:'flex', alignItems:'center', gap:12}}>
              <div style={{width:40, height:40, borderRadius:8, background:'#0f1724', display:'flex', alignItems:'center', justifyContent:'center'}}>
                <Target style={{width:18, height:18, color:'#10b981'}} />
              </div>
              <div>
                <div className="small-text">Destruidos</div>
                <div style={{fontWeight:700, fontSize:18}}>{enemiesDestroyed}</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="small-text" style={{display:'flex', gap:20, alignItems:'center'}}>
        <div>Dificultad: <span className="lead">{difficulty === 'easy' ? '🌱 Fácil' : difficulty === 'medium' ? '⚔️ Media' : '💀 Difícil'}</span></div>
      </div>
    </div>
  );
}