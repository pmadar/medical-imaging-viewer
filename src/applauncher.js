/**
 * Application launcher.
 */

// start app function
function startApp() {
    // translate page
    dwv.i18nPage();

    // main application
    var myapp = new dwv.App();
    const cancers = [
      { index: 155, x: 123, y: 307 },
      { index: 156, x: 188, y: 137 }
    ]

    const statsEl = document.querySelector('#stats')
    myapp.addEventListener("load-end", event => {
      const drawStage = myapp.getDrawStage()
      const scansArray = drawStage.children
      // const drawLayer = scansArray[155]
      const style = myapp.getStyle()
      const image = myapp.getImage()
      cancers.forEach(({ index, x, y }) => {
        const drawLayer = scansArray[index - 1]
        const diff = 5
        const shapeGroup = new dwv.tool.RectangleFactory.prototype.create([
          new dwv.math.Point2D(x - diff, y - diff),
          new dwv.math.Point2D(x + diff, y + diff)
        ], style, image);
        drawLayer.add(shapeGroup);
        drawLayer.draw();
      })
      statsEl.style.display = 'inline-block'
    });

    const descButtonEl = document.querySelector('#descButton')
    const descPopupEl = document.querySelector('#descPopup')
    const descCloseButtonEl = document.querySelector('#descCloseButton')
    descButtonEl.addEventListener("click", () => {
      descPopupEl.style.display = 'inline-block'
    })
    descCloseButtonEl.addEventListener("click", () => {
      descPopupEl.style.display = 'none'
    })

    const value1El = document.querySelector('#value1')
    const value2El = document.querySelector('#value2')
    const value3El = document.querySelector('#value3')
    myapp.addEventListener("position-change", event => {
      const arrayIndex = event.k
      const cancer = cancers.find(({ index }) => (arrayIndex + 1) === index)
      value1El.innerHTML = '<strong>Frame number:</strong> <span>' + (arrayIndex + 1) + '</span>'
      if (cancer) {
        value2El.innerHTML = '<strong>Volume:</strong> <span>' + parseInt(cancer.x * cancer.y * 0.8, 10) + '</span>'
        value3El.innerHTML = '<strong>Value3:</strong> <span>200</span>'
      } else {
        value2El.innerHTML = ''
        value3El.innerHTML = ''
      }
    });

    // initialise the application
    myapp.init({
        "containerDivId": "dwv",
        "fitToWindow": true,
        "gui": ["tool", "load", "help", "undo", "version", "tags", "drawList"],
        "loaders": ["File", "Url", "GoogleDrive", "Dropbox"],
        "tools": ["Scroll", "WindowLevel", "ZoomAndPan", "Draw", "Livewire", "Filter", "Floodfill"],
        "filters": ["Threshold", "Sharpen", "Sobel"],
        "shapes": ["Arrow", "Ruler", "Protractor", "Rectangle", "Roi", "Ellipse", "FreeHand"],
        "isMobile": true
        //"defaultCharacterSet": "chinese"
    });

    var size = dwv.gui.getWindowSize();
    $(".layerContainer").height(size.height);
}

// Image decoders (for web workers)
dwv.image.decoderScripts = {
    "jpeg2000": "../../ext/pdfjs/decode-jpeg2000.js",
    "jpeg-lossless": "../../ext/rii-mango/decode-jpegloss.js",
    "jpeg-baseline": "../../ext/pdfjs/decode-jpegbaseline.js"
};

// check browser support
dwv.browser.check();
// initialise i18n
dwv.i18nInitialise();

// status flags
var domContentLoaded = false;
var i18nLoaded = false;
// launch when both DOM and i18n are ready
function launchApp() {
    if ( domContentLoaded && i18nLoaded ) {
        startApp();
    }
}
// DOM ready?
$(document).ready( function() {
    domContentLoaded = true;
    launchApp();
});
// i18n ready?
dwv.i18nOnLoaded( function () {
    i18nLoaded = true;
    launchApp();
});
