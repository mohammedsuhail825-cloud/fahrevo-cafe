'use strict'

export const PREVIEW = 5

/* Fahrévo Cafe — desserts only for now */
export const CATS = [
  { id: 'desserts', label: 'Desserts', items: [
    { name: 'Kinder Bueno', img: '/images/kinder-bueno.jpg?v=2' },
    { name: 'Kinder Crunch', img: '/images/kinder-crunch.jpg?v=2' },
  ]},
]

export const TABS = [
  { id: 'desserts', label: 'Desserts', cats: ['desserts'] },
]
