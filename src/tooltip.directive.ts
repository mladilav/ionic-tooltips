import {
  AfterViewInit,
  ApplicationRef,
  ComponentFactoryResolver,
  ComponentRef,
  Directive,
  ElementRef,
  HostListener,
  Input,
  OnDestroy,
  OnInit,
  ViewContainerRef,
}                   from '@angular/core';
import { Platform } from 'ionic-angular';

import { TooltipBox } from './tooltip-box.component';
import { TooltipController } from './tooltip.cotroller';

@Directive({
  selector: '[tooltip]',
})
export class Tooltip implements OnInit, AfterViewInit, OnDestroy {

  @Input() tooltipHtml: string;

  @Input() tooltip: string;

  @Input() positionV: string;

  @Input() positionH: string;

  @Input() event: 'press' | 'click' | 'hover';

  @Input() mobileEvent: 'press' | 'click' = 'press';

  @Input() desktopEvent: 'press' | 'click' | 'hover' = 'hover';

  @Input() topOffset: number;

  @Input() leftOffset: number;

  @Input() hideOthers: boolean;

  @Input()
  set navTooltip(val: boolean) {
    this._navTooltip = typeof val !== 'boolean' || val !== false;
  }

  get navTooltip(): boolean {
    return this._navTooltip;
  }

  @Input()
  set arrow(val: boolean) {
    this._arrow = typeof val !== 'boolean' || val !== false;
  }

  get arrow(): boolean {
    return this._arrow;
  }

  @Input() duration: number = 3000;

  @Input()
  set active(val: boolean) {
    this._active = typeof val !== 'boolean' || val !== false;
    this._active ? this.canShow && this.showTooltip() : this.removeTooltip();
  }

  get active(): boolean {
    return this._active;
  }

  private _arrow: boolean = false;
  private _navTooltip: boolean = false;
  private tooltipElement: ComponentRef<TooltipBox>;
  private tooltipTimeout: any;
  private _canShow: boolean = true;
  private _active: boolean = false;

  constructor(
    private el: ElementRef,
    private appRef: ApplicationRef,
    private platform: Platform,
    private _componentFactoryResolver: ComponentFactoryResolver,
    private tooltipCtrl: TooltipController
  ) {
  }

  ngAfterViewInit() {
    // Show the tooltip immediately after initiating view if set to
    if (this._active) {
      this.trigger();
    }
  }

  ngOnInit() {
    // Set default event type by platform if event is not defined
    if (!this.event) {
      this.event = this.platform.is('mobile') ? this.mobileEvent : this.desktopEvent;
    }
  }

  /**
   * Set the canShow property
   * Ensure that tooltip is shown only if the tooltip string is not falsey
   */
  set canShow(show: boolean) {
    this._canShow = show;
  }

  /**
   * @return {boolean} TRUE if the tooltip can be shown
   */
  get canShow(): boolean {
    return this._canShow && ((typeof this.tooltip === 'string' && this.tooltip !== '') || (typeof this.tooltipHtml === 'string' && this.tooltipHtml !== ''));
  }

  /**
   * Handles the click/press event and shows a tooltip.
   * If a tooltip already exists, it will just reset it's timer.
   */
  trigger() {
    if (!this.canShow) {
      return;
    }

    if (this.tooltipElement) {
      this._resetTimer();
    } else {
      this.showTooltip();
    }
  }

  /**
   * Creates a new tooltip component and adjusts it's properties to show properly.
   */
  showTooltip() {
    this._createTooltipComponent();

    const tooltipComponent: TooltipBox = this.tooltipElement.instance;

    tooltipComponent.text = this.tooltip;
    tooltipComponent.tooltipHtml = this.tooltipHtml;
    tooltipComponent.init.then(() => {
      const tooltipPosition = this._getTooltipPosition();

      tooltipComponent.posLeft = tooltipPosition.left;
      tooltipComponent.posTop = tooltipPosition.top;

      tooltipComponent.fadeState = 'visible';

      if (this.arrow) {
        let arrowPosition;
        if (this.positionV === 'top') {
          arrowPosition = this.positionH === 'center' ? 'bottom-center' : 'bottom';
        } else if (this.positionV === 'bottom') {
          arrowPosition = this.positionH === 'center' ? 'top-center' : 'top';
        } else if (this.positionH === 'left') {
          arrowPosition = 'right';
        } else {
          arrowPosition = 'left';
        }
        tooltipComponent.arrow = arrowPosition;
      }

      if (!this._active) {
        this.tooltipTimeout = setTimeout(
          this.removeTooltip.bind(this),
          this.duration,
        );
      }
    });
  }

