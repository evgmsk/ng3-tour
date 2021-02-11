import {BackdropProps, DefaultBackdropProps} from './backdrop.interface';
// import {StepOptions, DefaultOptions, RestStepOptions} from './step.interface';
import {DefaultModalProps, TourModalProps} from './tour-modal.interface';

export interface Tour {
    steps: TourStep[];
    backdropOptions?: BackdropProps;
    tourModalOptions?: TourModalProps;
    tourEvents?: TourEvents;
    ctrlBtns?: CtrlBtns;
    withoutLogs?: boolean;
  }

  export type TourEvent =  (props: {
    tourEvent: string,
    step?: number | string,
    history?: number[],
    tour?: Tour,
  }) => void;

  export interface CtrlBtns {
    prev?: {[propsName: string]: string} | string;
    next?: {[propsName: string]: string} | string;
    done?: {[propsName: string]: string} | string;
    [propsName: string]: any;
  }
 
  export interface StepEvents {
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
    tourEvents?: TourEvents;
    ctrlBtns?: CtrlBtns;
    withoutLogs?: boolean; 
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
  
  export interface TourEvents {
    tourStart?: TourEvent;
    tourEnd?: TourEvent;
    tourBreak?: TourEvent;
    next?: TourEvent;
    prev?: TourEvent;
  }
  export const defaultTranslation = {
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
  
  export const defaultTourEvent: TourEvent = (props) => {};
  
  export const TourDefaultEvents = {
    tourStart: defaultTourEvent,
    tourEnd: defaultTourEvent,
    tourBreak: defaultTourEvent,
    next: defaultTourEvent,
    prev: defaultTourEvent,
  };

  export const DefaultTourOptions: TourOptions = {
    ctrlBtns: defaultTranslation,
    tourEvents: TourDefaultEvents,
    backdropOptions: DefaultBackdropProps,
    tourModalOptions: DefaultModalProps,
    withoutLogs: false
  }

export function setTourProps(props: TourOptions, defaultProps: TourOptions = DefaultTourOptions): TourOptions {
  let ctrlBtns: CtrlBtns,
  tourEvents: TourEvents,
  backdropOptions: BackdropProps,
  tourModalOptions: TourModalProps,
  withoutLogs: boolean;
  ctrlBtns = {...defaultProps.ctrlBtns, ...props.ctrlBtns};
  tourEvents = {...defaultProps.tourEvents, ...props.tourEvents};
  backdropOptions = {...defaultProps.backdropOptions, ...props.backdropOptions};
  tourModalOptions = {...defaultProps.tourModalOptions, ...props.tourModalOptions};
  withoutLogs = props.withoutLogs !== undefined ? props.withoutLogs : defaultProps.withoutLogs;
  return {ctrlBtns, tourEvents, tourModalOptions, backdropOptions, withoutLogs};
}
  