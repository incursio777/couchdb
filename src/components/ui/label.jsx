import React from 'react'
export function Label({ children, htmlFor, className, style, ...rest }){
	return <label htmlFor={htmlFor} className={className} style={style} {...rest}>{children}</label>
}
