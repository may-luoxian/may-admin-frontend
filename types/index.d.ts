declare type ElRef<T extends HTMLElement = HTMLDivElement> = Nullable<T>;
declare interface Fn<T = any, R = T> {
  (...arg: T[]): R;
}
