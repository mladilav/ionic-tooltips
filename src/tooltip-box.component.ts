import { animate, state, style, transition, trigger } from '@angular/animations';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  HostBinding,
  Input,
  Renderer2,
} from '@angular/core';

@Component({
  selector: 'tooltip-box',
  template: `
    <div *ngIf="tooltipHtml; else txt" [innerHTML]="tooltipHtml"></div>
    <ng-template #txt>{{ text }}</ng-template>
  `,
  animations: [
    trigger('fade', [
      state('visible', style({ opacity: 1 })),
      state('invisible', style({ opacity: 0 })),
      transition('visible <=> invisible', animate('300ms linear')),
    ]),
  ],
  styles: [
      `
          :host {
              background-color: white;
              color: grey;
              display: inline-block;
              border-radius: 10px;
              position: fixed;
              padding: 13px 15px;
              font-size: 15px;
              box-shadow: 0 0 15px rgba(0,0,0,0.3);
          }
    `,
      `
          :host.has-arrow:before {
              content: '';
              border: 5px solid transparent;
              position: absolute;
              width: 0;
              height: 0;
          }
    `,
    ':host.has-arrow.arrow-top:before { border-bottom: 5px solid white; top: -10px; }',
    ':host.has-arrow.arrow-left:before { border-right: 5px solid white; left: -10px; }',
    ':host.has-arrow.arrow-right:before { border-left: 5px solid white; right: -10px; }',
    ':host.has-arrow.arrow-bottom:before { border-top: 5px solid white; bottom: -10px; }',
    ':host.has-arrow.arrow-bottom-center:before { border-top: 5px solid white; bottom: -10px;left: 50%;transform: translateX(-50%); }',
    ':host.has-arrow.arrow-top-center:before { border-bottom: 5px solid white; top: -10px;left: 50%;transform: translateX(-50%); }',
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TooltipBox implements AfterViewInit {
  @HostBinding('@fade') fadeState: string = 'invisible';

  @Input() text: string;
  @Input() tooltipHtml: string;

  @Input()
  set arrow(side: string) {
    this.rnd.setAttribute(
      this.getNativeElement(),
      'class',
      'has-arrow ' + 'arrow-' + side,
    );
  }

  @Input()
  set posTop(val: number) {
    this.rnd.setStyle(this.getNativeElement(), 'top', val + 'px');
  }

  @Input()
  set posLeft(val: number) {
    this.rnd.setStyle(this.getNativeElement(), 'left', val + 'px');
  }

  getNativeElement(): HTMLElement {
    return this.elementRef.nativeElement;
  }

  init: Promise<void>;

  private initResolve: Function;

  constructor(public elementRef: ElementRef, private rnd: Renderer2) {
    this.init = new Promise<void>(resolve => {
      this.initResolve = resolve;
    });
  }

  ngAfterViewInit() {
    this.initResolve();
  }
}
