import {
  Component,
  OnInit,
  Output,
  EventEmitter,
  HostListener,
  Inject,
  PLATFORM_ID,
  OnDestroy,
  ViewChild,
  ViewEncapsulation,
  ElementRef,
} from '@angular/core';
import {isPlatformBrowser} from '@angular/common';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';

import {TourService} from '../services/tour.service';
import {TourStep, StepEvents} from '../interfaces/tour.interface';
import {BackdropProps} from '../interfaces/backdrop.interface';
import {TourModalProps} from '../interfaces/tour-modal.interface'

const StartIndent = 500;

// @dynamic
@Component({
  selector: 'ng-tour-step-template',
  templateUrl: './tour-step.component.html',
  styleUrls: ['./tour-step.component.scss'],
  encapsulation: ViewEncapsulation.None,
  exportAs: 'steps$',
})

export class TourStepComponent implements OnInit, OnDestroy, StepEvents {
  currentTarget: Element = null;
  currentStep: TourStep = null;
  backdropProps: BackdropProps;
  modalProps: TourModalProps;
  steps$: Observable<TourStep> = null;
  @ViewChild('modal') modal: ElementRef;
  modalSizes: any;
  isBrowser: boolean;
  
  @Output() next: EventEmitter<any> = new EventEmitter();
  @Output() prev: EventEmitter<any> = new EventEmitter();
  @Output() done: EventEmitter<any> = new EventEmitter();
  @Output() break: EventEmitter<any> = new EventEmitter();

  constructor(
    private readonly tourService: TourService,
    private elem: ElementRef,
    // private ref: ViewContainerRef,
    // @dynamic
    @Inject(PLATFORM_ID) platformId: {}) {
      this.isBrowser = isPlatformBrowser(platformId);
  }
  @HostListener('document:click', ['$event']) clickOutsideToClose($Event: Event): void {
    if (this.currentStep) {
      if (this.currentStep.options.closeOnClickOutside && !this.elem.nativeElement.contains($Event.target)) {
        this.onClose($Event);
      }
    }       
  }
  @HostListener('window:resize', ['$event']) onResize(event: Event) {
    if (this.modalProps && this.currentStep) {
      this.saveTarget(this.currentTarget);
      this.defineModalPlacementToTarget();
    }
  }
  ngOnInit() {
    if (!this.isBrowser) {
      return;
    }
    this.modalProps.position = {top: -StartIndent, left: -StartIndent};
    // this.subscribeToStepsStream();
    this.steps$ = this.tourService.getStepsStream().pipe(
      map( step => {
        if (!step.stepTarget) {
          this.currentStep = null;
        }
        if (step && this.tourService.getTourStatus) {
          this.currentTarget = step.stepTarget;
          this.currentStep = this.tourService.getStepByName(step.stepName);
          this.saveStepData();
          this.saveTarget(step.stepTarget);
        }
        return step;
      }),
    );
  }
  ngOnDestroy() {
    // this.onDestroy.next();
    // this.timeouts.forEach(i => clearTimeout(i));
  }
  
  // private subscribeToStepsStream() {
  //   this.tourService.getStepsStream().pipe(
  //     takeUntil(this.onDestroy),
  //     map(step => {
  //       if (!step) {
  //         this.currentStep = null;
  //         return step;
  //       }
       
  //       const {themeColor} = (this.currentStep && this.currentStep.options) || this.tourService.getStepByIndex().options;
  //       this.currentStep = null;
  //       this.resetClasses();
  //       const {delay} = this.tourService.getStepByName(step).options;
  //       this.targetBackground = themeColor;
  //       if (this.tourService.isRouteChanged()) {
  //         this.timeouts[this.timeouts.length] = setTimeout(() => this.checkTarget(step), delay + 100);
  //       } else {
  //         this.timeouts[this.timeouts.length] = setTimeout(() => this.checkTarget(step), 100);
  //       }
  //       return step;
  //     })
  //   ).subscribe();
  // }
  // private checkTarget(step: string, times = 2) {
  //   if (!step || !this.tourService.getTourStatus()) {
  //     return;
  //   }
  //   const delay = this.tourService.getStepByName(step).options.delay;
  //   const target = document.querySelector(`[ngtourstep=${step}]`);
  //   if (times && this.tourService.isRouteChanged() && !target) {
  //     this.timeouts[this.timeouts.length] = setTimeout(() => this.checkTarget(step, times - 1), delay);
  //   } else if (!target) {
  //     console.warn(`Target is missed for step ${step}`);
  //     if (this.tourService.getStepByName(step).options.continueIfTargetAbsent) {
  //       const index = this.tourService.getStepByName(step).index + 1;
  //       if (index < this.tourService.getLastStep().total) {
  //           this.tourService.nextStep();
  //       } else {
  //         console.warn(`The tour is stopped because of no targets is found  for step ${step} and next ones`);
  //         this.tourService.stopTour();
  //         this.stepTargetService.setTargetSubject(null);
  //       }
  //     }
  //   }
  // }
  private resetClasses(): void {
    const step = this.currentStep;
    console.log(step.options.modalProps.placement)
    const source = (step && step.options) || this.tourService.getStepByIndex().options;
    const {animatedStep, modalProps: {arrowToTarget,  placement, className}} = source;
    const arrowClass = arrowToTarget ? 'with-arrow' : '';
    const animationClass = animatedStep
      ? (step ? 'animation-on' : 'fade-on')
      : (step ? '' : 'fade-on');
    this.modalProps.className = `${arrowClass} ${className} pos-${placement} ${animationClass}`.trim();
    if (step) {
      this.modalProps.className +=  ` ${step.stepName}`
    }
  }
  private saveTarget(target: Element): void {
    const size = this.tourService.getSizeAndPosition(target);
    const resize = this.currentStep.options.backdropProps.targetWindowResize;
    this.backdropProps.targetWindowSize = this.tourService.resizeTarget(size, resize);
    this.defineModalPlacementToTarget();
  }
  private saveStepData(): void {
    this.resetClasses();
    this.backdropProps.targetWindowColor = 'transparent';
  }

