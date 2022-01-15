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
  AfterViewInit,
  ViewChild,
} from '@angular/core';
import {isPlatformBrowser} from '@angular/common';
import {BehaviorSubject, Observable, Subject} from 'rxjs';
import {map, takeUntil, timeout} from 'rxjs/operators';

import {
  Ng3TourService,
  ITourStep,
  IModalEventHandlers,
  StepSubject,
  IModalPosition
} from '../../public_api';
import { IModalStyles } from '../interfaces/ng3-tour.interface';
import { IStepProps } from '../interfaces/ng3-tour.interface';

// @dynamic
@Component({
  selector: 'ng3-tour-template',
  templateUrl: './ng3-tour.component.html',
  styleUrls: ['./ng3-tour.component.scss'],
  encapsulation: ViewEncapsulation.None,
  exportAs: 'tour',
})

export class Ng3TourComponent implements OnInit, OnDestroy, IModalEventHandlers {
  className!: string;
  currentTarget: Element = null as unknown as Element;
  currentStep: ITourStep = null as unknown as ITourStep;
  stepTarget$ = null as unknown as Observable<StepSubject>;
  currentStep$ = new BehaviorSubject<StepSubject>(this.currentStep);
  isBrowser: boolean;
  modalElement: Element = null as unknown as Element;
  timeoutForCulc = 100;
  onDestroy = new Subject<null>();
  timeouts: ReturnType<typeof setTimeout>[] = [];
  @ViewChild('modal') modal!: ElementRef<HTMLDivElement>
  @Output() next: EventEmitter<any> = new EventEmitter();
  @Output() prev: EventEmitter<any> = new EventEmitter();
  @Output() done: EventEmitter<any> = new EventEmitter();
  @Output() break: EventEmitter<any> = new EventEmitter();

