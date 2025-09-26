import React from 'react'

import styles from './FooterButton.module.css'

interface FooterButtonProps {
  label: string
  icon: React.ReactNode
}

export function FooterButton({ label, icon }: FooterButtonProps) {
  return (
    <button className={styles.root}>
      <span className={styles.icon}>{icon}</span>
      <span className={styles.label}>{label}</span>
    </button>
  )
}