  private defineStepPlacementToWindow(placement: string, modalWidth: number) {
    const HI = this.modalProps.horisontalIndent;
    if (/^right-center$/i.test(placement)) {
      this.modalProps.position = {
        right: HI,
        top: Math.round(window.innerHeight / 2 - this.modalSizes.height / 2)
      };
    } else if (/^left-center$/i.test(placement)) {
      this.modalProps.position= {
        left: HI,
        top: Math.round(window.innerHeight / 2 - this.modalSizes.height / 2)
      };
    } else if (/^center$/i.test(placement)) {
      this.modalProps.position = {
        left: Math.round(window.innerWidth / 2 - modalWidth / 2),
        top: Math.round(window.innerHeight / 2 - this.modalSizes.height / 2)
      };
    }
  }
  private defineModalPlacementToTarget() {
    const modal = this.elem.nativeElement.querySelector('.tour-step-modal');

    this.modalSizes = modal.getBoundingClientRect();
    // const {height, width, bottom, top} = this.modalSizes;
    this.modalSizes.height = Math.round(this.modalSizes.height ? this.modalSizes.height : this.modalSizes.bottom - this.modalSizes.top);
    const ModHeight = this.modalSizes.height
    const ModWidth = Math.round(this.modalSizes.width ? this.modalSizes.width : this.modalSizes.right - this.modalSizes.left);
    const {modalProps: {placement}, scrollTo} = this.currentStep.options;
    const {top, bottom, width, left, right} = this.backdropProps.targetWindowSize;
    const VI = this.modalProps.verticalIndent;
    const HI = this.modalProps.horisontalIndent;
    if (/^down$/i.test(placement)) {
      this.modalProps.position = {top: bottom + VI, left: Math.round(left - ModWidth / 2)};
    } else if (/^top$/i.test(placement)) {
      this.modalProps.position = {top: top  - ModHeight - VI, left: Math.round(left - ModWidth / 2)};
    } else if (/^left$/i.test(placement)) {
      this.modalProps.position = {left: left - ModWidth - VI, top};
    } else if (/^right$/i.test(placement)) {
      this.modalProps.position = {left: right + width + VI, top};
    } else if (/^left-top$/i.test(placement)) {
      this.modalProps.position = {
        left: left - width - VI, top: top - ModHeight + HI
      };
    } else if (/^right-top$/i.test(placement)) {
      this.modalProps.position = {
        left: right + width + VI, top: top - ModHeight + HI
      };
    } else {
      this.defineStepPlacementToWindow(placement, ModWidth);
    }
    if (this.currentStep.options.modalProps.autofocus) {
      this.setFocus(modal);
    }
    if (scrollTo) {
      this.scrollTo();
    }
  }
  
  private setFocus(modal: Element) {
    const nextBtn = modal.querySelector('.tour-btn-next') as HTMLElement;
    const endBtn = modal.querySelector('.tour-btn-done') as HTMLElement;
    if (nextBtn) {
      nextBtn.focus();
    } else if (endBtn) {
      endBtn.focus();
    }
  }
  private scrollTo() {
    const {placement, fixed} = this.currentStep.options.modalProps;
    const position = this.modalProps.position;
    const left = this.backdropProps.targetWindowSize.left;
    const HI = this.modalProps.horisontalIndent;
    const top = placement !== 'top' ? position.top - 2 * HI : position.top - position.bottom - HI;
    const behavior = this.currentStep.options.smoothScroll ? 'smooth' : 'auto';
    if (!fixed) {
      document.documentElement.scroll({top, left, behavior});
    } else {
      document.documentElement.scroll({top: 0, left: 0, behavior});
    }
  }
  public onNext(event: Event) {
    this.next.emit({
      stepEvent: 'next',
      index: this.currentStep.index + 1,
      history: this.tourService.getHistory(),
    });
    this.tourService.nextStep();
  }
  public onPrev(event: Event) {
    this.prev.emit({
      stepEvent: 'prev',
      index: this.currentStep.index - 1,
      history: this.tourService.getHistory(),
    });
    this.tourService.prevStep();
  }
  public onClose(event: Event) {
    if (this.currentStep.index !== this.currentStep.total - 1) {
      this.break.emit({
        stepEvent: 'break',
        index: this.currentStep.index,
        history: this.tourService.getHistory(),
      });
    } else {
      this.done.emit({
        stepEvent: 'done',
        index: this.currentStep.index,
        history: this.tourService.getHistory(),
      });
    }
    this.tourService.stopTour();
  }
}
