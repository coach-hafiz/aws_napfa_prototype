/*
  TopCodes Patched Wrapper
  ------------------------
  This wrapper fixes iOS Safari mirrored rear camera feeds.

  HOW IT WORKS:
  - Loads the original topcodes.js
  - Wraps its drawing/update loop to apply a horizontal flip on iOS Safari
  - Leaves detection code unchanged (raw pixel grid unaffected)
  - Works with your existing app without breaking anything

  USAGE:
  Replace your <script src="topcodes.js"> with:
    <script src="topcodes_patched.js"></script>
*/

(function() {

  // Detect iOS
  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);

  // Load the original TopCodes library dynamically
  function loadOriginalTopCodes(callback) {
    const script = document.createElement('script');
    script.src = "topcodes.js";   // <-- put original topcodes.js in same folder
    script.onload = callback;
    document.head.appendChild(script);
  }

  // After original library loads…
  loadOriginalTopCodes(() => {

    // Ensure TopCodes exists
    if (!window.TopCodes) {
      console.error("TopCodes library did not load.");
      return;
    }

    console.log("TopCodes loaded — applying iOS mirroring fix…");

    // Patch the drawing routine
    const originalDraw = TopCodes.prototype.drawFrame;

    TopCodes.prototype.drawFrame = function(ctx, video, width, height) {

      if (isIOS) {
        // Un-mirror iOS video for display, but detection stays correct
        ctx.save();
        ctx.scale(-1, 1);
        ctx.translate(-width, 0);
        originalDraw.call(this, ctx, video, width, height);
        ctx.restore();
      } else {
        originalDraw.call(this, ctx, video, width, height);
      }
    };

    console.log("iOS mirroring fix applied successfully.");

  });

})();
