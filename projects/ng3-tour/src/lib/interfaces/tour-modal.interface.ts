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
    fixed?: boolean;
    minWidth?: string;
    minHeight?: string;
    maxWidth?: string;
    maxHeight?: string;
    autofocus?: boolean;
    arrowToTarget?: boolean,
    position?: TourModalPosition
}

export const DefaultModalProps = {
    className: '',
    horisontalIndent: 50,
    verticalIndent: 20,
    withoutCounter: false,
    withoutPrev: false,
    arrowToTarget: true,
    placement: 'down',
    fixed: false,
    minWidth: '250px',
    minHeight: '150px',
    maxWidth: '400px',
    maxHeight: '600px',
    autofocus: true,
}
