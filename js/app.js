window.onload = () => $("body").removeClass("preload");

if (isiOS()) { document.querySelector("html").classList.add("ios") }
if (isSafariDesktop()) { document.querySelector("html").classList.add("safari-desktop", "overflowx-h") }

/* PLUGINS */
selectBox(".selectric-tooltip", {
  onChange: (element) => {
    const checkedOption = element.querySelector("option:checked");

    //Will only be applied to selectrics that has url dataset
    if (checkedOption.dataset.hasOwnProperty('url')) {
      window.location.replace(checkedOption.dataset.url);
    }

    // Validate selectrics that need to be validated
    if (element.dataset.hasOwnProperty('validate')) {
      __selectChange(element);
    }
  }
});

//Flag icons handling
selectBox(".selectric-lang", {
  optionsItemBuilder: (itemData) =>
    `<div class="d-inline-flex-y-center">
        <span class="icon square-24 icon-${itemData.value} mr-2"></span>
        <span>${itemData.text}</span>
    </div>`,
  labelBuilder: (itemData) =>
    `<div class="d-inline-flex-y-center">
        <span class="icon square-24 icon-${itemData.value} mr-2"></span>
        <span>${itemData.text}</span>
    </div>`
});

//Filter icon handling
selectBox(".selectric-filter, .selectric-filter-gray", {
  labelBuilder: (itemData) => 
    `<div class="d-inline-flex-y-center">
        <span class="icon square-24 icon-${itemData.element.parent()[0].dataset.icon} mr-2"></span>
        <span>${itemData.text}</span>
    </div>`
});

// IMPORTANT: Use slider with an id for next prev buttons
const productSliderOptions = {
    spaceBetween: 16,
    loop: false,
    breakpoints: {
        0: { slidesPerView: "auto" },
        992: { slidesPerView: 5 }
    }
};
const filterAccOptions = { openOnInit: [0, 1, 2], showMultiple: true };
let swiperDirection = "vertical";

if (window.innerWidth <= 992) {
  swiperDirection = "horizontal";
  slider("#js-slider-4, #js-slider-6, #js-slider-11, #js-slider-12, #js-slider-13", {
    slidesPerView: "auto",
    spaceBetween: 16
  });

  accordion("#js-accordion-filter-mobile", filterAccOptions);
}
accordion("#js-accordion-filter", filterAccOptions);
accordion("#js-accordion-faq");

slider("#js-slider-1", { direction: swiperDirection });
slider("#js-slider-2", { direction: swiperDirection });

slider("#js-slider-3", productSliderOptions);
slider("#js-slider-5", productSliderOptions);

slider("#js-slider-7", {
  direction: "vertical",
  activeBulletColor: "white"
});

slider("#js-slider-8", {
  breakpoints: {
    0: {
      slidesPerView: "auto",
      spaceBetween: 16
    },
    992: {
      slidesPerView: 2,
      spaceBetween: 32
    }
  }
});

const sliderGalleryThumbs = slider("#js-slider-9-thumbs", {
  breakpoints: {
    0: {
      slidesPerView: 4,
      spaceBetween: 8
    },
    992: {
      slidesPerView: 5,
      spaceBetween: 16
    }
  }
});

slider("#js-slider-9", {
  spaceBetween: 16,
  thumbs: {
    swiper: sliderGalleryThumbs
  }
});

const donutSlider = slider("#js-slider-10", {
    slidesPerView: "auto",
    autoplay: false
});
if (donutSlider) {
  donutSlider.snapGrid = [...donutSlider.slidesGrid]; //Last slide not getting active fix
}

$(".swiper-container").each((i, target) => {
    const swp = target.swiper;
    if(swp) {
        $(target).on('mouseenter', () => swp.autoplay.stop());
        $(target).on('mouseleave', () => swp.autoplay.start());
    }
});


mask('.js-mask-letter', 'Z', {translation:  {'Z': {pattern: /^[a-zA-ZİÇÖÜçöüĞ-ğıŞ-şƏə\s]*$/, recursive: true}}});
mask('.js-mask-phone', '(+000) (00) 000 00 00', {
    onChange: (cep, event, currentField) => {
        currentField.val(cep);
        if(currentField.val().length <= 6 || currentField.val().indexOf('(+994)') !== 0) {
            currentField.val('').val('(+994)');
        }
    }
});
mask('.js-mask-phone-body', '000 00 00');
mask('.js-mask-digit', '0');

$(".js-parsley").each((i, el) => formValidation(el));

modal({
    disableScroll: true,
    awaitCloseAnimation: true,
    onClose: modal => { if (modal.id === "modal-video") { stopModalVideo(modal); } }
});


