import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import {By} from '@angular/platform-browser';

import {BackdropProps, TargetWindowSize} from '../../interfaces/backdrop.interface'
import {Component} from '@angular/core';

import {
  TourStepBackComponent,
} from '../../../public_api';

describe('TourStepBackComponent', () => {
  let component: WrapperForTestComponent;
  let fixture: ComponentFixture<WrapperForTestComponent>;

  beforeEach(async(() => {
    
    TestBed.configureTestingModule({
      declarations: [TourStepBackComponent, WrapperForTestComponent],
    }).compileComponents();
  }));
  beforeEach(() => {
    fixture = TestBed.createComponent(WrapperForTestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it ('test component styles', () => {
    // const backdrop = fixture.nativeElement.querySelector('.tour-step-backdrop');
    const styles = fixture.debugElement.query(By.css('.tour-step-backdrop')).styles;
    expect(styles['opacity']).toBe('0.7');
    expect(styles['height']).toBe("400px");
    expect(styles['position']).toBe("absolute");
  });
  it ('test component background', () => {
    const styles = fixture.debugElement.query(By.css('.target-window')).styles;
    expect(styles['background']).toBe('transparent');
  })
  it ('test component background change', () => {
    component.setBack('green');
    fixture.detectChanges();
    const styles = fixture.debugElement.query(By.css('.target-window')).styles;
    expect(styles['background']).toBe('green');
  })
  @Component({
    selector: `wrapper-for-testing-component`,
    template: `<ng-tour-step-back [props]='props'>
              </ng-tour-step-back>`
  })
  class WrapperForTestComponent {
    props: BackdropProps = {
        backdropColor:'ffffff',
        position: 'absolute',
        targetWindowColor: 'transparent',
        opacity: .7,
        targetWindowSize: {
          pageHeight: 400,
          top: 100,
          bottom: 150,
          left: 200,
          height: 50,
        }
    };
    setColor(color: string): void {
      this.props.backdropColor = color;
    }
    setPosition(pos: string): void {
      this.props.position = pos;
    }
    setBack(color: string): void {
      this.props.targetWindowColor = color;
    }
    setOpacity(num: number): void {
      this.props.opacity = num;
    }
    setSize(size: TargetWindowSize): void {
      this.props.targetWindowSize = size;
    }
  }
});
