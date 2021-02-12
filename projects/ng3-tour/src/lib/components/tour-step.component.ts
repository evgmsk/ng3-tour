import {
  Component,
  OnInit,
  Output,
  EventEmitter,
  HostListener,
  Inject,
  PLATFORM_ID,
  OnDestroy,
  ViewEncapsulation,
  ElementRef,
  isDevMode,
} from '@angular/core';
import {isPlatformBrowser} from '@angular/common';
import {Observable, Subject} from 'rxjs';
import {map, takeUntil, timeout} from 'rxjs/operators';

import {
  TourService,
  TourStep,
  StepEvents,
  StepSubject
} from '../../public_api';

// @dynamic
@Component({
  selector: 'ng-tour-step-template',
  templateUrl: './tour-step.component.html',
  styleUrls: ['./tour-step.component.scss'],
  encapsulation: ViewEncapsulation.None,
  exportAs: 'tour',
})

export class TourStepComponent implements OnInit, OnDestroy, StepEvents {
  className: string;
  currentTarget: Element = null;
  currentStep: TourStep = null;
  steps$: Observable<StepSubject> = null;
  isBrowser: boolean;
  modalElement: Element = null;
  timeoutForCulc = 100;
  onDestroy = new Subject<null>();
  timeouts: ReturnType<typeof setTimeout>[] = [];
  
  @Output() next: EventEmitter<any> = new EventEmitter();
  @Output() prev: EventEmitter<any> = new EventEmitter();
  @Output() done: EventEmitter<any> = new EventEmitter();
  @Output() break: EventEmitter<any> = new EventEmitter();

  constructor(
    private readonly tourService: TourService,
    private elem: ElementRef,
    // @dynamic
    @Inject(PLATFORM_ID) platformId: {}) {
      this.isBrowser = isPlatformBrowser(platformId);
  }
  @HostListener('document:click', ['$event']) clickOutsideToClose($Event: Event): void {
    if (this.currentStep) {
      if (this.currentStep.tourModalOptions.closeOnClickOutside && !this.elem.nativeElement.contains($Event.target)) {
        this.onClose($Event);
      }
    }       
  }
  @HostListener('window:resize', ['$event']) onResize(event: Event) {
    if (this.currentStep) {
      this.culcTargetSize(this.currentTarget);
      this.getModal();
    }
  }
  ngOnInit() {
    if (!this.isBrowser) {
      return;
    }
    this.steps$ = this.tourService.getStepTargetStream().pipe(
      map((step: StepSubject) => {
        if (step?.stepTarget && this.tourService.getTourStatus()) {
          this.currentTarget = step.stepTarget;
          this.currentStep = this.tourService.getStepByName(step.stepName);
          if (isDevMode()) {
            console.log('currentStep in component', this.currentStep, step.stepTarget);
          }
          this.culcTargetSize(step.stepTarget);
          this.resetClasses();
          this.currentStep.backdropOptions.targetWindowColor = 'transparent';
          this.timeouts[this.timeouts.length] = setTimeout(() => this.getModal(), this.timeoutForCulc);
        } else {
          this.currentStep = null;
        }
        return step;
      })
    )
    this.tourService.getStepsStream().pipe(
      takeUntil(this.onDestroy),
      map((step: StepSubject) => {
        if (step) {
          this.currentStep = null
          this.resetClasses();
        }
        return step
      })
    ).subscribe();
  }
  ngOnDestroy() {
    this.onDestroy.next(null);
    this.timeouts.forEach(i => clearTimeout(i));
  }
  
  private resetClasses(): void {
    const step = this.currentStep;
    const props = step?.tourModalOptions || this.tourService.getLastStep().tourModalOptions;
    const {animatedStep, arrowToTarget,  placement, className} = props;
    const arrow = arrowToTarget ? 'with-arrow' : '';
    if (step) {
      const animation = animatedStep ? 'animation-on' : '';
      this.className = `${arrow} pos-${placement} ${animation} ${step.stepName} ${className}`.trim();
    } else {
      const animation = 'fade-on';
      this.className = `${arrow} pos-${placement} ${animation} ${className}`.trim();
    }
    
  }

  private culcTargetSize(target: Element): void {
    const size = this.tourService.getSizeAndPosition(target);
    const resize = this.currentStep.backdropOptions.targetWindowResize;
    this.currentStep.backdropOptions.targetWindowSize = resize ? this.tourService.resizeTarget(size, resize) : size;
  }

