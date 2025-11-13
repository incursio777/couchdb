import React from 'react'

export function RadioGroup({ children, value, onValueChange }){
	// value: string | undefined, onValueChange: (v:string)=>void
	return <div role="radiogroup" aria-activedescendant={value}>{children}</div>
}

export function RadioGroupItem({ value, checked, onChange, id }){
	return <input id={id} type="radio" value={value} checked={checked} onChange={onChange} />
}
