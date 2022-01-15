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

import {Ng3TourService, IStepEventProps} from '../../public_api';
// @dynamic
@Directive({
    selector: '[modalEvent]',
})
export class Ng3TourEventDirective implements OnInit {
    @Input('modalEvent') eventType!: string; // possible values 'next', 'prev', 'close'
 // possible values 'next', 'prev', 'close'
    isBrowser: boolean;

    @Output() next: EventEmitter<IStepEventProps> = new EventEmitter();
    @Output() prev: EventEmitter<IStepEventProps> = new EventEmitter();
    @Output() done: EventEmitter<IStepEventProps> = new EventEmitter();
    @Output() break: EventEmitter<IStepEventProps> = new EventEmitter();
    handler!: () => void;
    constructor(
        private readonly tourService: Ng3TourService,
        // @dynamic
        @Inject(PLATFORM_ID) platformId: {}) {
        this.isBrowser = isPlatformBrowser(platformId);
    }
    ngOnInit() {
        if (!this.isBrowser) {
            return;
        }
        if (this.eventType === 'next') {
           this.handleNext();
        }
        if (this.eventType === 'prev') {
            this.handlePrev();
        }
        if (this.eventType === 'close') {
            this.handleClose();
        }
    }
    @HostListener('click', ['$event']) onClick(event: Event) {
        this.handler();
    }
    handleNext() {
        return this.handler = () => {
            this.next.emit({
                tourEvent: 'next',
                index: this.tourService.getLastStep().index! + 1,
                history: this.tourService.getHistory()
            });
            this.tourService.nextStep();
        };
    }
    handlePrev() {
        return this.handler = () => {
            this.prev.emit({
                tourEvent: 'prev',
                index: this.tourService.getLastStep().index! - 1,
                history: this.tourService.getHistory()
            });
            this.tourService.prevStep();
        };
    }
    handleClose() {
        return this.handler = () => {
            if (this.tourService.getLastStep().index! + 1 === this.tourService.getLastStep()['total']) {
                this.done.emit({
                    tourEvent: 'done',
                    index: this.tourService.getLastStep().index!,
                    history: this.tourService.getHistory()
                });
            } else {
                this.break.emit({
                    tourEvent: 'break',
                    index: this.tourService.getLastStep().index!,
                    history: this.tourService.getHistory()
                });
            }
            this.tourService.stopTour();
        };
    }
}
