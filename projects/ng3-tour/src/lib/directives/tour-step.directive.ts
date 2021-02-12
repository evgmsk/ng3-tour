import { Directive, Input, Inject, PLATFORM_ID, AfterViewInit, OnDestroy, ElementRef, isDevMode} from '@angular/core';
import {isPlatformBrowser} from '@angular/common';
import {Subscription, Subject, TimeoutError} from 'rxjs';
import {map, takeUntil, delay} from 'rxjs/operators';

import {TourService} from '../services/tour.service';
import {StepSubject} from '../interfaces/tour.interface';

// @dynamic
@Directive({
  selector: '[ngTourStep]'
})
export class TourStepDirective implements AfterViewInit, OnDestroy {
  @Input('ngTourStep') name: string;
  private readonly onDestroy = new Subject<any>();
  // subscription: Subscription;
  isBrowser: boolean;
  delay: number;
  timeout: ReturnType<typeof setTimeout>;
  constructor(
    private elemRef: ElementRef,
    private readonly tour: TourService,   
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
