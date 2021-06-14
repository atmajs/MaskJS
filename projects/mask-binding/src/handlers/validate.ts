import { class_create } from '@utils/class';
import { ValidatorProvider, Validators } from '@binding/ValidatorProvider';
import { obj_getProperty } from '@utils/obj';
import { customTag_register } from '@core/custom/exports';
import { Component } from '@compo/exports';
import { log_error } from '@core/util/reporters';


    var class_INVALID = '-validate-invalid';

    export const ValidationCompo = class_create({
        attr: null,
        element: null,
        validators: null,

        constructor: function(){
            this.validators = [];
        },
        renderStart: function(model, ctx, container) {
            this.element = container;

            var prop = this.attr.value;
            if (prop) {
                var fn = ValidatorProvider.getFnFromModel(model, prop);
                if (fn != null) {
                    this.validators.push(fn);
                }
            }
        },
        /**
         * @param input - {control specific} - value to validate
         * @param element - {HTMLElement} - (optional, @default this.element) -
         *                Invalid message is schown(inserted into DOM) after this element
         * @param oncancel - {Function} - Callback function for canceling
         *                invalid notification
         */
        validate: function(val, el, oncancel) {
            var element = el == null ? this.element : el,
                value   = val;
            if (arguments.length === 0) {
                value = obj_getProperty(this.model, this.attr.value);
            }
            if (this.validators.length === 0) {
                this.initValidators();
            }
            var fns = this.validators,
                type = this.attr.silent ? 'validate' : 'validateUi'
                ;

            return ValidatorProvider[type](
                fns, value, this, element, oncancel
            );
        },
        initValidators: function() {
            var attr = this.attr,
                message = this.attr.message,
                isDefault = message == null

            if (isDefault) {
                message = 'Invalid value of `' + this.attr.value + '`';
            }
            for (var key in attr) {
                switch (key) {
                    case 'message':
                    case 'value':
                    case 'getter':
                    case 'silent':
                        continue;
                }
                if (key in Validators === false) {
                    log_error('Unknown Validator:', key, this);
                    continue;
                }
                var str = isDefault ? (message + ' Validation: `' + key + '`') : message
                var fn = ValidatorProvider.getFnByName(key, attr[key], str);
                if (fn != null) {
                    this.validators.push(fn);
                }
            }
        }
    });

    customTag_register(':validate', ValidationCompo);

    customTag_register(':validate:message', Component.create({
        template: 'div.' + class_INVALID + ' { span > "~[bind:message]" button > "~[cancel]" }',

        onRenderStart: function(model){
            if (typeof model === 'string') {
                model = {
                    message: model
                };
            }

            if (!model.cancel) {
                model.cancel = 'cancel';
            }

            this.model = model;
        },
        compos: {
            button: '$: button',
        },
        show: function(message, oncancel){
            var that = this;

            this.model.message = message;
            this.compos.button.off().on(function(){
                that.hide();
                oncancel && oncancel();

            });

            this.$.show();
        },
        hide: function(){
            this.$.hide();
        }
    }));

