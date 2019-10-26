import {
    Directive,
    Input,
    OnInit,
    Inject,
    PLATFORM_ID,
    OnDestroy,
    TemplateRef,
    ViewContainerRef,
    ComponentFactoryResolver,
    ComponentFactory
} from '@angular/core';
import {isPlatformBrowser} from '@angular/common';
import {Subject} from 'rxjs';
import {map, takeUntil} from 'rxjs/operators';

import {StepTargetService} from '../services/step-target.service';
import {TourStepComponent} from '../components/tour-step.component';
import {TourService} from '../services/tour.service';

// @dynamic
@Directive({
    selector: '[ngIfTour]',
})
export class TourRootDirective implements OnInit, OnDestroy {
    @Input('ngIfTour') customTemplate?: boolean;
    private readonly onDestroy = new Subject<any>();
    isEmbedded: boolean;
    isCreated: boolean;
    isBrowser: boolean;
    modalFactory: ComponentFactory<TourStepComponent>;
    constructor(
        private template: TemplateRef<any>,
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
        if (this.customTemplate) {
            this.tourService.setPresets({customTemplate: true});
            this.targetService.getTargetSubject().pipe(
                takeUntil(this.onDestroy),
                map((step: any) => {
                    if (step && !this.isEmbedded) {
                        this.isEmbedded = true;
                        this.viewContaner.createEmbeddedView(this.template);
                    } else if (!step) {
                        this.isEmbedded = false;
                        this.viewContaner.clear();
                    }
                    return step;
                  }
            )).subscribe();
        } else {
            let componentRef: any;
            this.viewContaner.createEmbeddedView(this.template);
            this.targetService.getTargetSubject().pipe(
                takeUntil(this.onDestroy),
                map((step: any) => {
                    if (step && !this.isCreated) {
                        this.isCreated = true;
                        componentRef = this.viewContaner.createComponent(this.modalFactory);
                    } else if (!step && this.isCreated) {
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
