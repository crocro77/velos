var canvas = document.querySelector("canvas");

			var signaturePad = new SignaturePad(canvas);

			var context = canvas.getContext("2d");           //context element
			var clickX = new Array();
			var clickY = new Array();
			var clickDrag = new Array();
			var paint;
                
			canvas.addEventListener("mousedown", mouseDown, false);
			canvas.addEventListener("mousemove", mouseXY, false);
			document.body.addEventListener("mouseup", mouseUp, false);

			// Returns signature image as data URL (see https://mdn.io/todataurl for the list of possible parameters)
			signaturePad.toDataURL(); // save image as PNG
			signaturePad.toDataURL("image/jpeg"); // save image as JPEG
			signaturePad.toDataURL("image/svg+xml"); // save image as SVG

			// Draws signature image from data URL.
			// NOTE: This method does not populate internal data structure that represents drawn signature. Thus, after using #fromDataURL, #toData won't work properly.
			signaturePad.fromDataURL("data:image/png;base64,iVBORw0K...");

			// Returns signature image as an array of point groups
			const data = signaturePad.toData();

			// Draws signature image from an array of point groups
			signaturePad.fromData(data);

			// Clears the canvas
			signaturePad.clear();

			// Returns true if canvas is empty, otherwise returns false
			signaturePad.isEmpty();

			// Unbinds all event handlers
			signaturePad.off();

			// Rebinds all event handlers
			signaturePad.on();
				});
