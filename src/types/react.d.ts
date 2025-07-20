import type { InstanceProps } from "@rbxts/react";

declare type NativeProps<T extends Instance> = InstanceProps<T>;
declare type NativePropsExcept<T extends Instance, K extends keyof InstanceProps<T>> = Omit<InstanceProps<T>, K>;
declare type PropsWithNative<T extends Instance, P = object> = P & {
	native?: InstanceProps<T>;
};
declare type PropsWithNativeExcept<T extends Instance, K extends keyof InstanceProps<T>, P = object> = P & {
	native?: NativePropsExcept<T, K>;
};
declare type BindingValue<T = unknown> = NonNullable<T> | React.Binding<T>;
