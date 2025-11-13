import React from 'react'
export function Select({ children, value, onValueChange }){
  return <select value={value} onChange={e => onValueChange && onValueChange(e.target.value)}>{children}</select>
}
export function SelectTrigger({ children, className }){ return <div className={className}>{children}</div> }
export function SelectValue(){ return null }
export function SelectContent({ children }){ return <div>{children}</div> }
export function SelectItem({ value, children }){ return <option value={value}>{children}</option> }
