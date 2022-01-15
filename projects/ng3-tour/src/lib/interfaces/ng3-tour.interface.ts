export interface IStep { 
  readonly stepName: string;
}
export interface ITourStep extends IStep {
  route: string;
  index: number;
  title: string | {[propName: string]: any};
  description: string | {[propName: string]: any};
  backdrop: IBackdrop;
  modal: IStepModal;
  ctrlBtns: ICtrlBtns;
  [key: string]: any
}

export interface IStepProps extends IStep {
  [key: string]: any
}

export interface IBackdrop {
  opacity: number;
  targetFrameColor: string;
  targetFrameSize: ITargetFrameSize;
  targetFrameResize: number[];
  backdropColor: string;
  position: string;
  isBackdrop: boolean;
}

export interface ITargetFrameSize {
  left: number,
  right: number,
  top: number,
  bottom: number,
  height: number,
  width: number,
  pageHeight: number,
}

export const DefaultBackdrop: IBackdrop = {
  opacity: .7,
  targetFrameColor: 'transparent',
  backdropColor: 'rgb(20, 60, 60)',
  targetFrameSize: {top: 0, left: 0, right: 0, height: 0, width: 0, bottom: 0, pageHeight: 0},
  targetFrameResize: [0],
  isBackdrop: true,
  position: 'absolute'
}

export interface IModalPosition {
  left?: string;
  right?: string;
  top?: string;
  bottom?: string;
}

export interface IModalStyles extends IModalPosition {
  minWidth: string;
  minHeight: string;
  maxWidth: string;
  maxHeight: string;
  position: string;
  color: string;
}

export const DefaultModalStyles: IModalStyles = {
  position: 'absolute',
  minWidth: '250px',
  minHeight: '150px',
  maxWidth: '400px',
  maxHeight: '600px',
  color: '#121212',
}

export interface IStepModal {
  placement: string;
  className: string;
  horisontalIndent: number,
  verticalIndent: number,
  withoutCounter: boolean,
  withoutPrev: boolean,
  modalStyles: IModalStyles,
  autofocus: boolean;
  arrowToTarget: boolean;
  modalSize: {modHeight: number, modWidth: number}
  customTemplate: boolean,
  delay: number,
  animatedStep: boolean,
  smoothScroll: boolean,
  scrollTo: boolean,
  closeOnClickOutside: boolean,
  totalSteps: number,
}

export const DefaultModal: IStepModal = {
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
  scrollTo: true,
  closeOnClickOutside: false,
  autofocus: true,
  modalSize: {
    modHeight: 100,
    modWidth: 100
  },
  totalSteps: 1
}

export interface IStepEventProps {
  tourEvent: string;
  index: number;
  history: number[];
}

export interface ITourOptions {
  tourBackdrop: IBackdrop;
  tourModal: IStepModal;
  tourEvents: ITourEventHandlers;
  tourCtrlBtns: ICtrlBtns;
}

export interface ITour extends ITourOptions{
  steps: ITourStep[];
  [key: string]: any;
}

export interface ITourProps {
  steps: IStepProps[];
  [key: string]: any;
}

export interface ICtrlBtns {
  // prev?: {[propsName: string]: string} | string;
  // next?: {[propsName: string]: string} | string;
  // done?: {[propsName: string]: string} | string;
  [propsName: string]: any;
}
 
export interface IModalEventHandlers {
  onNext($event: Event): void;
  onPrev($event: Event): void;
  onClose($event: Event): void;
}

export interface IStepOptions {
  backdropOptions?: IBackdrop;
  tourModalOptions?: IStepModal;
}

export interface StepSubject {
  stepName: string;
  delay?: number;
  stepTarget?: Element;
  targetSize?: Partial<ITargetFrameSize>
}

export type TourEvents = 'start' | 'end' | 'break' | 'next' | 'prev'

export type TourEventHandler =  (props: {
  tourEvent: TourEvents,
  step?: number | string,
  history?: number[],
  tour?: ITourProps,
}) => void;

export interface ITourEventHandlers {
  tourStart: TourEventHandler;
  tourEnd: TourEventHandler;
  tourBreak: TourEventHandler;
  next: TourEventHandler;
  prev: TourEventHandler;
}

export const ButtonsDefaultTranslation = {
  done: {
    'en-EN': 'done',
    'ru-RU': 'закр',
    'fr-FR': 'fini',
  },
  prev: {
    'en-EN': 'prev',
    'ru-RU': 'пред',
    'fr-FR': 'préc'
  },
  next: {
    'en-EN': 'next',
    'ru-RU': 'след',
    'fr-FR': 'proch',
  },
  of: {
    'en-EN': 'of',
    'fr-FR': 'de',
    'ru-RU': "из",
  }
}

export const DefaultTourEventHandler: TourEventHandler = (props) => {};

export const DefaultTourEventHandlers: ITourEventHandlers = {
  tourStart: DefaultTourEventHandler,
  tourEnd: DefaultTourEventHandler,
  tourBreak: DefaultTourEventHandler,
  next: DefaultTourEventHandler,
  prev: DefaultTourEventHandler,
};

export const DefaultTourOptions: ITourOptions = {
  tourCtrlBtns: ButtonsDefaultTranslation,
  tourEvents: DefaultTourEventHandlers,
  tourBackdrop: DefaultBackdrop,
  tourModal: DefaultModal,
}

export function setTourProps(props: Partial<ITourOptions>, defaultProps: ITourOptions = DefaultTourOptions): ITourOptions {
  const ctrlBtns = {...defaultProps.tourCtrlBtns, ...props.tourCtrlBtns},
  tourEvents = {...defaultProps.tourEvents, ...props.tourEvents},
  backdropOptions = {...defaultProps.tourBackdrop, ...props.tourBackdrop},
  tourModalOptions = {...defaultProps.tourModal, ...props.tourModal};
  return {tourCtrlBtns: ctrlBtns, tourEvents, tourModal: tourModalOptions, tourBackdrop: backdropOptions};
}
  