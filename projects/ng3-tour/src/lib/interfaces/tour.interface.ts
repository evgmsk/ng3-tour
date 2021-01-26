import {BackdropProps} from './backdrop.interface';
import {Options} from './step.interface'

export interface Tour {
    steps: TourStep[];
    tourOptions?: Options;
    withoutLogs?: boolean;
    tourEvents?: TourEvents;
    ctrlBtns?: CtrlBtns;
  }
  export interface CtrlBtns {
    prev?: {[propsName: string]: any};
    next?: {[propsName: string]: any};
    done?: {[propsName: string]: any};
    [propsName: string]: any;
  }
  export interface TourStep {
    stepName: string;
    route?: string;
    index?: number;
    title?: string | {[propName: string]: any};
    description?: string | {[propName: string]: any};
    options?: Options;
    ctrlBtns?: CtrlBtns;
    [propName: string]: any;
  }

  export type TourEvent =  (props: {
    tourEvent: string,
    step?: number | string,
    history?: number[],
    tour?: Tour,
  }) => void;

 
  
  export interface TourEvents {
    tourStart?: TourEvent;
    tourEnd?: TourEvent;
    tourBreak?: TourEvent;
    next?: TourEvent;
    prev?: TourEvent;
  }
  
  export interface StepEvents {
    onNext($event: Event): void;
    onPrev($event: Event): void;
    onClose($event: Event): void;
  }
  