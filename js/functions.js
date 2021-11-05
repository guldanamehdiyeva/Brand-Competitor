/**
 * Team: CodeBit
 * Team Lead: Murad Mustafayev
 * Date: 06.03.2021
 * */

const isFirefox = () => navigator.userAgent.toLowerCase().indexOf("firefox") > -1;
const isiOS = () => !!navigator.platform && /iPad|iPhone|iPod/.test(navigator.platform);
const isSafariDesktop = () => (/Safari/i.test(navigator.userAgent) && /Apple Computer/.test(navigator.vendor) && !/Mobi|Android/i.test(navigator.userAgent));
const isMobile = () => /Mobi|Android/i.test(navigator.userAgent);

/* PLUGINS */
const slider = (selector, options = {}) => {
    if (!document.querySelector(selector)) {
        return false;
    }
  
    const swiperN = selector.split("-")[selector.split("-").length - 1];
    let activeColor = 'green';
    if (options.activeBulletColor) { activeColor = options.activeBulletColor; }
    const defaults = {
        speed: 500,
        grabCursor: true,
        navigation: {
            nextEl: `.swiper-button-next-${swiperN}`,
            prevEl: `.swiper-button-prev-${swiperN}`
        },
        breakpoints: {
            320: { pagination: false },
            480: {
                pagination: {
                    el: ".swiper-pagination",
                    type: "bullets",
                    clickable: true,
                    bulletClass: "swiper-pagination-bullet-my",
                    bulletActiveClass: `swiper-pagination-bullet-my-active-${activeColor}`
                }
            },
        },
        autoplay: { delay: 5000 }
    };
    return new Swiper(selector, { ...defaults, ...options });
};

const tabs = (options = {}) => {
    const defaults = {
        activeClass: "active",
        hideClass: "d-none",
    };

    options = { ...defaults, ...options };

    const tabs = $('[id*="tab-"]');
    if (!tabs.length) {
        return false;
    }

    tabs.hide().first().fadeIn();
    $("[data-tab]").on("click change", (e) => { //"change" for selectric
        let tab = e.target.dataset.tab;
        if(e.target.querySelector("option")) {
            tab = e.target.querySelector("option:checked").dataset.tab;
        }
        const tabContainer = e.target.dataset.tabContainer;

        $(`[data-tab][data-tab-container=${tabContainer}]`).removeClass(
            options.activeClass
        );
        $(e.target).addClass(options.activeClass);

        $("." + tabContainer).addClass(options.hideClass).hide();
        $(`#${tab}.${tabContainer}`).removeClass(options.hideClass).fadeIn();

        if ("onClick" in options && options.onClick instanceof Function) {
            options.onClick.call(tabs, e.target, tab, tabContainer);
        }
    });
};

/*const mask = (selector, mask, options = {}) => $(selector).mask(mask, options);*/

const selectBox = (selector, options = {}) => {
    // for mobile event handler
    if (
        "onChangeMobile" in options &&
        options.onChangeMobile instanceof Function
    ) {
        options.onChangeMobile.call(selectBox, selector);
    }

    return $(selector).selectric(options);
};

const accordion = (selector, options = {}) => {
    if (!document.querySelector(selector)) {
        return false;
    }
    return new Accordion(selector, options);
};

const dataTable = (selector, options = {}) => {
    if (!document.querySelector(selector)) {
        return false;
    }
    return $(selector).DataTable({...options});
};

const modal = (options) => {
    const defaults = {
      onShow: (modal) => $(modal).find("select").each((i, el) => $(el).selectric("close"))
    };

    return MicroModal.init({ ...options, ...defaults })
}

const dropZone = (selector, options = {}) => {
    if (!document.querySelector(selector)) { return false }
  
    Dropzone.autoDiscover = false;
    return new Dropzone(selector, options);
}

/* PLUGINS END */


