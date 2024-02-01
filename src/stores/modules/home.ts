import { defineStore } from 'pinia';
import { pinia } from '..';
import { MAY_STORAGE } from '@/setting/localeSetting';
import { useStorageHook } from '@/hooks/storage';

export interface PreviewUser {
  username?: string;
  userInfoId?: number;
}
interface HomeState {
  previewUser: PreviewUser;
}

const storageHook = useStorageHook();
const { setObjectStorage, removeObjectStorage } = storageHook;
export const useHomeStore = defineStore('home', {
  state: (): HomeState => {
    return {
      previewUser: {}, // 预览门户块用户id
    };
  },
  actions: {
    setPreviewUser(userInfo: any) {
      this.previewUser = userInfo;
      setObjectStorage(localStorage, MAY_STORAGE, 'homePreview', userInfo);
    },
    removePreviewUser() {
      this.previewUser = {};
      removeObjectStorage(localStorage, MAY_STORAGE, 'homePreview');
    },
  },
  getters: {
    getPreviewUser(): PreviewUser {
      return this.previewUser;
    },
  },
});

export function useHomeStoreWithOut() {
  return useHomeStore(pinia);
}
