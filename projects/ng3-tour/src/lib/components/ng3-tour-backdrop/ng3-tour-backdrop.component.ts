import { Component, Input, OnInit} from '@angular/core';

import {BackdropProps} from '../../interfaces/ng3-tour-backdrop.interface'

@Component({
  selector: 'ng3-tour-backdrop',
  templateUrl: './ng3-tour-backdrop.component.html',
  styleUrls: ['./ng3-tour-backdrop.component.scss'],
})
export class Ng3TourBackdropComponent implements OnInit {
  @Input('props') props: BackdropProps;
  
  constructor() { 
    
  }

  ngOnInit() {
    // console.log(this.props.targetWindowColor)
    console.error('Backdrop props: ', this.props)
  }

}