const onScrollMove = (selector, options = {}) => {
    const defaults = { exclude: '' }; // exclude get values: desktop or mobile
    options = { ...defaults, ...options };

    if(typeof lastScrollTop === 'undefined') {
        console.log('add GLOBAL variable lastScrollTop with zero(0) value. Example: let lastScrollTop = 0')
        return false;
    }

    if(options.exclude === 'desktop' && !isMobile()) return false;
    if(options.exclude === 'mobile' && isMobile()) return false;

    const stickyElm = document.querySelector(selector);
    if(!stickyElm) { return false }

    let scrollFromTop = document.body.scrollTop || document.documentElement.scrollTop;
    const scrollPixelsToElement = stickyElm.offsetTop;

    if(scrollFromTop > scrollPixelsToElement) {
        if ("stickyOn" in options && options.stickyOn instanceof Function) {
            options.stickyOn.call(onScrollMove, scrollFromTop);
        }
    } else {
        if ("stickyOff" in options && options.stickyOff instanceof Function) {
            options.stickyOff.call(onScrollMove, scrollFromTop);
        }
    }

    if (scrollFromTop > lastScrollTop) {
        if ("isDown" in options && options.isDown instanceof Function) {
            options.isDown.call(onScrollMove, scrollFromTop);
        }
    } else {
        if ("isUp" in options && options.isUp instanceof Function) {
            options.isUp.call(onScrollMove, scrollFromTop);
        }
    }
    lastScrollTop = scrollFromTop <= 0 ? 0 : scrollFromTop;
}

const menuToggleMobile = () =>
  $(".hamburger").on("click", () => __menuToggleMobileActions());
  $("#js-menu-mobile").find("a").on("click", () => __menuToggleMobileActions());

const __menuToggleMobileActions = () => {
  $("body").toggleClass(" h-100-vh menu-active");

  $(".hamburger").toggleClass("is-active");
  $("#js-menu-mobile").toggleClass("left-0");
  $("#js-header").toggleClass("pos-relative z-111");
  $("#js-navbar-links, #js-map-block").toggleClass("opacity-0 z-n1");
  $("#js-overlay-body").toggleClass("d-none");
};

const filterMenuToggle = () =>
  $("#js-filter-menu-open, #js-overlay-body").on("click", () => __filterMenuToggleActions());
  $("#js-filter-menu").find("button").on("click", () => __filterMenuToggleActions());

const __filterMenuToggleActions = () => {
  $("#js-filter-menu").toggleClass("left-0");
  $("#js-overlay-body").toggleClass("d-none");
};

const svgColor = (selector = null, colorHex = null) => {
  $(selector ?? "[data-svg]").each((i, el) => {
    const colorTag = colorHex ?? "#" + el.dataset.svg;

    const rgb = hexToRgb(colorTag);
    const color = new Color(rgb[0], rgb[1], rgb[2]);
    const solver = new Solver(color);
    const result = solver.solve();
    $(el).attr("style", result.filter);
  });
};

const scrollToTarget = (options = {}) => {
  $("[data-scroll]").on("click", (e) => {
    e.preventDefault();
    const anchor = e.currentTarget.getAttribute("href");
    const seconds = Number(e.target.dataset.scrollSecond) || 500;
    const addTop = Number(e.target.dataset.scrollAddtop) || 0;

    $("html, body").animate(
      {
        scrollTop: document.querySelector(anchor).offsetTop + addTop
      },
      seconds
    );

    if ("afterAnimate" in options && options.afterAnimate instanceof Function) {
      options.afterAnimate.call(scrollToTarget, anchor);
    }
  });
};

const limitInput = (selector) => {
  const inputs = document.querySelectorAll(selector);
  if (!inputs.length) {
    return false;
  }

  inputs.forEach((el) => {
    el.addEventListener("keyup", (e) => {
      const inputMax = Number(e.target.dataset.max);
      let inputValue = Number(e.target.value);
      inputValue = isNaN(inputValue) ? 0 : inputValue;
      e.target.value = inputValue;
      if (inputValue > inputMax) {
        e.target.value = inputMax;
      }
    });
  });
};

