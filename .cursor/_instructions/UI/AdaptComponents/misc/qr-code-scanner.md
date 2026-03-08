# QR Code Scanner

## Description

QR Code Scanner component provides functionality to scan QR codes using device camera or upload QR code images for decoding. It returns the decoded data from the QR code.

## Import

```typescript
import {AdaptQrCodeScannerModule} from '@bmc-ux/adapt-angular';
```

## Component Name / Selector

**Selector:** `adapt-qr-code-scanner`

## Properties

### @Inputs

| Name | Type | Default | Description |
|------|------|---------|-------------|
| width | number \| string | '100%' | Scanner viewport width |
| height | number \| string | 300 | Scanner viewport height |
| enableScan | boolean | true | Enable/disable camera scanning |
| enableUpload | boolean | true | Enable/disable image upload |
| continuousMode | boolean | false | Continue scanning after successful decode |
| formats | BarcodeFormat[] | ['QR_CODE'] | Supported barcode formats |
| cameraId | string | - | Specific camera device ID to use |
| facingMode | 'user' \| 'environment' | 'environment' | Camera facing mode (front or back) |

### @Outputs

| Name | Type | Description |
|------|------|-------------|
| scanSuccess | EventEmitter<string> | Emits when QR code is successfully scanned/decoded |
| scanError | EventEmitter<Error> | Emits when scan error occurs |
| camerasFound | EventEmitter<MediaDeviceInfo[]> | Emits list of available cameras |
| permissionDenied | EventEmitter<void> | Emits when camera permission is denied |

## Simple Example

### TypeScript Component

```typescript
import {Component} from '@angular/core';

@Component({
  selector: 'adapt-qr-scanner-demo',
  templateUrl: './qr-scanner.demo.html'
})
export class AdaptQrScannerDemoComponent {
  scannedData: string = '';
  availableCameras: MediaDeviceInfo[] = [];
  selectedCameraId: string = '';
  scanEnabled: boolean = false;

  onScanSuccess(data: string): void {
    console.log('QR Code scanned:', data);
    this.scannedData = data;
    // Process the scanned data
    this.handleScannedData(data);
  }

  onScanError(error: Error): void {
    console.error('Scan error:', error);
  }

  onCamerasFound(cameras: MediaDeviceInfo[]): void {
    this.availableCameras = cameras;
    if (cameras.length > 0) {
      this.selectedCameraId = cameras[0].deviceId;
    }
  }

  onPermissionDenied(): void {
    console.error('Camera permission denied');
    alert('Please grant camera permission to scan QR codes');
  }

  handleScannedData(data: string): void {
    // Handle the scanned data
    // Could be URL, text, JSON, etc.
    if (data.startsWith('http')) {
      // It's a URL
      window.open(data, '_blank');
    } else {
      // Display the data
      alert(`Scanned: ${data}`);
    }
  }

  startScan(): void {
    this.scanEnabled = true;
  }

  stopScan(): void {
    this.scanEnabled = false;
  }
}
```

### HTML Template

```html
<!-- Basic QR Scanner -->
<adapt-qr-code-scanner [width]="'100%'"
                       [height]="400"
                       (scanSuccess)="onScanSuccess($event)"
                       (scanError)="onScanError($event)"></adapt-qr-code-scanner>

<!-- Scanner with Camera Selection -->
<div class="qr-scanner-container">
  <div class="camera-selection" *ngIf="availableCameras.length > 1">
    <label>Select Camera:</label>
    <select [(ngModel)]="selectedCameraId">
      <option *ngFor="let camera of availableCameras" 
              [value]="camera.deviceId">
        {{camera.label || 'Camera ' + camera.deviceId}}
      </option>
    </select>
  </div>

  <adapt-qr-code-scanner [cameraId]="selectedCameraId"
                         [width]="600"
                         [height]="400"
                         (scanSuccess)="onScanSuccess($event)"
                         (camerasFound)="onCamerasFound($event)"
                         (permissionDenied)="onPermissionDenied()"></adapt-qr-code-scanner>
</div>

<!-- Front Camera (Selfie Mode) -->
<adapt-qr-code-scanner [facingMode]="'user'"
                       (scanSuccess)="onScanSuccess($event)"></adapt-qr-code-scanner>

<!-- Continuous Scanning Mode -->
<adapt-qr-code-scanner [continuousMode]="true"
                       (scanSuccess)="onScanSuccess($event)"></adapt-qr-code-scanner>

<!-- Scanner with Upload Only -->
<adapt-qr-code-scanner [enableScan]="false"
                       [enableUpload]="true"
                       (scanSuccess)="onScanSuccess($event)"></adapt-qr-code-scanner>

<!-- Controlled Scanning -->
<div class="scanner-controls">
  <button class="btn btn-primary" 
          (click)="startScan()"
          [disabled]="scanEnabled">
    Start Scan
  </button>
  <button class="btn btn-secondary" 
          (click)="stopScan()"
          [disabled]="!scanEnabled">
    Stop Scan
  </button>
</div>

<adapt-qr-code-scanner *ngIf="scanEnabled"
                       [width]="'100%'"
                       [height]="400"
                       (scanSuccess)="onScanSuccess($event)"></adapt-qr-code-scanner>

<!-- Display Scanned Result -->
<div class="scanned-result" *ngIf="scannedData">
  <h4>Scanned Data:</h4>
  <div class="result-box">
    {{scannedData}}
  </div>
</div>

<!-- Multiple Format Scanner -->
<adapt-qr-code-scanner [formats]="['QR_CODE', 'EAN_13', 'CODE_128']"
                       (scanSuccess)="onScanSuccess($event)"></adapt-qr-code-scanner>
```

## Key Features

- Camera-based QR code scanning
- Image upload for QR code decoding
- Multiple camera support
- Front/back camera selection
- Continuous or single-scan mode
- Multiple barcode format support
- Camera permission handling
- Error handling
- Success/error events
- Responsive sizing
- Works on mobile and desktop
- Real-time scanning
- Ideal for authentication, payments, ticketing, product scanning

