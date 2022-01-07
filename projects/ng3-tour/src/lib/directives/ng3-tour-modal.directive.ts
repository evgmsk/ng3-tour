import { Directive, Input, Inject, PLATFORM_ID, AfterViewInit, OnDestroy, ElementRef, isDevMode} from '@angular/core';
import {isPlatformBrowser} from '@angular/common';
import {Subject} from 'rxjs';
import {map, takeUntil} from 'rxjs/operators';

import {Ng3TourService, StepSubject} from '../../public_api';

// @dynamic
@Directive({
  selector: '[ng3TourStep]'
})
export class Ng3TourModalDirective implements AfterViewInit, OnDestroy {
  @Input('ng3TourStep') name: string;
  private readonly onDestroy = new Subject<any>();
  isBrowser: boolean;
  delay: number;
  timeout: ReturnType<typeof setTimeout>;
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
          this.delay = step.delay;
          step.stepTarget = this.elemRef.nativeElement;
          this.timeout = setTimeout(() => this.tour.getStepTargetStream().next(step), this.delay);
          if (isDevMode()) {
            console.log('Step in directive: ', step);
          }
        }
        return step;
      }
    )).subscribe();
  }
  ngOnDestroy() {
    this.onDestroy.next();
    clearTimeout(this.timeout);
  }
}
