import React, { useEffect, useRef, useState } from 'react'
import styles from './css/Selector.module.css'

export type SelectOption = {
    label: string
    value: string | number;
}

type MultipleSelectProps = {
    multiple: true
    value: SelectOption[]
    onChange: (value: SelectOption[]) => void
}


type SingleSelectProps = {
    multiple?: false
    value?: SelectOption
    onChange: (value: SelectOption | undefined) => void
}


type SelectProps = {
    options: SelectOption[]
} & (SingleSelectProps |MultipleSelectProps)


const Selector = ( {multiple, value, onChange, options}: SelectProps) => {
    const [isOpen, setisOpen] = useState(false);
    const [highlightedIndex, setHighlightedIndex] = useState(0);
    const containerRef = useRef<HTMLDivElement>(null)

    function clearOptions() {
        multiple ? onChange([]) : onChange(undefined)
    }

    function selectOption(option: SelectOption) {
        if (multiple) {
            if (value?.includes(option)) {
                onChange(value.filter(o => o !== option))
            }
            else {
                onChange([...value, option])
            }
        }
        else {
            if (option !== value) onChange(option);
        }

       
    }

    function isOptionSelected(option: SelectOption) {
        return multiple ? value.includes(option) : option === value
    }

    useEffect(() => {
      if (isOpen) setHighlightedIndex(0);
    
    }, [isOpen])
    
    useEffect(() => {
        const handler = (e: KeyboardEvent) => {
            if (e.target != containerRef.current) return
            switch (e.code) {
                case "Enter":
                case "Space":
                    setisOpen(prev => !prev)
                    if (isOpen) selectOption(options[highlightedIndex])
                    break
                case "ArrowUp":
                case "ArrowDown":{
                    if (!isOpen) {
                        setisOpen(true)
                        break
                    }

                    const newValue = highlightedIndex + (e.code === "ArrowDown" ? 1 : -1)
                    if (newValue >= 0 && newValue < options.length) {
                        setHighlightedIndex(newValue);
                    } 
                    break
                }
                case "Escape":
                    setisOpen(false)
                    break    
            }

        }
        containerRef.current?.addEventListener("keydown", handler)

        return () => {
            containerRef.current?.removeEventListener("keydown", handler)
        }

    }, [isOpen, highlightedIndex ,options])

  return (
    <div
    ref={containerRef}
    onBlur={() => setisOpen(false)} 
    onClick={() => setisOpen(prev => !prev)}
    tabIndex={0} 
    className={styles.container}>
        <span className={styles.value}>{multiple ? value.map( v => (
            <button key={v.value} 
            onClick={e => {
                e.stopPropagation();
                selectOption(v);
            }}
            className={styles["option-badge"]}>
            {v.label}
            <span className={styles["remove-btn"]}>&times;</span></button>

        )) :value?.label}</span>
        <button
        onClick={e => {
            e.stopPropagation();
            clearOptions();
        }}
        className={styles["clear-btn"]}>&times;</button>
        <div className={styles.divider}></div>
        <div className={styles.caret}></div>
        <ul className={`${styles.options} ${isOpen ? styles.show : ""}`}>
            {options.map((option, index) => (
                <li
                onClick={e => {
                    e.stopPropagation();
                    selectOption(option);
                    setisOpen(false);
                }} 
                key={option.value} 
                onMouseEnter={() => setHighlightedIndex(index)}
                className={`${styles.option} ${isOptionSelected(option) ? styles.selected : ""} 
                ${index === highlightedIndex ? styles.highlighted : ""}`}
                >
                    {option.label}
                </li>
            ))}
        </ul>
    </div>
  )
}

export default Selector