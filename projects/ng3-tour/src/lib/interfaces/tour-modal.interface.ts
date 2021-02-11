export interface TourModalPosition {
    top?: number;
    left?: number;
    right?: number;
    bottom?: number
};

export interface TourModalProps {
    placement?: string;
    className?: string;
    horisontalIndent?: number,
    verticalIndent?: number,
    withoutCounter?: boolean,
    withoutPrev?: boolean,
    modalStyles?: ModalStyles,
    autofocus?: boolean;
    arrowToTarget?: boolean;
    modalSize?: {modHeight: number, modWidth: number}
    customTemplate?: boolean,
    delay?: number,
    animatedStep?: boolean,
    smoothScroll?: boolean,
    scrollTo?: boolean,
    closeOnClickOutside?: boolean,
    total?: number,
}

export interface ModalStyles {
    "min-width"?: string;
    "min-height"?: string;
    "max-width"?: string;
    "max-height"?: string;
    position: string;
    color?: string;
    left?: string;
    right?: string;
    top?: string;
    bottom?: string;
}
export const DefaultModalStyles = {
    position: 'absolute',
    "min-width": '250',
    "min-height": '150',
    "max-width": '400',
    "max-height": '600',
    color: '#121212',
}

export const DefaultModalProps = {
    className: '',
    horisontalIndent: 50,
    verticalIndent: 20,
    withoutCounter: false,
    withoutPrev: false,
    arrowToTarget: true,
    placement: 'down',
    modalStyles: DefaultModalStyles,
    customTemplate: false,
    delay: 1000,
    animatedStep: true,
    smoothScroll: false,
    scrollTo: false,
    closeOnClickOutside: false,
    autofocus: true,
}
