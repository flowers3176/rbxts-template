import { useCamera, useDebounceState, useEventListener } from "@rbxts/pretty-react-hooks";
import { useEffect, useMemo } from "@rbxts/react";

interface ScaleFunction {
	/** Scales `pixels` based on the current viewport size and rounds the result. */
	(pixels: number): number;
	/** Scales `pixels` and rounds the result up. */
	ceil: (pixels: number) => number;
	/** Scales `pixels` and rounds the result to the nearest even number. */
	even: (pixels: number) => number;
	/** Scales `pixels` and rounds the result down. */
	floor: (pixels: number) => number;
	/** Scales a number based on the current viewport size without rounding. */
	scale: (percent: number) => number;
	/** Scales 'offset' and gives back an UDim2. */
	toUDim: (offset: number) => UDim;
	/** Scales `x` and `y` and gives back an UDim2. */
	toUDim2: (xPixels?: number, yPixels?: number) => UDim2;
}

const BASE_RESOLUTION = new Vector2(1280, 720);
const MIN_SCALE = 0.5;
const DOMINANT_AXIS = 0.5;

/**
 * @param viewport - ViewportSize.
 * @returns Viewport scale factor.
 * @see https://discord.com/channels/476080952636997633/476080952636997635/1146857136358432900
 */
function calculateScale(viewport: Vector2): number {
	const width = math.log(viewport.X / BASE_RESOLUTION.X, 2);
	const height = math.log(viewport.Y / BASE_RESOLUTION.Y, 2);
	const centered = width + (height - width) * DOMINANT_AXIS;

	return math.max(2 ** centered, MIN_SCALE);
}

// eslint-disable-next-line max-lines-per-function -- fuck you linter
export function usePx(): ScaleFunction {
	const camera = useCamera();

	const [scale, setScale] = useDebounceState(calculateScale(camera.ViewportSize), {
		leading: true,
		wait: 0.2,
	});

	useEffect(() => {
		setScale(calculateScale(camera.ViewportSize));
	}, [camera, setScale]);

	useEventListener(camera.GetPropertyChangedSignal("ViewportSize"), () => {
		setScale(calculateScale(camera.ViewportSize));
	});

	return useMemo(() => {
		const api = {
			ceil: (value: number) => math.ceil(value * scale),
			even: (value: number) => math.round(value * scale * 0.5) * 2,
			floor: (value: number) => math.floor(value * scale),
			scale: (value: number) => value * scale,
			toUDim: (offset: number) => new UDim(0, offset * scale),
			toUDim2: (xPixels: number, yPixels?: number) => {
				return UDim2.fromOffset(xPixels * scale, yPixels !== undefined ? yPixels * scale : 0);
			},
		};

		setmetatable(api, {
			__call: (_, value) => math.round((value as number) * scale),
		});

		return api as ScaleFunction;
	}, [scale]);
}
