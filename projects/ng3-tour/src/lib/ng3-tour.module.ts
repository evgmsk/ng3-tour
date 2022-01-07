import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import {
  Ng3TourService,
  Ng3TourComponent,
  Ng3TourModalDirective,
  Ng3TourEventDirective,
  Ng3TourBackdropComponent
} from '../public_api';

// @dynamic
@NgModule({
  declarations: [
    Ng3TourBackdropComponent,
    Ng3TourComponent,
    Ng3TourModalDirective,
    Ng3TourEventDirective,
  ],
  entryComponents: [Ng3TourComponent],
  imports: [
    CommonModule,
    RouterModule,
  ],
  exports: [
    Ng3TourBackdropComponent,
    Ng3TourComponent,
    Ng3TourModalDirective,
    Ng3TourEventDirective,
  ]
})
export class Ng3TourModule {
  static forRoot(): ModuleWithProviders<Ng3TourModule> {
    return {
      ngModule: Ng3TourModule,
      providers: [
          Ng3TourService
      ]
    };
  }
  static forChild(): ModuleWithProviders<Ng3TourModule> {
    return {
        ngModule: Ng3TourModule,
        providers: []
    };
  }
}
