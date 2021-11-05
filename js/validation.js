const validationDefaults = {
    errorColor: 'red',
    defaultColor: '#dcdcdc',
};


const formValidation = (selector, options = {}) => {
    const $formParsley = $(selector);
    if($formParsley.length) {

        if('init' in options && options.init instanceof Function) {
            options.init.call(formValidation, selector);
        }

        let isSubmitted = false;
        let lastInputObj;
        $formParsley.parsley({ errorsWrapper: false }).on('form:validated', e => {
            isSubmitted = true;
            lastInputObj = e.fieldsMappedById[Object.keys(e.fieldsMappedById)[Object.keys(e.fieldsMappedById).length - 1]];

            // on form:validated - e.element is current form
            __fileValidation(e.element);
            __selectValidation(e.element);
        });

        $formParsley.parsley({ errorsWrapper: false }).on('field:validated', (e) => {
            if(isSubmitted) {
                if(e === lastInputObj) {
                    isSubmitted = false;
                }

                __formStepping(e.element);
                return false;
            }

            // on field:validated - e.element is current input
            const getType = $(e.element).attr('type');
            if(getType === 'file') {
                __fileTextChange(e.element);
                __fileValidation(e.element);
            }

            if ($(e.element).is('select')) {
                __selectValidation(e.element);
            }

            if('formStep' in options && options.formStep instanceof Function) {
                options.formStep.call(formValidation, e.element);
            }
        });
    }
};


const __formStepping = (selector) => {
    const $form = $(selector).parents('form').first();
    const stepIndex = $(selector).parents('.js-form-step').index();
    const $stepCurrent = $form.find('.js-form-step').eq(stepIndex);
    const countInputs = $stepCurrent.find('.js-input-check').length;
    const countSuccess = $stepCurrent.find('.js-input-check').find('.parsley-success, input[type=range]').length;

    if($stepCurrent.find('.js-input-check').find('.parsley-error').length) {
        $stepCurrent.nextAll('.js-form-step').stop().slideUp();
    }

    const calc = Math.floor(100 / (countInputs / countSuccess));
    if(calc === 100) {
        $stepCurrent.next('.js-form-step').slideDown();
    }
    $stepCurrent.find('.js-step-percentage').text(calc);
};


const __selectChange = element => {
    let borderColor = validationDefaults.defaultColor;
    const parsleyClasses = ['parsley-success', 'parsley-error'];
    if($(element).find('option:checked').val() === '') {
        borderColor = validationDefaults.errorColor;
        parsleyClasses.reverse();
    }
    $(element).parents('.selectric-wrapper').first().find('.selectric').css('border-color', borderColor).end().find('select').addClass(parsleyClasses[0]).removeClass(parsleyClasses[1]);
};


const __selectValidation = (selector, options = {}) => {
    if(!Object.keys(options).length) {
        options = validationDefaults;
    }

    // if form(form:validated) then find ALL selectric, if select(field:validated) then find current selectric
    const $selector = ($(selector).is('form')) ? $(selector).find('.selectric-wrapper') : $(selector).parents('.selectric-wrapper').first();
    $selector.each((i, el) => {
        $(el).find('.selectric').attr('style', 'border-color:' + options.errorColor +' !important');

        if($(el).find('select').hasClass('parsley-success')) {
            $(el).find('.selectric').css('border-color', options.defaultColor);
        }
    });
};


$('input[type=file]').on('change', e => {
    __fileTextChange(e.target);
    __fileValidation(e.target);
});


const __fileTextChange = (element) => {
    const text = (element.files.length) ? element.files[0].name : element.dataset.defaultText;
    $(element).siblings('.filename-text').text(text);
};


const __fileValidation = (selector, options = {}) => {
    if(!Object.keys(options).length) {
        options = validationDefaults;
    }

    const $selector = ($(selector).is('form')) ? $(selector).find('input[type=file]') : $(selector);

    $selector.each((i, el) => {
        const $label = $(el).parent();
        $label.css('border-color', options.errorColor);

        if($(el).hasClass('parsley-success')) {
            $label.css('border-color', options.defaultColor);
        }
    });
};


window.Parsley.addValidator('extensionCheck', {
    requirementType: 'string',
    validateString: (value, requirement, formInstance) => {
        let isValid = false;
        const fileList = formInstance.element.files;

        if(fileList.length) {
            const extensions = requirement.replace(/\s/g, '').toLowerCase().split(',');
            const ext = fileList[0].name.substr(fileList[0].name.lastIndexOf('.') + 1).toLowerCase();

            const mimeTypes = {
                png: 'image/png',
                jpg: 'image/jpeg',
                jpeg: 'image/jpeg',
                gif: 'image/gif',
                doc: 'application/msword',
                docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                pdf: 'application/pdf'
            };

            isValid = ((extensions.indexOf(ext) !== -1) && (mimeTypes[ext] === fileList[0].type));
        }

        return isValid;
    }
});


window.Parsley.addValidator('sizeCheck', {
    requirementType: 'string',
    validateString: function(value, requirement, formInstance) {
        let isValid = false;
        const fileList = formInstance.element.files;

        if(fileList.length) {
            isValid = (requirement * 1024 > fileList[0].size);
        }

        return isValid;
    }
});