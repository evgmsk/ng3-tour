import { Pipe, PipeTransform } from '@angular/core';
import {TourService} from '../services/tour.service';

@Pipe({
  name: 'tourData',
  pure: false,
})
export class TourPipe implements PipeTransform {

    constructor(private readonly tour: TourService) {}
    transform(value: any, ...args: any[]): any {
        if (!this.tour.getTourStatus()) {
            return '';
        }
        const step = this.tour.getLastStep();
        if (!step) {
            return '';
        }
        if (value in step && value !== 'index' && value !== 'options') {
            return step[value];
        }
        if (value === 'index') {
            return step[value] + 1;
        }
        if (value in step.options) {
            return step.options[value];
        }
        if (value === 'total') {
            return this.tour.getTotal();
        }
        if (value === 'first') {
            return !this.tour.getLastStepIndex();
        }
        if (value === 'last') {
            return this.tour.getTotal() === this.tour.getLastStepIndex() + 1;
        }
        if (value === 'tourStarted') {
            return this.tour.getTourStatus();
        }
    }
}
