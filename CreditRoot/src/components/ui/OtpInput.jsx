// src/components/ui/OtpInput.jsx
// Componente reutilizable de entrada OTP.
// Props:
//   length   number   cantidad de dígitos (default 5)
//   value    string   valor controlado
//   onChange fn(str)  callback con el string completo
//   disabled boolean

import { useRef } from 'react'

export function OtpInput({ length = 5, value = '', onChange, disabled = false }) {
  const refs = useRef([])

  const digits = Array.from({ length }, (_, i) => value[i] ?? '')

  function handleChange(e, idx) {
    const ch = e.target.value.replace(/\D/g, '').slice(-1)
    const next = digits.map((d, i) => (i === idx ? ch : d)).join('')
    onChange(next)
    if (ch && idx < length - 1) refs.current[idx + 1]?.focus()
  }

  function handleKeyDown(e, idx) {
    if (e.key === 'Backspace') {
      if (digits[idx]) {
        const next = digits.map((d, i) => (i === idx ? '' : d)).join('')
        onChange(next)
      } else if (idx > 0) {
        refs.current[idx - 1]?.focus()
        const next = digits.map((d, i) => (i === idx - 1 ? '' : d)).join('')
        onChange(next)
      }
      e.preventDefault()
    }
  }

  function handlePaste(e) {
    e.preventDefault()
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, length)
    const next = Array.from({ length }, (_, i) => pasted[i] ?? '').join('')
    onChange(next)
    const focusIdx = Math.min(pasted.length, length - 1)
    refs.current[focusIdx]?.focus()
  }

  return (
    <div className="flex gap-3 justify-center" onPaste={handlePaste}>
      {digits.map((d, i) => (
        <input
          key={i}
          ref={el => { refs.current[i] = el }}
          type="text"
          inputMode="numeric"
          autoComplete={i === 0 ? 'one-time-code' : 'off'}
          maxLength={1}
          value={d}
          disabled={disabled}
          aria-label={`Dígito ${i + 1} de ${length}`}
          onChange={e => handleChange(e, i)}
          onKeyDown={e => handleKeyDown(e, i)}
          className={[
            'w-full aspect-[3/4] max-w-[56px] text-center text-2xl font-bold text-white',
            'bg-white/5 border rounded-xl outline-none transition-colors',
            'disabled:opacity-40',
            d
              ? 'border-brand'
              : 'border-white/20 focus:border-brand',
          ].join(' ')}
        />
      ))}
    </div>
  )
}
