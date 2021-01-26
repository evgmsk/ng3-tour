export interface BackdropProps {
    opacity?: number;
    targetWindowColor?: string;
    targetWindowSize?: TargetWindowSize;
    targetWindowResize?: number[];
    backdropColor?: string;
    position?: string;
    isBackdrop?: boolean;
}

export interface TargetWindowSize {
    top: number;
    left: number;
    bottom: number;
    right: number;
    height?: number;
    width?: number;
    pageHeight?: number;
}

export const DefaultBackdropProps: BackdropProps = {
    opacity: .7,
    targetWindowColor: 'transparent',
    backdropColor: 'rgb(20, 60, 60)',
    isBackdrop: true,
    position: 'absolute'
}