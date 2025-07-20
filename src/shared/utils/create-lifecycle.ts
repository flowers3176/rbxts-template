import { Modding } from "@flamework/core";

interface Connectable<T extends Array<defined>> {
	Connect(callback: (...args: T) => defined | void): void;
}

type KeysOfObjectThatAreCallbacks<T extends object> = {
	[K in keyof T]: T[K] extends Callback ? K : never;
}[keyof T];

type MethodArgs<T extends object, K extends KeysOfObjectThatAreCallbacks<T>> = T[K] extends Callback
	? Parameters<T[K]>
	: never;

/** @metadata macro */
export function createLifecycle<
	T extends object,
	K extends KeysOfObjectThatAreCallbacks<T> = KeysOfObjectThatAreCallbacks<T>,
>(method: K, signal: Connectable<MethodArgs<T, K>>, id?: Modding.Generic<T, "id">): void {
	const set = new Set<T>();
	Modding.onListenerAdded<T>((object) => set.add(object), id);
	Modding.onListenerRemoved<T>((object) => set.delete(object), id);
	signal.Connect((...args) => {
		set.forEach((object) => {
			task.spawn(() => {
				(object[method] as (this: typeof object, ...argsFowarded: Array<defined>) => void)(
					...(args as Array<defined>),
				);
			});
		});
	});
}
