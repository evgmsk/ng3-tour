import { Component, Input, OnInit, OnDestroy} from '@angular/core';
import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';

import {StepTargetService} from '../../services/step-target.service';
import {TourService} from '../../services/tour.service';

@Component({
  selector: 'ng-tour-step-back',
  templateUrl: './tour-step-back.component.html',
  styleUrls: ['./tour-step-back.component.scss'],
})
export class TourStepBackComponent implements OnDestroy, OnInit {
  @Input() backgroundColor: string;
  @Input() stepBackSize: {[propName: string]: any};
  @Input() position: string;
  tourSubject = new Subject<any>();
  targetSubject = new Subject<any>();
  windowBackground: string;

  constructor(
    private readonly tourService: TourService,
    private readonly stepTargetService: StepTargetService) { }

  ngOnInit() {
    this.tourService.getStepSubject().pipe(
      takeUntil(this.tourSubject)
    ).subscribe((step: string) => {
      if (this.tourService.getTourStatus()) {
        this.windowBackground = this.backgroundColor;
      }
    });
    this.stepTargetService.getTargetSubject().pipe(
      takeUntil(this.tourSubject)
    ).subscribe((step: {stepName: string, target: Element}) => {
      if (step && this.tourService.getTourStatus()) {
        this.windowBackground = 'transparent';
      }
    });
  }
  ngOnDestroy() {
    this.tourSubject.next();
    this.targetSubject.next();
  }
}
