import React from 'react';

export default function TowerPanel({ towers = [], selectedTowerType = null, onTowerSelect = () => {}, onTowerUpgrade = () => {}, currentRound = 1 }){
  // max per type formula kept in sync with GamePage.handleTowerPlace
  const maxPerType = Math.min(3, Math.floor(currentRound / 5) + 1);

  const towerTypes = [
    { key: 'validator', label: 'Validator', emoji: '🧰', attacks: ['syntax'] },
    { key: 'replicator', label: 'Replicator', emoji: '⚙️', attacks: ['netlag'] },
    { key: 'compactor', label: 'Compactor', emoji: '🧹', attacks: ['overwriter'] },
    { key: 'index', label: 'Index', emoji: '🔍', attacks: ['conflict'] },
    { key: 'security', label: 'Security', emoji: '🔒', attacks: ['nullvalue'] }
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
              <button
                key={t.key}
                onClick={() => canPlaceMore && onTowerSelect(t.key)}
                className={`btn ${selectedTowerType === t.key ? '' : 'btn-ghost'}`}
                style={{display:'flex', flexDirection:'column', alignItems:'center', padding:12, gap:6, opacity: canPlaceMore ? 1 : 0.45, cursor: canPlaceMore ? 'pointer' : 'not-allowed'}}
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
            )
          })}
        </div>
      </div>

      <div className="panel">
        <h4 style={{margin:0, marginBottom:8}}>Información de Mejora</h4>
        <div style={{padding:10}}>
          {currentRound === 8 && (
            <div className="small-text" style={{fontWeight:700}}>
              las torres ahora pueden ser de nivel 2
            </div>
          )}

          {currentRound === 15 && (
            <div className="small-text" style={{fontWeight:700}}>
              las torres ahora pueden ser de nivel 3
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
