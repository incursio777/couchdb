import React from 'react'
export function Progress({ value = 0, max = 100 }){
  const pct = Math.max(0, Math.min(100, (value/max)*100))
  return <div style={{background:'#333', width: '100%', height:10}}><div style={{width:`${pct}%`, background:'#0ea5e9', height:'100%'}}/></div>
}
