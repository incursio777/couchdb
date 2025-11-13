import React from 'react'
export function Button({ children, className = '', variant, onClick, ...props }){
  const cls = ['btn', className];
  if(variant === 'outline' || variant === 'ghost') cls.push('btn-ghost');
  else cls.push('btn-primary');

  const handleClick = (e) => {
    try { console.log('Button clicked', { text: children, variant }) } catch (err) {}
    if (typeof onClick === 'function') onClick(e)
  }

  return <button type="button" className={cls.join(' ')} onClick={handleClick} {...props}>{children}</button>
}
