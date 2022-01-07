import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {By} from '@angular/platform-browser';
import {Component} from '@angular/core';

import {
  Ng3TourBackdropComponent,
  BackdropProps,
  TargetWindowSize
} from '../../../public_api';

describe('TourStepBackComponent', () => {
  let component: WrapperForTestComponent;
  let fixture: ComponentFixture<WrapperForTestComponent>;

  beforeEach(async(() => {
    
    TestBed.configureTestingModule({
      declarations: [Ng3TourBackdropComponent, WrapperForTestComponent],
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
    expect(styles['height']).toBe("800px");
    expect(styles['position']).toBe("absolute");
  });
  it ('test target window background', () => {
    const styles = fixture.debugElement.query(By.css('.target-window')).styles;
    expect(styles['background']).toBe('transparent');
  })
  it ('test target window background change', () => {
    component.setBack('green');
    fixture.detectChanges();
    const styles = fixture.debugElement.query(By.css('.target-window')).styles;
    expect(styles['background']).toBe('green');
  })
  it ('test backdrop background', () => {
    const Tstyles = fixture.debugElement.query(By.css('.tour-step-backdrop__top')).styles;
    const Bstyles = fixture.debugElement.query(By.css('.tour-step-backdrop__bottom')).styles;
    const Lstyles = fixture.debugElement.query(By.css('.tour-step-backdrop__left')).styles;
    const Rstyles = fixture.debugElement.query(By.css('.tour-step-backdrop__right')).styles;
    console.log('Back color: ', Tstyles);
    expect(Tstyles['background']).toBe(convertToRGB(component.props.backdropColor));
    expect(Bstyles['background']).toBe(convertToRGB(component.props.backdropColor));
    expect(Rstyles['background']).toBe(convertToRGB(component.props.backdropColor));
    expect(Lstyles['background']).toBe(convertToRGB(component.props.backdropColor));
  })
});
@Component({
  selector: `wrapper-for-testing-component`,
  template: `<ng3-tour-backdrop [props]='props'>
            </ng3-tour-backdrop>`
})
class WrapperForTestComponent {
  props: BackdropProps = {
      backdropColor: 'rgb(20, 60, 60)',
      position: 'absolute',
      targetWindowColor: 'transparent',
      opacity: .7,
      targetWindowSize: {
        pageHeight: 800,
        top: 200,
        left: 150,
        width: 200,
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
function convertToRGB(color: string): string {
  if (color.slice(0,1) !== '#') {
    return color;
  }
  if (color.length < 7) {
    return `rgb(${parseInt(color.slice(1,2), 16)}, ${parseInt(color.slice(2,3), 16)}, ${parseInt(color.slice(3), 16)})`;
  }

  return `rgb(${parseInt(color.slice(1,3), 16)}, ${parseInt(color.slice(3,5), 16)}, ${parseInt(color.slice(5), 16)})`;
}