/*Modal*/
MicroModal.init({
  onShow: modal => console.info(`${modal.id} is shown`), // [1]
  onClose: modal => console.info(`${modal.id} is hidden`), // [2]
  openTrigger: 'data-custom-open', // [3]
  closeTrigger: 'data-custom-close', // [4]
  openClass: 'is-open', // [5]
  disableScroll: true, // [6]
  disableFocus: false, // [7]
  awaitOpenAnimation: false, // [8]
  awaitCloseAnimation: false, // [9]
  debugMode: true // [10]
});



tabs();

dataTable("#js-operations-table", {
    sScrollX: "100%",
    bScrollCollapse: true,
    autoWidth: true,
    searching: false,
    ordering: false,
    paging: false,
    info: false,
    lengthChange: false,
    stripeClasses: [],
});

$("[data-dropzone-wrapper]").each((i, el) => {
  const dropzoneId = el.dataset.dropzoneWrapper;
  const dropzoneUpload = $(el).find("[data-dropzone-upload]"); // For single file upload handling

  const dropZoneConfig = {
    previewsContainer: `[data-preview="${dropzoneId}"]`,
    previewTemplate: $(el).find("[data-preview-template]").html(),
    dictDefaultMessage: "",
    maxFilesize: 2, // MB
    acceptedFiles: $(el).find("input").attr("accept"),
    url: "_AJAX.php"
  };

  const myDropzone = dropZone(`[data-dropzone="${dropzoneId}"]`, {
      ...dropZoneConfig,
      error: (file, message) => {
          if(file && message) {
              const $uploaded = $('.'+ file.upload.uuid);
              //$uploaded.find('.dz-error-message').text('specific error');
              $uploaded.find('.dz-upload').text('');
              $uploaded.find('.dz-error-message').removeClass('d-none');
              $uploaded.find('.dz-delete').remove();
              setTimeout(() => { 
                $uploaded.remove();
                $(dropzoneUpload).removeClass("d-none");
              }, 2000);
              return false;
          }
      },
      addedfile: file => {
          const cloned = $(dropZoneConfig.previewTemplate).clone().addClass(file.upload.uuid);
          $(dropzoneUpload).addClass("d-none");
          $(el).find("[data-preview]").append(cloned);

          $('.dz-delete').one("click", () => myDropzone.removeFile(file));
      },
      removedfile: (file, response) => {
          $.ajax({
              url: dropZoneConfig.url,
              method: 'post',
              data: { uuid: file.upload.uuid, name: file.name, delete: true },
              success: response => {
                  response = JSON.parse(response);
                  if(response.success) {
                      $('.' + file.upload.uuid).remove();
                      $(dropzoneUpload).removeClass("d-none");
                  }
              }
          });
      },
      success: (file) => {
          const $uploaded = $('.'+ file.upload.uuid);
          $uploaded.find('figure').removeClass('d-none');
          if ($uploaded.find("img").attr("src") === "") {
            $uploaded.find("img").attr("src", file.dataURL);
          }
          $uploaded.find('h6').text(file.name);
          $uploaded.find('.dz-delete').removeClass('d-none');
          $uploaded.find('.dz-progress').remove();
      },
  });
});



/* PLUGINS END */


/* APP FUNCTIONS */

menuToggleMobile();
filterMenuToggle();
svgColor();
progressRing();
scrollToTarget();
countDown();
togglePasswordVisibility();
playModalVideo();

replaceClassOnClick("#js-banner-close", "#js-banner", {src: "top-0", dest: "top-n100"});
replaceClassOnClick("#js-banner-close", "#js-header", { src: "mt-lg-148", dest: "mt-0" });

filterPrice("#js-range-slider-price");

addRows({
    onAdd: ($cloned, $parent, $lastChild) => {
        const rowContainer = $parent[0].dataset.rowContainer;
        mask('.js-mask-letter', 'Z', {translation:  {'Z': {pattern: /^[a-zA-ZİÇÖÜçöüĞ-ğıŞ-şƏə\s]*$/, recursive: true}}});

        if (rowContainer === 'talent') { //Specific for talent row
            const inputValue = $("#js-talent-input").val();
            if (inputValue.length !== 0) {
              $cloned.find("p").text(inputValue);
              replaceClass($cloned, "d-none", "d-flex-y-center");
            }
        }
        
        replaceClass($cloned.find("[data-row-delete"), "d-none", "d-flex-xy");
    },
    onDelete: (rowName, $deletedRow) => {}
});

goNextInput(".js-verification-digit",1);

officeFilter('.js-map-find', '.js-map-coordinates');

$('#js-office-toggle').on('click', () => {
    $('#js-office-wrapper').toggleClass('d-none');
});

/* APP FUNCTIONS END */