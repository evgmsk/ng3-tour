# Ng-Tour

An Angular Tour (Ng-tour) light library is **built entirely** in Angular and allows you easily master guide for your users through your site showing them all the sections and features including **lazily loaded**.

**For Angular 2+ (2, 4, 5, 6, 7, 8)**

## Installation

    npm install --save ng-tour

## Usage 

1. Import the NgTourModule in your AppModule:
```
    @NgModule({
        declarations: [AppComponent],
        imports: [
                NgTourModule.forRoot(),
                RouterModule.forRoot([]),
                BrowserModule
        ],
        providers: [],
        bootstrap: [AppComponent]
        })
    export class AppModule { }
```

2. Import the NgTourModule in your Feature Modules:
```
    @NgModule({
        declarations: [FeatureComponent],
        imports: [
            NgTourModule.forChild(),
        ],
        providers: [],
        })
    export class FeatureModule { }
```
3. Use **ngIfTour** directive inside **app.component.html**. A good choice is marking `<router-outlet>` with it.

```
    <route-outlet *ngIfToor></route-outlet>
```

4. If you want to use custom step template wrap it in `<ng-tour-step-template>` and place in **app.component.html**. 
```
    <route-outlet *ngIfToor></route-outlet>
    <ng-tour-step-template>
        <custom-template></custom-template>
    </ng-tour-template>
```

5. Mark your target HTML elements with the **ngTourStep** directive with a unique name.
```
    <div ngTourStep="first">...</div>
    <span ngTourStep="second">...</span>
```

6. Inject NgTourService in your Component. Good Choice is Component where Tour is being started.

```
@Component({
    selector: 'component-of-your-choice',
    templateUrl: './your.component.html'
})
export class ComponentOfYourChoice {
    constructor(private readonly tourService: TourService) { }
}
```

7. Create a configuration object and pass it as an argument to the startTour method

```
const tour = {
    steps: [
        {stepName: "first", route: "home", options: {backdrop: true}},
        {stepName: "nextStep", route: "about", options: stepPlacement: 'top'}}
        ],
    tourOptions: {
        backdrop: false, stepPlacement: 'down'
    }
}

@Component({...

ngOnInit() {
    this.tourService.startTour(tour);
}

of cause this also possible:

onClick() {
    this.tourService.startTour(tour);
}
```

## API reference

### Tour Properties
Name | Required | Type | Destination | Default value
-----|----|----|------------|--------------
steps | yes | TourStep[] | this option define Tour Steps and its order| 
tourEvents | no | TourEvents | this option define event handlers for 'tour start', 'tour break', 'tour end', 'next step', 'prev step' | 
tourOption | no | TourStepI | Set common options. Could be redefined with Step options


### Step Properties (StepOptions)
Name | Required | Type | Destination | Default value
-----|----|----|------------|--------------
stepName | yes | string | define unique name of the Step | 
route | yes | string | define route corresponded to the Step |
index | no | number |  'Index' value is set by TourService service according to the position of the Step in the Steps array | 
title | no | string | Set title of the current Step | ""
description | no | string | Set description of the current Step | ""
options | no | StepOptionsI | to customize separate Step | described below
options: | | | |
className | no | string | set custom class to step component | ""
themeColor| no | string | Define theme color | 'rgb(20, 60, 60)'
backdrop | no | boolean | Add backdrop if option set true | true
opacity| no | number | Define the backdrop opacity | .6
placement | no | string |  This option define position of step modal relative to target. Possible values: 'down', 'top', 'left', 'right', 'center' **( case no matter )** | "Down"
customTemplate | no | boolean | This option has by default value true if was used `<ng-tour-step-template>`. (Value could be reset within Tour options or Step options). Otherwise, the default value of the option will be false. | true/false
withoutCounter | no | boolean |If true remove counter including a number of the step and total number of steps from the Step template | false
withoutPrev | no | boolean |If true remove 'Prev' control button from the Step template | false
arrowToTarget | no | boolean | If true add arrow in direction corresponded location of the Step target  | true
scrollTo | no | boolean | If true scroll window to show Step target add modal (popup) | true
scrollSmooth | no | boolean | If true  option behavior of the window scroll is set to smooth | false
continueIfTargetAbsent | no | boolean | If true and the Step target is absent will initialize the next Step | true
animatedStep | no | boolean | If true add classes to control css animation | true
fixed | no | boolean | If value equals true position css property of the Step Component and Backdrop Component is set to the 'fixed' | true
animationDelay | no | number | Required in case of routing with lazy loaded Feature Modules. Delay defined in ms | 500
targetResize | no | number[] | Change size in px of the Step target window. Number with index 0 define. Number with index 1 if exist define Height differ from the Width | [0]
minWidth | no | string | Define min-width of the Step modal | '200px'
minHeight | no | string | Define min-height of the Step modal | '200px'
maxWidth | no | string | Define max-width of the Step modal | '30vw'
maxHeight | no | string | Define max-height of the Step modal | '30vh'

### Services

#### TourService: 
Name | Args |  Description | Return
-----|------|---------------------|--------
startTour | tour: TourI | start Tour (The only necessary to use lib) | void |
initStep | index: number | Add new stepName to Tour Steps Stream implemented as BehaviorSubject | void 
getStepSubject | | return Tour Steps Stream | Observable`<TourStepI>`[]
getTotal | | return number of steps | 
getStepByName | stepName: string | return step object | TourStepI
isRoutecChanged |  | return true if route previous step differ from current | boolean
getTourStatus | | return true if tour is started and not ended | boolean
stopTour | | stop Tour | void 

#### StepTargetService:
Name | Args |     Description     | Return
-----|------|---------------------|------------
getTargetSubject | | return stream of targets contaning stapeName and data of corresponding target (size and position relate to document) | Observable`<StepTargetI>`[]

### Directives 

#### ngIfTour 
This directive has not Input properties.
Use it inside **app.component.html**.

#### ngTourStep 
@Input	| Required | Description | Values/Type
--------|----------|-------------|-------------
ngTourStep | yes | The value should be unique string | string

### Components 

#### ng-tour-template
To create custom step modal you can use follow component's methods:

Output | Args |     Description     
-----|------|---------------------
next |  | Call before tourService.initStep(with index of the next step)  
prev |   | Call before tourService.initStep(with index of the previous step) |
break | | Call before tourService.stopTour 
done | | Call before tourService.stopTour 

### SCSS Customizing
You can easily redefine styles of the provided Step template in any scss files importing in style.scss file of your project. 

#### Main selectors
Selector | Corresponding DOM node
---------|-------------------------
.tour-step-modal | Step (including custom template)
.tour-step-modal__content | provided Step template
.tour-step-modal__header | provided Step header
.tour-step-modal__title | provided Step title
.tour-step-modal__body | provided Step body (include Step description)
.tour-step-modal__description | provided Step description
.tour-step-modal__footer | provided Step footer (include Step controls: Next, Prev, Done, Counter)