limitInput("[data-range-min], [data-range-max]");

const filterPrice = (selector) => {
    const sliderEl = document.querySelector(selector);
    if(!sliderEl) { return false; }
    
    const valueEls = [
      $('[data-range-min="' + sliderEl.dataset.target + '"]'),
      $('[data-range-max="' + sliderEl.dataset.target + '"]')
    ];

    noUiSlider.create(sliderEl, {
        start: [valueEls[0].val(), valueEls[1].val()],
        step: parseInt(sliderEl.dataset.step),
        connect: true,
        range: {
            min: [parseFloat(sliderEl.dataset.min)],
            max: [parseFloat(sliderEl.dataset.max)]
        }
    }).on('change', (values) => {
        valueEls[0].val(parseInt(values[0]));
        valueEls[1].val(parseInt(values[1]));
    });
  
    valueEls.forEach((el, i) => {
      el.on("input", () => {
        sliderEl.noUiSlider.set([
          i === 0 ? el.val() : null, i === 1 ? el.val() : null
        ]);
      });
    });
};

/** A utility function to replace classes */
const replaceClass = (target, src, dest) => {
  $(target).removeClass(src);
  $(target).addClass(dest);
}

const replaceClassOnClick = (btn, target, classes) => {
    $(btn).on("click", () => {
      replaceClass(target, classes.src, classes.dest);
    });
};

const countDown = (selector = null, date = null) => {
  $(selector ?? "[data-countdowndate]").each((i, el) => {
    const remTime = date ?? el.dataset.countdowndate.split(":"); // Getting remaining time as h:m:s
    const countdownDate = new Date().getTime() + 1000 * (parseInt(remTime[0]) * 60 * 60 + parseInt(remTime[1]) * 60 + parseInt(remTime[2]));

    let distance = countdownDate - new Date().getTime() - 1000; //Initial distance

    const calculate = () => {
      // Time calculations for hours, minutes and seconds
      //const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const hours = remTime[0];
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);

      // Dealing with 0 at the beginning if there is one digit
      const hoursStr = hours.toString().length === 1 ? `0${hours}` : hours.toString();
      const minutesStr = minutes.toString().length === 1 ? `0${minutes}` : minutes.toString();
      const secondsStr = seconds.toString().length === 1 ? `0${seconds}` : seconds.toString();
        
      // Output the result
      for (let i = 0; i < 2; i++) {
        $(el).find("#js-countdown-hours").find(".countdown-digit").eq(i).text(hoursStr[i]);
        $(el).find("#js-countdown-minutes").find(".countdown-digit").eq(i).text(minutesStr[i]);
        $(el).find("#js-countdown-seconds").find(".countdown-digit").eq(i).text(secondsStr[i]);
      }
    }

    calculate();

    const interval = setInterval(() => {
      distance = countdownDate - new Date().getTime();
      // If the countdown is over, clear interval
      if (distance < 1000) {
        clearInterval(interval);
      }

      calculate();
    }, 1000);

  });
};

const togglePasswordVisibility = (selector = null) => {
  $(selector ?? "[data-password]").each((i, el) => {
    $(el).find(".icon-hide").on("click", (e) => {
      $(e.target).toggleClass("icon-show");
      const type = $(el).find("input").attr("type");
      $(el).find("input").attr("type", `${type === "text" ? "password" : "text"}`);
    })
  })
}

const playModalVideo = (selector = null) => {
    $(selector ?? "[data-micromodal-trigger='modal-video']").each((i, el) => {
        $(el).on("click", () => {
            const $modalVideo = $("#modal-video");
            const iframe = $modalVideo.find("iframe");
            const videoTitle = $modalVideo.find("h2");
            iframe.attr(
              "src",
              `https://www.youtube.com/embed/${el.dataset.src}?autoplay=1&loop=1&rel=0&wmode=transparent`
            );
            videoTitle.text(el.dataset.title);
        });
    });
};

