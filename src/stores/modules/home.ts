import { defineStore } from 'pinia';
import { pinia } from '..';

export const useHomeStore = defineStore('home', {
  state: () => {
    return {};
  },
  actions: {},
  getters: {},
});

export function useHomeStoreWithOut() {
  return useHomeStore(pinia);
}