  constructor(
    private readonly tourService: Ng3TourService,
    // @dynamic
    @Inject(PLATFORM_ID) platformId: {}) {
      this.isBrowser = isPlatformBrowser(platformId);
      console.log('construct')
  }
  @HostListener('document:click', ['$event']) clickOutsideToClose($Event: Event): void {
    if (this.currentStep) {
      if (this.currentStep.modal!.closeOnClickOutside && !this.modal.nativeElement.contains($Event.target as Node)) {
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

  ngOnInit(): void {
    console.log('init')
    if (!this.isBrowser) {
      return;
    }
    this.stepTarget$ = this.tourService.getStepTargetStream().pipe(
      map((step: StepSubject) => {
        console.log('step: ', step)
        if (step?.stepTarget && this.tourService.getTourStatus()) {
          this.currentTarget = step.stepTarget;
          this.currentStep = this.tourService.getStepByName(step.stepName);
          if (isDevMode()) {
            console.log('currentStep in component: ', this.currentStep, this.modal.nativeElement);
          }
          this.culcTargetSize(step.stepTarget);
          this.resetClasses();
          this.currentStep.backdrop!.targetFrameColor = 'transparent';
          this.currentStep$.next(this.currentStep);
          this.getModal()
        } else {
          this.currentStep = null  as unknown as ITourStep;
        }
        return step;
      })
    )
    this.tourService.getStepsStream().pipe(
      takeUntil(this.onDestroy),
      map((step: StepSubject) => {
        this.currentStep = null  as unknown as ITourStep
        if (step) {
          this.resetClasses();
        }
        return step
      })
    ).subscribe();
    console.log('after init: ', this.currentStep, this.modal.nativeElement)
  }

  ngOnDestroy() {
    this.onDestroy.next(null);
    this.timeouts.forEach(i => clearTimeout(i));
  }
  
  private resetClasses(): void {
    const step = this.currentStep;
    const props = step?.modal || this.tourService.getLastStep().modal!;
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
    const resize = this.currentStep.backdrop?.targetFrameResize;
    this.currentStep.backdrop!.targetFrameSize = resize 
      ? this.tourService.resizeTarget(size, resize) 
      : size;
  }

  private defineStepPlacementToWindow(placement: string) {
    const modalSize = this.currentStep.modal?.modalSize
    if (!modalSize || !this.currentStep.modal) return
    this.currentStep.modal.modalStyles = this.currentStep.modal?.modalStyles || {} as IModalStyles
    const {modHeight, modWidth} = modalSize;
    const HI = this.currentStep['modalProps'].horisontalIndent;
    if (/^right-center$/i.test(placement)) {
      this.currentStep.modal.modalStyles.right = `${HI}px`;
      this.currentStep.modal.modalStyles.top = `${Math.round(window.innerHeight / 2 - modHeight / 2)}px`;
    } else if (/^left-center$/i.test(placement)) {
      this.currentStep.modal.modalStyles.left = `${HI}px`;
      this.currentStep.modal.modalStyles.top = `${Math.round(window.innerHeight / 2 - modHeight / 2)}px`;
    } else if (/^center$/i.test(placement)) {
      this.currentStep.modal.modalStyles.left = `${Math.round(window.innerWidth / 2 - modWidth / 2)}px`;
      this.currentStep.modal.modalStyles.top = `${Math.round(window.innerHeight / 2 - modHeight / 2)}px`;
    }
  }
  public getModal (attempts = 3) {
    this.modalElement = this.modal.nativeElement.querySelector('.tour-step-modal') as Element;
    if (!this.modalElement && attempts > 0) {
      console.error(attempts, this.modalElement, this.currentStep, this.modal.nativeElement.querySelector('.tour-step-wrapper'))
      attempts -= 1;
      this.timeouts[this.timeouts.length] = setTimeout(() => this.getModal(attempts), this.timeoutForCulc);
      return this.timeouts;
    }
    return this.defineModalPlacementToTarget();
  }

  private defineModalPlacementToTarget(modal: Element = this.modalElement) {
    if (!this.currentStep.modal || !this.currentStep.backdrop || !modal) {
      console.error('no current step modal options', this.currentStep, this.modalElement)
      return
    }
    const modalRect = modal.getBoundingClientRect();
    const  modHeight = Math.round(modalRect.height ? modalRect.height : modalRect.bottom - modalRect.top);
    const  modWidth = Math.round(modalRect.width ? modalRect.width : modalRect.right - modalRect.left);
    this.currentStep.modal.modalSize = {modWidth, modHeight};
    const {placement, scrollTo} = this.currentStep.modal;
    const {top = 0, bottom = 0, width = 0, left = 0, right = 0} = this.currentStep.backdrop!.targetFrameSize!;
    // console.error(modalRect, this.backdropOptions);
    if (!placement) {
      console.error('no placement')
      return
    }
    this.currentStep.modal.modalStyles = this.currentStep.modal.modalStyles || {} as IModalStyles
    const VI = this.currentStep.modal.verticalIndent || 0;
    const HI = this.currentStep.modal.horisontalIndent || 0;
    if (/^down$/i.test(placement!)) {
      this.currentStep.modal.modalStyles.top = `${bottom + VI}px`;
      this.currentStep.modal.modalStyles.left = `${Math.round(left - modWidth / 2)}px`;
    } else if (/^top$/i.test(placement)) {
      this.currentStep.modal.modalStyles.top = `${top  - modHeight - VI}px`;
      this.currentStep.modal.modalStyles.left = `${Math.round(left - modWidth / 2)}px`;
    } else if (/^left$/i.test(placement)) {
      this.currentStep.modal.modalStyles.top = `${top}px`;
      this.currentStep.modal.modalStyles.left = `${left - modWidth - VI}px`;
    } else if (/^right$/i.test(placement)) {
      this.currentStep.modal.modalStyles.top = `${top}px`;
      this.currentStep.modal.modalStyles.left = `${right + width + VI}px`;
    } else if (/^left-top$/i.test(placement)) {
      this.currentStep.modal.modalStyles.top = `${top - modHeight + HI}px`;
      this.currentStep.modal.modalStyles.left = `${left - width - VI}px`;
    } else if (/^right-top$/i.test(placement)) {
      this.currentStep.modal.modalStyles.top = `${top - modHeight + HI}px`;
      this.currentStep.modal.modalStyles.left = `${right + width + VI}px`;
    } else {
      this.defineStepPlacementToWindow(placement);
    }
    if (this.currentStep.modal.autofocus && modal) {
      this.setFocus(modal);
    }
    if (scrollTo) {
      this.scrollTo();
    }
    this.currentStep$.next(this.currentStep);
    setTimeout(() => {
      console.error('ModalStyles', this.currentTarget.getBoundingClientRect(), 
      this.currentStep.backdrop!.targetFrameSize)
    }, 10);
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
    if (!this.currentStep.modal || !this.currentStep.backdrop) {
      console.error('no current step modal options')
      return
    }
    const {placement, modalStyles} = this.currentStep.modal;
    const {position} = modalStyles!
    const {left = 0, top = 0, bottom = 0} = this.currentStep.backdrop.targetFrameSize!;
    const HI = this.currentStep.modal.horisontalIndent!;
    const Top = placement !== 'top' ? top - 2 * HI : top - bottom - HI;
    const behavior = this.currentStep.modal.smoothScroll ? 'smooth' : 'auto';
    if (position === 'absolute') {
      document.documentElement.scroll({top: Top, left, behavior});
    } else {
      document.documentElement.scroll({top: 0, left: 0, behavior});
    }
  }
  public onNext(event: Event) {
    this.next.emit({
      stepEvent: 'next',
      index: this.currentStep.index! + 1,
      history: this.tourService.getHistory(),
    });
    this.tourService.nextStep();
  }
  public onPrev(event: Event) {
    this.prev.emit({
      stepEvent: 'prev',
      index: this.currentStep.index! - 1,
      history: this.tourService.getHistory(),
    });
    this.tourService.prevStep();
  }
  public onClose(event: Event) {
    if (this.currentStep.index !== this.currentStep['total'] - 1) {
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
