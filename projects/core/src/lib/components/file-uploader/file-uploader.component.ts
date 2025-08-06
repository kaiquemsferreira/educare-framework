import {
  Component,
  EventEmitter,
  Input,
  Output,
  ViewEncapsulation
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DecimalPipe, NgClass, NgOptimizedImage } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { AvatarCropDialogComponent } from './avatar-crop-dialog/avatar-crop-dialog.component';

@Component({
  selector: 'file-uploader',
  standalone: true,
  imports: [FormsModule, NgOptimizedImage, NgClass, DecimalPipe],
  templateUrl: './file-uploader.component.html',
  styleUrl: './file-uploader.component.scss',
  encapsulation: ViewEncapsulation.None
})
export class FileUploaderComponent {
  @Input() fileType: 'image' | 'document' | 'compressed' | 'avatar' = 'avatar';
  @Input() uploadHandler?: (file: File, onProgress: (value: number) => void) => Promise<string>;
  @Output() import = new EventEmitter<File>();
  @Output() cancel = new EventEmitter<void>();
  @Output() uploadedUrl = new EventEmitter<string>();

  protected file?: File;
  protected imagePreview: string | null = null;
  protected fileUrl = '';
  protected progress = 0;
  protected uploadFinished = false;
  protected isDragging = false;
  protected isPaused = false;

  private deleteUrl: string | null = null;
  private xhr: XMLHttpRequest | null = null;
  protected uploadedUrlTemp: string | null = null;

  constructor(private readonly dialog: MatDialog) { }

  get acceptedMimeTypes(): string {
    switch (this.fileType) {
      case 'document':
        return '.pdf,.doc,.docx,.txt,.xls,.xlsx';
      case 'compressed':
        return '.zip,.rar,.7z,.tar.gz';
      default:
        return 'image/png,image/jpeg,image/webp';
    }
  }

  get mainText(): string {
    switch (this.fileType) {
      case 'document': return 'Drop your documents here';
      case 'compressed': return 'Drop your archives here';
      case 'avatar': return 'Drop your photo here';
      default: return 'Drop your image here';
    }
  }

  get supportText(): string {
    switch (this.fileType) {
      case 'document': return 'Supports: PDF, DOC, DOCX, TXT, XLS';
      case 'compressed': return 'Supports: ZIP, RAR, 7Z, TAR.GZ';
      case 'avatar': return 'Supports: PNG, JPG';
      default: return 'Supports: PNG, JPG, JPEG, WEBP';
    }
  }

  public onFileSelected(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) this.startUpload(file);
  }

  public onDragOver(event: DragEvent): void {
    event.preventDefault();
    this.isDragging = true;
  }

  public onDragLeave(event: DragEvent): void {
    const dropZone = event.currentTarget as HTMLElement;
    const related = event.relatedTarget as HTMLElement | null;
    if (!related || !dropZone.contains(related)) {
      this.isDragging = false;
    }
  }

  public onDrop(event: DragEvent): void {
    event.preventDefault();
    this.isDragging = false;
    if (event.dataTransfer?.files?.length) {
      this.startUpload(event.dataTransfer.files[0]);
    }
  }

  private startUpload(file: File): void {
    if (this.fileType === 'avatar') {
      this.dialog.open(AvatarCropDialogComponent, {
        width: '800px',
        data: { file }
      }).afterClosed().subscribe((croppedFile: File | undefined) => {
        if (croppedFile) {
          this.processUpload(croppedFile);
        }
      });
    } else {
      this.processUpload(file);
    }
  }

  private processUpload(file: File): void {
    this.file = file;
    this.progress = 0;
    this.uploadFinished = false;
    this.isPaused = false;

    if (this.fileType === 'image' || this.fileType === 'avatar') {
      this.previewImage(file);
    }

    if (this.uploadHandler) {
      this.uploadHandler(file, (value) => this.progress = value)
        .then(url => {
          this.uploadFinished = true;
          this.progress = 100;
          this.uploadedUrl.emit(url);
        })
        .catch(err => {
          console.error('Erro no upload handler externo', err);
          this.cancelUpload();
        });
    } else {
      this.uploadViaXHR(file);
    }
  }

  private uploadViaXHR(file: File): void {
    const formData = new FormData();
    formData.append('image', file);
    const apiKey = '7cde3edfec4570266b236c63013e4e8e';

    this.xhr = new XMLHttpRequest();

    this.xhr.upload.onprogress = (event: ProgressEvent) => {
      if (event.lengthComputable) {
        this.progress = Math.round((event.loaded / event.total) * 100);
      }
    };

    this.xhr.onreadystatechange = () => {
      if (this.xhr?.readyState === 4) {
        if (this.xhr.status === 200) {
          const response = JSON.parse(this.xhr.responseText);
          if (response.success && response.data?.url) {
            this.deleteUrl = response.data.delete_url;
            this.uploadedUrlTemp = response.data.url;
            this.uploadedUrl.emit(response.data.url);
            this.uploadFinished = true;
            this.progress = 100;
          } else {
            console.error('Erro no upload:', response);
            this.cancelUpload();
          }
        } else {
          console.error('Erro HTTP:', this.xhr.status);
          this.cancelUpload();
        }
      }
    };

    this.xhr.open('POST', `https://api.imgbb.com/1/upload?key=${apiKey}`, true);
    this.xhr.send(formData);
  }

  public togglePause(): void {
    if (!this.xhr || this.uploadFinished) return;

    if (!this.isPaused) {
      this.xhr.abort();
      this.isPaused = true;
    } else if (this.file) {
      this.startUpload(this.file);
    }
  }

  private previewImage(file: File): void {
    const reader = new FileReader();
    reader.onload = () => this.imagePreview = reader.result as string;
    reader.readAsDataURL(file);
  }

  public uploadFromUrl(): void {
    this.imagePreview = this.fileUrl;
    this.uploadFinished = true;
  }

  public cancelUpload(): void {
    if (this.xhr) {
      this.xhr.abort();
      this.xhr = null;
    }

    if (this.deleteUrl) {
      try {
        window.open(this.deleteUrl, '_blank');
      } catch (err) {
        console.warn('Erro ao abrir delete_url:', err);
      }
    }

    this.file = undefined;
    this.progress = 0;
    this.uploadFinished = false;
    this.imagePreview = null;
    this.fileUrl = '';
    this.deleteUrl = null;
    this.uploadedUrlTemp = null;
    this.isPaused = false;
    this.isDragging = false;
  }
}
