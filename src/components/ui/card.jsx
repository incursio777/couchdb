import React from 'react'
export function Card({ children, className = '' }){
  return <div className={`card ${className}`}>{children}</div>
}
export function CardHeader({ children }){ return <div className="card-header">{children}</div> }
export function CardTitle({ children, className='' }){ return <h3 className={`card-title ${className}`}>{children}</h3> }
export function CardContent({ children, className='' }){ return <div className={`card-content ${className}`}>{children}</div> }
