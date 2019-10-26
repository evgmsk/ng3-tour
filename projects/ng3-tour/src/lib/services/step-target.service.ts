import { Injectable } from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';

export interface StepSizeI {
  top: number;
  left: number;
  bottom: number;
  right: number;
  height?: number;
  width?: number;
  pageHeight: number;
}

@Injectable()
export class StepTargetService {
  targetExist$ = new BehaviorSubject<{stepName: string, target: Element}>(null);
  constructor() { }
  maxHeight() {
    return Math.max(
      document.body.scrollHeight,
      document.documentElement.scrollHeight,
      document.body.offsetHeight,
      document.documentElement.offsetHeight,
      document.body.clientHeight,
      document.documentElement.clientHeight,
      window.innerHeight
    );
  }
  public getSizeAndPosition(el: Element) {
    const targetRect = el.getBoundingClientRect();
    const bodyRect = document.body.getBoundingClientRect();
    const top = targetRect.top - bodyRect.top;
    const left = targetRect.left - bodyRect.left;
    const bottom = targetRect.bottom - bodyRect.top;
    const right = targetRect.left - bodyRect.left;
    const height = targetRect.height || bottom - top;
    const width = targetRect.width || right - left;
    const pageHeight = this.maxHeight();
    return {top, left, bottom, right, width, height, pageHeight};
  }

  public resizeTarget(target: StepSizeI, size: number[]): StepSizeI {
    target.left -= size[0];
    target.right += size[0];
    target.top -= size[1] || size[0];
    target.bottom += size[1] || size[0];
    target.width += 2 * size[0];
    target.height += 2 * (size[1] || size[0]);
    return target;
  }

  public getTargetSubject(): Observable<{stepName: string, target: Element}> {
      return this.targetExist$;
  }
  public setTargetSubject(value: {stepName: string, target: Element}): void {
    console.log('exist', value);
    this.targetExist$.next(value);
  }
}
