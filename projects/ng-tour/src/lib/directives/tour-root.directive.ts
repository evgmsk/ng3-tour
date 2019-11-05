import {
    Directive,
    OnInit,
    Inject,
    PLATFORM_ID,
    OnDestroy,
    ElementRef,
    ViewContainerRef,
    ComponentFactoryResolver,
    ComponentFactory
} from '@angular/core';
import {isPlatformBrowser} from '@angular/common';
import {Subject} from 'rxjs';
import {map, takeUntil, subscribeOn} from 'rxjs/operators';

import {StepTargetService} from '../services/step-target.service';
import {TourStepComponent} from '../components/tour-step.component';
import {TourService} from '../services/tour.service';

 // @dynamic
@Directive({
    selector: '[ngIfTour]',
})
export class TourRootDirective implements OnInit, OnDestroy {
    customTemplate = false;
    private readonly onDestroy = new Subject<any>();
    isEmbedded: boolean;
    isCreated: boolean;
    isBrowser: boolean;
    modalFactory: ComponentFactory<TourStepComponent>;
    constructor(
        private elem: ElementRef,
        private readonly tourService: TourService,
        private readonly targetService: StepTargetService,
        private viewContaner: ViewContainerRef,
        private componentFactory: ComponentFactoryResolver,
        // @dynamic
        @Inject(PLATFORM_ID) platformId: {}) {
        this.isBrowser = isPlatformBrowser(platformId);
        this.modalFactory = this.componentFactory.resolveComponentFactory(TourStepComponent);
    }
    ngOnInit() {
        if (!this.isBrowser) {
            return;
        }
        const parent = this.elem.nativeElement.parentNode;
        if (parent.localName !== 'app-root') {
            console.warn(`You placed ngIfTour directive in ${this.elem.nativeElement.localName} inside ${parent.localName}.
                Are you sure ${parent.localName} better choice then app-root?`);
        }
        const isTourTemplate = [...parent.childNodes].filter((c: Element) => c.localName === 'ng-tour-step-template').length;
        if (isTourTemplate) {
            this.customTemplate = true;
        }
        let componentRef: any;
        if (this.customTemplate) {
            this.tourService.setPresets({customTemplate: true});
        } else {
            this.targetService.getTargetSubject().pipe(
            takeUntil(this.onDestroy),
            map((step: any) => {
                if (step && !this.isCreated) {
                    this.isCreated = true;
                    componentRef = this.viewContaner.createComponent(this.modalFactory);
                } else if (!step && this.isCreated) {
                    this.isCreated = false;
                    this.viewContaner.remove(this.viewContaner.indexOf(componentRef));
                }
                return step;
                }
            )).subscribe();
        }
    }
    ngOnDestroy() {
        this.onDestroy.next();
    }
}
