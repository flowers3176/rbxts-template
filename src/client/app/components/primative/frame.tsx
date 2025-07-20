import type { Element, InstanceProps } from "@rbxts/react";
import React, { forwardRef } from "@rbxts/react";

type FrameProps = InstanceProps<Frame>;
export const Frame = forwardRef<Frame, FrameProps>(function (props, ref): Element {
	return <frame BackgroundColor3={new Color3(1, 1, 1)} BorderSizePixel={0} {...props} ref={ref} />;
});
