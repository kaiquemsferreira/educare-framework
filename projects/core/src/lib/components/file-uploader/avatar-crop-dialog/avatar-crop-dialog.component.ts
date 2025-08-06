import { Component, Inject, ViewChild, ViewEncapsulation } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';

import { ImageCroppedEvent, ImageCropperComponent, ImageTransform } from 'ngx-image-cropper';

@Component({
  selector: 'avatar-crop-dialog',
  standalone: true,
  imports: [
    ImageCropperComponent,
    FormsModule
  ],
  templateUrl: './avatar-crop-dialog.component.html',
  styleUrl: './avatar-crop-dialog.component.scss',
  encapsulation: ViewEncapsulation.None
})
export class AvatarCropDialogComponent {
  @ViewChild('cropper') cropper?: ImageCropperComponent;
  protected croppedImage: string | null = null;
  protected transform: ImageTransform = { scale: 1 };
  protected zoom = 1;
  protected croppedFile: File | null = null;
  protected cancelButton: string = 'Cancel';
  protected confirmButton: string = 'Confirm';

  constructor(private dialogRef: MatDialogRef<AvatarCropDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: { file: File }) {}

  public onCrop(event: ImageCroppedEvent): void {
    if (event.blob) {
      this.croppedFile = new File([event.blob], this.data.file.name, { type: 'image/png' });
      this.croppedImage = URL.createObjectURL(this.croppedFile);
    }
  }

  public updateZoom(value: number): void {
    this.zoom = value;
    this.transform = { ...this.transform, scale: this.zoom };
  }

  public confirmCrop(): void {
    if (!this.croppedFile) {
      return;
    }
    this.dialogRef.close(this.croppedFile);
  }

  public cancel(): void {
    this.dialogRef.close();
  }
}
