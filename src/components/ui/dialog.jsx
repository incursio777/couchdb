import React from 'react'

export function Dialog({ children, open = false, onOpenChange = () => {} }){ 
	// Render nothing when closed
	if (!open) return null;

	// Blocking overlay that contains the modal content
	return (
		<div style={{ position: 'fixed', inset: 0, background: 'rgba(2,6,23,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999 }}>
			{/* children expected to include DialogContent */}
			{children}
		</div>
	)
}

export function DialogTrigger(){ return null }

export function DialogContent({ children, className, style = {} }){
	const base = {
		width: '90%',
		maxWidth: 720,
		background: 'linear-gradient(180deg, rgba(255,255,255,0.02), rgba(255,255,255,0.015))',
		border: '1px solid rgba(255,255,255,0.04)',
		borderRadius: 12,
		padding: 16,
		boxShadow: '0 20px 40px rgba(2,6,23,0.6)'
	};
	return <div className={className} style={{...base, ...style}}>{children}</div>
}

export function DialogHeader({ children }){ return <div style={{marginBottom:8}}>{children}</div> }
export function DialogFooter({ children }){ return <div style={{marginTop:8}}>{children}</div> }
export function DialogTitle({ children, className }){ return <h2 className={className}>{children}</h2> }
export function DialogDescription({ children, className }){ return <p className={className}>{children}</p> }
