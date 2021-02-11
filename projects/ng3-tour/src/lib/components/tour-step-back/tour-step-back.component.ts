import { Component, Input, OnInit} from '@angular/core';

import {BackdropProps} from '../../interfaces/backdrop.interface'

@Component({
  selector: 'ng-tour-step-back',
  templateUrl: './tour-step-back.component.html',
  styleUrls: ['./tour-step-back.component.scss'],
})
export class TourStepBackComponent implements OnInit {
  @Input('props') props: BackdropProps;
  

  constructor() { }

  ngOnInit() {
    // console.log(this.props.targetWindowColor)
  }

}
