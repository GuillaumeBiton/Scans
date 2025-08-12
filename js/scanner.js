// js/scanner.js

// jsQR est disponible globalement
const { jsQR } = window; 

export class Scanner {
    constructor(videoElement, canvasElement, onScanSuccess) {
        this.video = videoElement;
        this.canvas = canvasElement.getContext('2d');
        this.onScanSuccess = onScanSuccess;
        this.isScanning = false;
    }

    async start() {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: { facingMode: 'environment' }
            });
            this.video.srcObject = stream;
            this.video.setAttribute('playsinline', 'true');
            this.video.play();
            this.isScanning = true;
            requestAnimationFrame(this._tick.bind(this));
        } catch (err) {
            console.error("Erreur d'accès à la caméra:", err);
            throw err; // Propage l'erreur pour la gérer dans l'UI
        }
    }

    stop() {
        this.isScanning = false;
        if (this.video.srcObject) {
            this.video.srcObject.getTracks().forEach(track => track.stop());
        }
    }

    _tick() {
        if (!this.isScanning) return;

        if (this.video.readyState === this.video.HAVE_ENOUGH_DATA) {
            this.canvas.canvas.height = this.video.videoHeight;
            this.canvas.canvas.width = this.video.videoWidth;
            this.canvas.drawImage(this.video, 0, 0, this.canvas.canvas.width, this.canvas.canvas.height);
            const imageData = this.canvas.getImageData(0, 0, this.canvas.canvas.width, this.canvas.canvas.height);
            const code = jsQR(imageData.data, imageData.width, imageData.height, {
                inversionAttempts: 'dontInvert',
            });

            if (code) {
                this.stop();
                this.onScanSuccess(code.data);
            }
        }
        if (this.isScanning) {
            requestAnimationFrame(this._tick.bind(this));
        }
    }
}
