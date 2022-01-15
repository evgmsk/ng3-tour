import { Directive, Input, Inject, PLATFORM_ID, AfterViewInit, OnDestroy, ElementRef, isDevMode} from '@angular/core';
import {isPlatformBrowser} from '@angular/common';
import {Subject} from 'rxjs';
import {map, takeUntil} from 'rxjs/operators';

import {Ng3TourService, StepSubject} from '../../public_api';
import { TimeInterval } from 'rxjs/internal/operators/timeInterval';

// @dynamic
@Directive({
  selector: '[ng3TourStep]'
})
export class Ng3TourModalDirective implements AfterViewInit, OnDestroy {
  @Input('ng3TourStep') name!: string;
  private readonly onDestroy = new Subject<any>();
  isBrowser: boolean;
  timeout!: ReturnType<typeof setTimeout>;
  constructor(
    private elemRef: ElementRef,
    private readonly tour: Ng3TourService,   
    // @dynamic
    @Inject(PLATFORM_ID) platformId: {}) {
      this.isBrowser = isPlatformBrowser(platformId);
  }

  ngAfterViewInit() {
    if (!this.isBrowser) {
      return;
    }
    this.tour.getStepsStream().pipe(
      takeUntil(this.onDestroy),
      map((step: StepSubject) => {
        if (step && step.stepName && this.name === step.stepName) {
          step.stepTarget = this.elemRef.nativeElement;
          
          if (isDevMode()) {
            console.error('Step in directive: ', step, this.elemRef.nativeElement)
            if (!step.stepTarget) {
              console.error('target absent', this.elemRef);
            } else {
              console.log(this.tour.getSizeAndPosition(step.stepTarget!))
            }
          }
          step.targetSize = this.tour.getSizeAndPosition(step.stepTarget!)
          this.timeout = setTimeout(() => this.tour.getStepTargetStream().next(step), step.delay || 0);
      
        }
        return step;
      }
    )).subscribe();
  }
  ngOnDestroy() {
    this.onDestroy.next(null);
    clearTimeout(this.timeout);
  }
}