const stopModalVideo = (modal) => $(modal).find("iframe").attr("src", "");

const azToEn = (str) => {
    return str.replace(/Ə/g,'E')
        .replace(/ə/g,'e')
        .replace(/Ğ/g,'G')
        .replace(/ğ/g,'g')
        .replace(/Ü/g,'U')
        .replace(/ü/g,'u')
        .replace(/Ş/g,'S')
        .replace(/ş/g,'s')
        .replace(/I/g,'I')
        .replace(/ı/g,'i')
        .replace(/İ/g,'I')
        .replace(/Ö/g,'O')
        .replace(/ö/g,'o')
        .replace(/Ç/g,'C')
        .replace(/ç/g,'c');
};

const addRows = (options = {}) => {
  const defaults = {
    emptyInputs: true
  };

  options = { ...defaults, ...options };

  $("[data-row-add]").on("click", (e) => {
    const getName = e.target.dataset.rowAdd;
    const $parent = $(`[data-row-container=${getName}]`);
    const $lastChild = $parent.find("[data-row-clone]").last();
    const $rowCloned = $(`[data-row-clone=${getName}]`);

    $rowCloned.find("select").selectric("destroy");
    const $cloned = $rowCloned.clone();
    $rowCloned.find("select").selectric("init");

    if (options.emptyInputs) {
      $cloned.find("input[type=text], textarea").val("");
    }

    $cloned[0].dataset.rowClone = "";
    $cloned.insertAfter($lastChild);
    $cloned.find("select").selectric("init");

    if ("onAdd" in options && options.onAdd instanceof Function) {
      options.onAdd.call(addRows, $cloned, $parent, $lastChild);
    }
  });

  $("body").on("click", "[data-row-delete]", (e) => {
    const getName = e.target.dataset.rowDelete;
    const $deletedRow = $(e.target).parents(`[data-row-clone]`).first();
    $deletedRow.remove();

    if ("onDelete" in options && options.onDelete instanceof Function) {
      options.onDelete.call(addRows, getName, $deletedRow);
    }
  });
};

const officeFilter = (selectorForm, selectorColumn) => {
    const $parent = $(selectorColumn).parent();

    $(selectorForm).on('keyup', e => {
        $(selectorColumn).filter((index, el) => {
            const $elem = $(el);
            const regEx = new RegExp(azToEn(e.target.value.toLowerCase()), 'gi');

            const isFound = (
                azToEn($elem.find('h3').eq(0).text().toLowerCase()).match(regEx) ||
                azToEn($elem.find('p').eq(0).text().toLowerCase()).match(regEx)
            );

            (isFound) ? $elem.slideDown() : $elem.slideUp();
        });

        if(e.target.value.length === 0) {
            $parent.removeClass('d-none');
        }
    });
};

const goNextInput = (selector, maxLength) => {
  if (!document.querySelector(selector)) {
    return false;
  }

  $(selector).each((i, el) => {
    const input = $(el).find("input");
    $(input).on("input", () => {
      const length = $(input).val().length;
      if (length === maxLength) {
        $(el).next(selector).find("input").trigger('focus');
      }
    });
  })
}

const progressRing = (selector = null, percent = null) => {
  $(selector ?? "[data-progressring]").each((i, el) => {
    const ringPercent = percent ?? el.dataset.progressring;

    const circle = $(el).find(".progress-ring-circle");
    const circumference = circle.attr("r") * 2 * Math.PI;
    const offset = circumference - ringPercent / 100 * circumference;
    circle.attr("stroke-dasharray", `${circumference} ${circumference}`);
    circle.attr("stroke-dashoffset", -offset);
  });
}

/*Modal*/
MicroModal.init();

console.log('hello')