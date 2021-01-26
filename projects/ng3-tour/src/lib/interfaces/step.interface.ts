import {BackdropProps, DefaultBackdropProps} from './backdrop.interface'
import { TourModalPosition,  TourModalProps, DefaultModalProps } from './tour-modal.interface';

export interface Steps {
  stepName: string;
  stepTarget?: Element;
}
export interface Options {
  backdropProps: BackdropProps;
  modalProps: TourModalProps;
  customTemplate?: boolean;  
  animatedStep?: boolean;
  smoothScroll?: boolean;
  scrollTo?: boolean;
  delay?: number;
  
  closeOnClickOutside?: boolean;
}

export const DefaultOptions: Options = {
  backdropProps: DefaultBackdropProps,
  delay: 1000,
  animatedStep: true,
  smoothScroll: true,
  scrollTo: true,
  modalProps: DefaultModalProps
};


export function setTourProps(props: Options): Options {
  let {modalProps, backdropProps, ...restProps} = props;
  modalProps = {...DefaultModalProps, ...modalProps};
  backdropProps = {...DefaultBackdropProps, ...backdropProps};
  return {
    ...DefaultOptions, ...restProps, ...modalProps, ...backdropProps
  }

    // this.className = className;
    // this.placement = placement;
    // this.arrowToTarget = arrowToTarget;
    // this.backdropColor = themeColor;
    // this.opacity = opacity;
    // this.backdrop = backdrop;
    // this.customTemplate = customTemplate;
    // this.withoutCounter = withoutCounter;
    // this.withoutPrev = withoutPrev;
    // this.continueIfTargetAbsent = continueIfTargetAbsent;
    // this.stepTargetResize = stepTargetResize;
    // this.maxHeight = maxHeight;
    // this.maxWidth = maxWidth;
    // this.minHeight = minHeight;
    // this.minWidth = minWidth;
    // this.delay = delay;
    // this.animatedStep = animatedStep;
    // this.smoothScroll = smoothScroll;
    // this.scrollTo = scrollTo;
    // this.fixed = fixed;
    // this.autofocus = autofocus;
    // this.closeOnClickOutside = closeOnClickOutside
}