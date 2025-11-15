import React, { useState } from 'react';

export default function TowerPanel({ towers = [], selectedTowerType = null, onTowerSelect = () => {}, onTowerUpgrade = () => {}, currentRound = 1 }){
  const [hoveredTower, setHoveredTower] = useState(null);

  // max per type formula kept in sync with GamePage.handleTowerPlace
  const maxPerType = Math.min(3, Math.floor(currentRound / 5) + 1);

  const towerTypes = [
    { key: 'validator', label: 'Validator', emoji: '🧰', attacks: ['syntax'], description: 'Detecta y neutraliza errores de sintaxis. Rápida y confiable.' },
    { key: 'replicator', label: 'Replicator', emoji: '⚙️', attacks: ['netlag'], description: 'Replica datos para evitar pérdidas de red. Largo alcance.' },
    { key: 'compactor', label: 'Compactor', emoji: '🧹', attacks: ['overwriter'], description: 'Compacta datos sobrescritos. Alta precisión.' },
    { key: 'index', label: 'Index', emoji: '🔍', attacks: ['conflict'], description: 'Indexa datos para resolver conflictos. Máximo alcance.' },
    { key: 'security', label: 'Security', emoji: '🔒', attacks: ['nullvalue'], description: 'Valida valores nulos. Defensa versátil.' }
  ];

  return (
    <div className="space-y-4">
      <div className="panel">
        <h3 style={{margin:0, marginBottom:8}}>Panel de Torres</h3>
        <div style={{display:'grid', gridTemplateColumns:'repeat(5, 1fr)', gap:10, alignItems:'start'}}>
          {towerTypes.map(t => {
            const haveCount = towers.filter(x => x.type === t.key).length;
            const canPlaceMore = haveCount < maxPerType;
            return (
              <div key={t.key} style={{position: 'relative'}}>
                <button
                  onMouseEnter={() => setHoveredTower(t.key)}
                  onMouseLeave={() => setHoveredTower(null)}
                  onClick={() => canPlaceMore && onTowerSelect(t.key)}
                  className={`btn ${selectedTowerType === t.key ? '' : 'btn-ghost'}`}
                  style={{display:'flex', flexDirection:'column', alignItems:'center', padding:12, gap:6, opacity: canPlaceMore ? 1 : 0.45, cursor: canPlaceMore ? 'pointer' : 'not-allowed', width: '100%'}}
                >
                  <div style={{display:'flex', flexDirection:'column', gap:6, alignItems:'center', width:'100%'}}>
                    <div style={{width:52, height:52, borderRadius:10, background: canPlaceMore ? '#071022' : '#0b0e14', display:'flex', alignItems:'center', justifyContent:'center', fontSize:26, color: canPlaceMore ? undefined : '#666'}}>{t.emoji}</div>
                    <span style={{color: canPlaceMore ? '#e6eef8' : '#9aa0ad', fontWeight:700, fontSize:13}}>{t.label}</span>
                    <div style={{display:'flex', gap:6, marginTop:4}}>
                      {t.attacks.map(a => (
                        <div key={a} className="small-text" style={{padding:'4px 8px', background:'#071022', borderRadius:8}}>{a}</div>
                      ))}
                    </div>
                  </div>
                  <div className="small-text" style={{marginTop:6}}>Rango: {t.key === 'index' ? '3.2' : t.key === 'replicator' ? '2.8' : '2.5'} — Disponibles: {Math.max(0, maxPerType - haveCount)}</div>
                </button>
                {hoveredTower === t.key && (
                  <div style={{
                    position: 'absolute',
                    bottom: '100%',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    background: '#1a1f2e',
                    border: '2px solid #3b82f6',
                    borderRadius: '8px',
                    padding: '12px',
                    whiteSpace: 'nowrap',
                    zIndex: 100,
                    marginBottom: '8px',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.5)',
                    color: '#e6eef8',
                    fontSize: '12px',
                    fontWeight: '600',
                    width: '150px',
                    whiteSpace: 'normal',
                    textAlign: 'center'
                  }}>
                    {t.description}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>

      <div className="panel">
        <h4 style={{margin:0, marginBottom:8}}>Información de Mejora</h4>
        <div style={{padding:10}}>
          <div className="small-text" style={{color:'#9aa0ad', marginBottom:8}}>
            ⭐ Mejora Nivel 2: Ronda 8<br/>
            ⭐ Mejora Nivel 3: Ronda 15<br/>
            🔰 2da unidad: Ronda 5<br/>
            🔰 3ra unidad: Ronda 10
          </div>

          {/* Mensajes grandes al desbloqueo (aparecen sólo en la ronda de desbloqueo) */}
          {currentRound === 5 && (
            <div style={{fontWeight:800, fontSize:'18px', color:'#34d399', background:'rgba(52,211,153,0.08)', padding:'12px', borderRadius:'8px', border:'2px solid #34d399'}}>
              🎉 2da unidad desbloqueada!
            </div>
          )}

          {currentRound === 10 && (
            <div style={{fontWeight:800, fontSize:'18px', color:'#34d399', background:'rgba(52,211,153,0.08)', padding:'12px', borderRadius:'8px', border:'2px solid #34d399'}}>
              🎉 3ra unidad desbloqueada!
            </div>
          )}

          {currentRound === 8 && (
            <div style={{fontWeight:700, fontSize:'18px', color:'#fbbf24', background:'rgba(251, 191, 36, 0.1)', padding:'12px', borderRadius:'8px', border:'2px solid #fbbf24', marginTop:8}}>
              🎉 ¡Nivel 2 Desbloqueado!
            </div>
          )}

          {currentRound === 15 && (
            <div style={{fontWeight:700, fontSize:'18px', color:'#fbbf24', background:'rgba(251, 191, 36, 0.1)', padding:'12px', borderRadius:'8px', border:'2px solid #fbbf24', marginTop:8}}>
              🎉 ¡Nivel 3 Desbloqueado!
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
