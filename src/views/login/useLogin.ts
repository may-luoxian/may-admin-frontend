import { ref, computed } from 'vue';
export enum LoginStateEnum {
  LOGIN,
  REGISTER,
  RESET_PASSWORD
}

const currentState = ref(LoginStateEnum.LOGIN)

export function useLoginState() {
  const getLoginState = computed(() => currentState.value)

  function setLoginState(state: LoginStateEnum) {
    currentState.value = state
  }

  return { getLoginState, setLoginState }
}