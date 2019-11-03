import {
    Directive,
    Input,
    Output,
    EventEmitter,
    OnInit,
    Inject,
    PLATFORM_ID,
    HostListener
} from '@angular/core';
import {isPlatformBrowser} from '@angular/common';

import {TourService} from '../services/tour.service';
// @dynamic
@Directive({
    selector: '[tourEvent]',
})
export class TourEventsDirective implements OnInit {
    @Input('tourEvent') eventType: string; // possible values 'next', 'prev', 'break', 'done'
    isBrowser: boolean;
    @Output() next: EventEmitter<any> = new EventEmitter();
    @Output() prev: EventEmitter<any> = new EventEmitter();
    @Output() done: EventEmitter<any> = new EventEmitter();
    @Output() break: EventEmitter<any> = new EventEmitter();
    handler: () => void;
    constructor(
        private readonly tourService: TourService,
        // @dynamic
        @Inject(PLATFORM_ID) platformId: {}) {
        this.isBrowser = isPlatformBrowser(platformId);
    }
    ngOnInit() {
        if (!this.isBrowser) {
            return;
        }
        if (this.eventType === 'next') {
            this.handler = () => {
                this.next.emit(this.tourService.getLastStepIndex() + 1);
                this.tourService.nextStep();
            };
        }
        if (this.eventType === 'prev') {
            this.handler = () => {
                this.next.emit(this.tourService.getLastStepIndex() - 1);
                this.tourService.prevStep();
            };
        }
        if (this.eventType === 'close') {
            this.handler = () => {
                if (this.tourService.getLastStepIndex() + 1 === this.tourService.getTotal()) {
                    this.done.emit('done');
                } else {
                    this.break.emit(this.tourService.getLastStepIndex());
                }
                this.tourService.stopTour();
            };
        }
    }
    @HostListener('click', ['$event']) onClick(event: Event) {
        this.handler();
    }
}
