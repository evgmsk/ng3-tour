import { Directive, Input, Inject, PLATFORM_ID, AfterViewInit, OnDestroy, ElementRef} from '@angular/core';
import {isPlatformBrowser} from '@angular/common';
import {Subscription, Subject} from 'rxjs';
import {map, takeUntil, delay} from 'rxjs/operators';

import {StepTargetService} from '../services/step-target.service';
import {TourService} from '../services/tour.service';
import {Steps} from '../interfaces/step.interface';

// @dynamic
@Directive({
  selector: '[ngTourStep]'
})
export class TourStepDirective implements AfterViewInit, OnDestroy {
  @Input('ngTourStep') name: string;
  private readonly onDestroy = new Subject<any>();
  subscription: Subscription;
  isBrowser: boolean;
  timeout: any;
  Delay: number;
  constructor(
    private elemRef: ElementRef,
    private readonly tour: TourService,
    private readonly stepTarget: StepTargetService,
    
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
      map((step: Steps) => {
        if (!step.stepName || this.name !== step.stepName) {
          return step;
        } else {
          this.Delay = this.tour.isRouteChanged()
            ? this.tour.getStepByName(step.stepName).options.delay
            : 0;
          step.stepTarget = this.elemRef.nativeElement;
          // this.stepTarget.setTargetSubject({target, step})
          return step;
        }
      }
    ), delay(this.Delay)).subscribe();
  }
  ngOnDestroy() {
    this.onDestroy.next();
    clearTimeout(this.timeout);
  }
}