  @HostListener('click')
  onClick(): void {
    if (this.event === 'click') {
      this.trigger();
    }
  }

  @HostListener('press')
  onPress(): void {
    if (this.event === 'press') {
      this.trigger();
    }
  }

  @HostListener('mouseenter')
  onMouseEnter(): void {
    if (this.event === 'hover') {
      this.active = true;
    }
  }

  @HostListener('mouseleave')
  onMouseLeave(): void {
    if (this.event === 'hover') {
      this.active = false;
    }
  }

  private _createTooltipComponent() {
    let viewport: ViewContainerRef = (<any>this.appRef.components[0])._component
        ._viewport,
      componentFactory = this._componentFactoryResolver.resolveComponentFactory(
        TooltipBox,
      );

    this.tooltipElement = viewport.createComponent(componentFactory);
    this.tooltipCtrl.addTooltip(this);
  }

  private _getTooltipPosition() {
    const tooltipNativeElement: HTMLElement = this.tooltipElement.instance.getNativeElement(),
      el: HTMLElement = this.el.nativeElement,
      rect: ClientRect = el.getBoundingClientRect();

    let positionLeft: number,
      positionTop: number,
      spacing: number = 10;

    if (this.navTooltip) {
      this.positionV = 'bottom';
      this.arrow = false;
      spacing = 20;
    }

    if (this.positionH === 'right') {
      positionLeft = rect.right + spacing;
    } else if (this.positionH === 'left') {
      positionLeft = rect.left - spacing - tooltipNativeElement.offsetWidth;
    }  else if (this.positionH === 'center') {
      positionLeft = rect.left - (tooltipNativeElement.offsetWidth - el.offsetWidth) / 2; 
    } else if (this.navTooltip) {
      positionLeft = rect.left + el.offsetWidth / 2;
    } else {
      positionLeft = rect.left;
    }

    console.log('rect', rect);
    console.log('rect.left', rect.left);
    console.log('rect.width', rect.width);
    console.log('el', el);
    console.log('el.offsetWidth', el.offsetWidth);
    console.log('tooltipNativeElement.offsetWidth', tooltipNativeElement.offsetWidth);

    if (this.positionV === 'top') {
      positionTop = rect.top - spacing - tooltipNativeElement.offsetHeight;
    } else if (this.positionV === 'bottom') {
      positionTop = rect.bottom + spacing;
    } else {
      positionTop =
        rect.top + el.offsetHeight / 2 - tooltipNativeElement.offsetHeight / 2;
    }

    if (+this.topOffset) {
      positionTop += +this.topOffset;
    }
    if (+this.leftOffset) {
      positionLeft += +this.leftOffset;
    }

    if (
      positionLeft + tooltipNativeElement.offsetWidth + spacing >
      this.platform.width()
    ) {
      positionLeft =
        this.platform.width() - tooltipNativeElement.offsetWidth - spacing;
    } else if (positionLeft + tooltipNativeElement.offsetWidth - spacing < 0) {
      positionLeft = spacing;
    }

    if (positionTop + tooltipNativeElement.offsetHeight + spacing > this.platform.height()) {
      positionTop = this.platform.height() - tooltipNativeElement.offsetHeight - spacing;
    } else if (positionTop + tooltipNativeElement.offsetHeight - spacing < 0) {
      positionTop = spacing;
    }

    return {
      left: positionLeft,
      top: positionTop,
    };
  }

   removeTooltip() {
    if (!this.tooltipElement) {
      this.tooltipElement = undefined;
      this.tooltipTimeout = undefined;
      return;
    }

    this.tooltipElement.instance.fadeState = 'invisible';

    this.canShow = false;

    // wait for animation to finish then clear everything out
    setTimeout(() => {
      if (
        this.tooltipElement &&
        typeof this.tooltipElement.destroy === 'function'
      ) {
        this.tooltipElement.destroy();
      }
      this.tooltipCtrl.removeTooltip(this);
      this.tooltipElement = this.tooltipTimeout = undefined;
      this.canShow = true;
    }, 300);
  }

  private _resetTimer() {
    clearTimeout(this.tooltipTimeout);
    this.tooltipTimeout = setTimeout(() => {
      this.active = false;
    }, this.duration);
  }

  ngOnDestroy() {
    // if the timer hasn't expired or active is true when the component gets destroyed, the tooltip will remain in the DOM
    // this removes it
    this.removeTooltip();
  }
}
