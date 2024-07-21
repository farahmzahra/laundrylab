import { writable } from 'svelte/store'

export const isAuthenticated = writable(false);

if (typeof window !== 'undefined') {
    isAuthenticated.set(localStorage.getItem('isAuthenticated') === 'true');
}

export const stateKategori = writable(false);