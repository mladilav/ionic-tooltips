import { animate, state, style, transition, trigger } from '@angular/animations';
import { ChangeDetectionStrategy, Component, ElementRef, HostBinding, Input, Renderer2, } from '@angular/core';
var TooltipBox = (function () {
    function TooltipBox(elementRef, rnd) {
        var _this = this;
        this.elementRef = elementRef;
        this.rnd = rnd;
        this.fadeState = 'invisible';
        this.init = new Promise(function (resolve) {
            _this.initResolve = resolve;
        });
    }
    Object.defineProperty(TooltipBox.prototype, "arrow", {
        set: function (side) {
            this.rnd.setAttribute(this.getNativeElement(), 'class', 'has-arrow ' + 'arrow-' + side);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TooltipBox.prototype, "posTop", {
        set: function (val) {
            this.rnd.setStyle(this.getNativeElement(), 'top', val + 'px');
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TooltipBox.prototype, "posLeft", {
        set: function (val) {
            this.rnd.setStyle(this.getNativeElement(), 'left', val + 'px');
        },
        enumerable: true,
        configurable: true
    });
    TooltipBox.prototype.getNativeElement = function () {
        return this.elementRef.nativeElement;
    };
    TooltipBox.prototype.ngAfterViewInit = function () {
        this.initResolve();
    };
    TooltipBox.decorators = [
        { type: Component, args: [{
                    selector: 'tooltip-box',
                    template: "\n    <div *ngIf=\"tooltipHtml; else txt\" [innerHTML]=\"tooltipHtml\"></div>\n    <ng-template #txt>{{ text }}</ng-template>\n  ",
                    animations: [
                        trigger('fade', [
                            state('visible', style({ opacity: 1 })),
                            state('invisible', style({ opacity: 0 })),
                            transition('visible <=> invisible', animate('300ms linear')),
                        ]),
                    ],
                    styles: [
                        "\n          :host {\n              background-color: white;\n              color: grey;\n              display: inline-block;\n              border-radius: 10px;\n              position: fixed;\n              padding: 13px 15px;\n              font-size: 15px;\n              box-shadow: 0 0 15px rgba(0,0,0,0.3);\n          }\n    ",
                        "\n          :host.has-arrow:before {\n              content: '';\n              border: 5px solid transparent;\n              position: absolute;\n              width: 0;\n              height: 0;\n          }\n    ",
                        ':host.has-arrow.arrow-top:before { border-bottom: 5px solid white; top: -10px; }',
                        ':host.has-arrow.arrow-left:before { border-right: 5px solid white; left: -10px; }',
                        ':host.has-arrow.arrow-right:before { border-left: 5px solid white; right: -10px; }',
                        ':host.has-arrow.arrow-bottom:before { border-top: 5px solid white; bottom: -10px; }',
                        ':host.has-arrow.arrow-bottom-center:before { border-top: 5px solid white; bottom: -10px;left: 50%;transform: translateX(-50%); }',
                        ':host.has-arrow.arrow-top-center:before { border-bottom: 5px solid white; top: -10px;left: 50%;transform: translateX(-50%); }',
                    ],
                    changeDetection: ChangeDetectionStrategy.OnPush,
                },] },
    ];
    /** @nocollapse */
    TooltipBox.ctorParameters = function () { return [
        { type: ElementRef, },
        { type: Renderer2, },
    ]; };
    TooltipBox.propDecorators = {
        "fadeState": [{ type: HostBinding, args: ['@fade',] },],
        "text": [{ type: Input },],
        "tooltipHtml": [{ type: Input },],
        "arrow": [{ type: Input },],
        "posTop": [{ type: Input },],
        "posLeft": [{ type: Input },],
    };
    return TooltipBox;
}());
export { TooltipBox };
//# sourceMappingURL=tooltip-box.component.js.map