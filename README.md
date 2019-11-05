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
                RouterModule.forRoot([]),
                NgTourModule.forRoot(),
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
    <route-outlet ngIfTour></route-outlet>
```


5. Mark your target HTML elements with the **ngTourStep** directive with a unique name.
```
    <div ngTourStep="first">...</div>
    <span ngTourStep="second">...</span>
```

5. Inject NgTourService in your Component. Good Choice is Component where Tour is being started.

```
@Component({
    selector: 'component-of-your-choice',
    templateUrl: './your.component.html'
})
export class ComponentOfYourChoice {
    constructor(private readonly tourService: TourService) { }
}
```

6. Create a configuration object and pass it as an argument to the startTour method

```
const tour = {
    steps: [
        {
            stepName: "first",
            route: "home",
            title: "My first feature name",
            description: "My first feature description", 
            options: {backdrop: true}
        },
        {
            stepName: "nextStep",
            route: "about",
            title: "My second feature name",
            description: "My second feature description",
            options: stepPlacement: 'top'}
        }
    ],
    tourOptions: {
        backdrop: false,
        stepPlacement: 'down'
    }
}

Keep in mind if you implement your own Step template, you can use your own Step properties besides required ('stepName' and 'route')

@Component({...

ngOnInit() {
    this.tourService.startTour(tour);
}

of cause this also possible:

onClick() {
    this.tourService.startTour(tour);
}
```

### Customizing

If you want to use tour own Step template wrap it `<ng-tour-step-template>` and place in **app.component.html**. You could use the 'tourData' pipe with string values corresponded the Step property names to bind data. To handle controls event you could use tourEvent directive with corresponded input value (one of 'next', 'prev', 'close') 

```
    <route-outlet ngIfToor></route-outlet>
    <ng-tour-step-template>
        <div *ngIf="('customTemplate' | tourData) && ('tourStarted' | tourData) class="custom-step__content">
            <div class="custom-step__header">
                <h3 class="custom-step__title">
                    {{'title' | tourData}}
                </h3>
                <button class="tour-step-modal__close-btn" type="button" tourEvent="close" (break)="onBreak($event)" (done)="onDone($event)">
                    &times;
                </button>
            </div>
            <div class="custom-step__body">
                <p class="custom-step__description">
                    {{'description' | tourData}}
                </p>
            </div>
            <div class="custom-step__footer">
                <div *ngIf="!('withoutCounter' | tourData)">
                    {{'index' | tourData}} of {{'total' | tourData}}
                </div>
                <button
                    *ngIf="!('withoutPrev' | tourData) && !('first' | tourData)" 
                    type="button" 
                    tourEvent="prev"
                >
                    Prev
                </button>
                <button
                    *ngIf="!('last' | tourData)"
                    type="button"
                    tourEvent="next"  
                    (next)="onNext($event)"
                >
                    Next
                </button>
                <button
                    *ngIf="('last' | tourData)"
                    type="button"
                    tourEvent="close"
                    (done)="onDone($event)"
                >
                    Done
                </button>
            </div>
        </div>
    </ng-tour-template>
```
Keep in mind if you use **`<ng-tour-step-template>`** and **`ngIfTour`** at the same time 'customTemplate' option is set to true programmatically. If you omit  **`ngIfTour`** and want to use your own  Step template set this option to true manually. 


## API reference

### Interfaces and Types

```
interface TourI {
  steps: TourStepI[];
  tourOptions?: StepOptionsI;
  tourEvents?: TourEventsI;
}

interface TourStepI {
  stepName: string;
  route?: string;
  index?: number;
  title?: string;
  description?: string;
  options?: StepOptionsI;
  [propName: string]: any;
}

type TourEvent =  (props: {
  tourEvent: string,
  step?: number | string,
  history?: number[],
  [propName: string]: any
}) => void;

export interface TourEventsI {
  tourStart?: TourEvent;
  tourEnd?: TourEvent;
  tourBreak?: TourEvent;
  next?: TourEvent;
  prev?: TourEvent;
}
```

### Tour Properties
Name | Required | Type | Destination | Default value
-----|----|----|------------|--------------
steps | yes | TourStep[] | This option define Tour Steps and its order | 
tourEvents | no | TourEventsI | define event handlers for 'tour start', 'tour break', 'tour end', 'next step', 'prev step' | 
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
autofocus | no | boolean | If true 'next' and 'done' buttons obtain focus | true

### Services

#### TourService: 
Name | Args |  Description | Return
-----|------|---------------------|--------
startTour | tour: TourI | start Tour (The only necessary to use lib) | void |
prevStep | | Call initStep with previous stepName | void 
nextStep | | Call initStep with next stepName | void 
stopTour | | stop Tour | void 


### Directives 

#### ngIfTour 
This directive is similar to a structural one if it is used solo without `<ng-tour-step-template>`. In this case, **`ngIfTour`** adds provided `<ng-tour-step-template>` to the DOM  after the Tour is started and removes it after the Tour is finished. If **`ngIfTour`** is used along with **`<ng-tour-step-template>`** (no matter which element was marked with directive **`<ng-tour-step-template>`** or some other) it make only one thing it set 'customTemplate' property to true.

#### ngTourStep 
@Input	| Required | Description | Values/Type
--------|----------|-------------|-------------
ngTourStep | yes | The value should be unique string | string

#### tourEvent
This directive bind listeners to Step's controls.
@Input	| Required | Destination
--------|----------|-------|-------------
next | required one of three options | Implement handler with nextStep method
prev | | Implement handler with prevStep method 
close | | Implement handler with stopTour method 

@Output	| Props | Destination
--------|-------|-------------
next |  | 
prev | | | Implement handler with prevStep method 
break | | Implement handler with stopTour method 
done |

### Pipes

#### tourData
Value	| Description | Return values/Type
--------|-------------|-------------------
Tour's properies | | | 
'total' | Total number of Steps | number
'first' | True if current Step is first | boolean
'last' | True if current Step is last | boolean
'tourStarted' | True if tour started | boolean
Step's properties: | | | 
'title' | Title of the Step | string
'description' | Description of the Step | string 
'index' | Index of the Step | string
Step's options properties | | |
Tou can bind all props defined in StepOptionsI | | |
**Keep in mind you can add bind using tourData additional properties**

### Components 

#### ng-tour-template
To add some logic :

Output | Args |     Description     
-----|------|---------------------
next |  | Call before tourService.initStep(with index of the next step)  
prev |   | Call before tourService.initStep(with index of the previous step)
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
