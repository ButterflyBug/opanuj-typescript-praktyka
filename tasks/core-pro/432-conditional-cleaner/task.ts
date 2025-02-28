export type FieldTypeCleaner<T, K> = {
  [Prop in keyof T as  T[Prop] extends K ? never : Prop]: T[Prop];
};