  private defineStepPlacementToWindow(placement: string) {
    const {modHeight, modWidth} = this.currentStep.tourModalOptions.modalSize;
    const HI = this.currentStep.modalProps.horisontalIndent;
    if (/^right-center$/i.test(placement)) {
      this.currentStep.tourModalOptions.modalStyles.right = `${HI}px`;
      this.currentStep.tourModalOptions.modalStyles.top = `${Math.round(window.innerHeight / 2 - modHeight / 2)}px`;    
    } else if (/^left-center$/i.test(placement)) {
      this.currentStep.tourModalOptions.modalStyles.left = `${HI}px`;
      this.currentStep.tourModalOptions.modalStyles.top = `${Math.round(window.innerHeight / 2 - modHeight / 2)}px`;
    } else if (/^center$/i.test(placement)) {
      this.currentStep.tourModalOptions.modalStyles.left = `${Math.round(window.innerWidth / 2 - modWidth / 2)}px`;
      this.currentStep.tourModalOptions.modalStyles.top = `${Math.round(window.innerHeight / 2 - modHeight / 2)}px`;
    }
  }
  public getModal (attempts = 3) {
    this.modalElement = this.elem.nativeElement.querySelector('.tour-step-modal');;
    if (!this.modalElement && attempts > 0) {
      attempts -= 1;
      this.timeouts[this.timeouts.length] = setTimeout(() => this.getModal(attempts), this.timeoutForCulc);
      return this.timeouts;
    }
    return this.defineModalPlacementToTarget();
  }
  private defineModalPlacementToTarget(modal: Element = this.modalElement) {
    const modalRect = modal.getBoundingClientRect();
    let modWidth: number, modHeight: number;
    if (modalRect) {
      modHeight = Math.round(modalRect.height ? modalRect.height : modalRect.bottom - modalRect.top);
      modWidth = Math.round(modalRect.width ? modalRect.width : modalRect.right - modalRect.left);
      this.currentStep.tourModalOptions.modalSize = {modWidth, modHeight};
    }
    const {placement, scrollTo} = this.currentStep.tourModalOptions;
    const {top, bottom, width, left, right} = this.currentStep.backdropOptions.targetWindowSize;
    const VI = this.currentStep.tourModalOptions.verticalIndent;
    const HI = this.currentStep.tourModalOptions.horisontalIndent;
    if (/^down$/i.test(placement)) {
      this.currentStep.tourModalOptions.modalStyles.top = `${bottom + VI}px`;
      this.currentStep.tourModalOptions.modalStyles.left = `${Math.round(left - modWidth / 2)}px`;
    } else if (/^top$/i.test(placement)) {
      this.currentStep.tourModalOptions.modalStyles.top = `${top  - modHeight - VI}px`;
      this.currentStep.tourModalOptions.modalStyles.left = `${Math.round(left - modWidth / 2)}px`;
    } else if (/^left$/i.test(placement)) {
      this.currentStep.tourModalOptions.modalStyles.top = `${top}px`;
      this.currentStep.tourModalOptions.modalStyles.left = `${left - modWidth - VI}px`;
    } else if (/^right$/i.test(placement)) {
      this.currentStep.tourModalOptions.modalStyles.top = `${top}px`;
      this.currentStep.tourModalOptions.modalStyles.left = `${right + width + VI}px`;
    } else if (/^left-top$/i.test(placement)) {
      this.currentStep.tourModalOptions.modalStyles.top = `${top - modHeight + HI}px`;
      this.currentStep.tourModalOptions.modalStyles.left = `${left - width - VI}px`;
    } else if (/^right-top$/i.test(placement)) {
      this.currentStep.tourModalOptions.modalStyles.top = `${top - modHeight + HI}px`;
      this.currentStep.tourModalOptions.modalStyles.left = `${right + width + VI}px`;
    } else {
      this.defineStepPlacementToWindow(placement);
    }
    if (this.currentStep.tourModalOptions.autofocus && modal) {
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
    const {placement, modalStyles: {position}} = this.currentStep.tourModalOptions;
    const {left, top, bottom} = this.currentStep.backdropOptions.targetWindowSize;
    const HI = this.currentStep.tourModalOptions.horisontalIndent;
    const Top = placement !== 'top' ? top - 2 * HI : top - bottom - HI;
    const behavior = this.currentStep.tourModalOptions.smoothScroll ? 'smooth' : 'auto';
    if (position === 'absolute') {
      document.documentElement.scroll({top: Top, left, behavior});
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
