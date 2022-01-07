import {BackdropProps, DefaultBackdropProps} from './ng3-tour-backdrop.interface';
// import {StepOptions, DefaultOptions, RestStepOptions} from './step.interface';
import {DefaultModalProps, TourModalProps} from './ng3-tour-modal.interface';

export interface Tour {
    steps: TourStep[];
    backdropOptions?: BackdropProps;
    tourModalOptions?: TourModalProps;
    tourEvents?: TourEventHandlers;
    ctrlBtns?: CtrlBtns;
    withoutLogs?: boolean;
  }

  export interface CtrlBtns {
    prev?: {[propsName: string]: string} | string;
    next?: {[propsName: string]: string} | string;
    done?: {[propsName: string]: string} | string;
    [propsName: string]: any;
  }
 
  export interface ModalEventHandlers {
    onNext($event: Event): void;
    onPrev($event: Event): void;
    onClose($event: Event): void;
  }
  
  export interface TourStep {
    stepName: string;
    route?: string;
    index?: number;
    title?: string | {[propName: string]: any};
    description?: string | {[propName: string]: any};
    backdropOptions?: BackdropProps;
    tourModalOptions?: TourModalProps;
    ctrlBtns?: CtrlBtns;
    [propName: string]: any;
  }

  export interface TourOptions {
    backdropOptions?: BackdropProps;
    tourModalOptions?: TourModalProps;
    tourEvents?: TourEventHandlers;
    ctrlBtns?: CtrlBtns;
  }

  export interface StepOptions {
    backdropOptions?: BackdropProps;
    tourModalOptions?: TourModalProps;
  }

  export interface StepSubject {
    stepName: string;
    delay?: number;
    stepTarget?: Element;
  }

  export type TourEventHandler =  (props: {
    tourEvent: string,
    step?: number | string,
    history?: number[],
    tour?: Tour,
  }) => void;

  export interface TourEventHandlers {
    tourStart?: TourEventHandler;
    tourEnd?: TourEventHandler;
    tourBreak?: TourEventHandler;
    next?: TourEventHandler;
    prev?: TourEventHandler;
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
  
  export const DefaulttourEventHandlers = {
    tourStart: DefaultTourEventHandler,
    tourEnd: DefaultTourEventHandler,
    tourBreak: DefaultTourEventHandler,
    next: DefaultTourEventHandler,
    prev: DefaultTourEventHandler,
  };

  export const DefaultTourOptions: TourOptions = {
    ctrlBtns: ButtonsDefaultTranslation,
    tourEvents: DefaulttourEventHandlers,
    backdropOptions: DefaultBackdropProps,
    tourModalOptions: DefaultModalProps,
  }

export function setTourProps(props: TourOptions, defaultProps: TourOptions = DefaultTourOptions): TourOptions {
  let ctrlBtns: CtrlBtns,
  tourEvents: TourEventHandlers,
  backdropOptions: BackdropProps,
  tourModalOptions: TourModalProps;
  ctrlBtns = {...defaultProps.ctrlBtns, ...props.ctrlBtns};
  tourEvents = {...defaultProps.tourEvents, ...props.tourEvents};
  backdropOptions = {...defaultProps.backdropOptions, ...props.backdropOptions};
  tourModalOptions = {...defaultProps.tourModalOptions, ...props.tourModalOptions};
  return {ctrlBtns, tourEvents, tourModalOptions, backdropOptions};
}
  