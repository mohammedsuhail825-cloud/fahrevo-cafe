'use strict'

export const PREVIEW = 5

/* Fahrévo Cafe — desserts only for now */
export const CATS = [
  { id: 'desserts', label: 'Desserts', items: [
    { name: 'Kinder Bueno', img: '/images/menu-bueno.png?v=7' },
    { name: 'Kinder Crunch', img: '/images/menu-crunch.png?v=5' },
  ]},
]

export const TABS = [
  { id: 'desserts', label: 'Desserts', cats: ['desserts'] },
]
