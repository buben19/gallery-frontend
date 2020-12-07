import { Component } from '@angular/core';
import { Image } from './model/image';
import { ImageService } from './image.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'gallery-frontened';

  images: Image[] = [];

  constructor(private imageService: ImageService) {
  }

  ngOnInit() {
    this.getImages();
  }

  getImages(): void {
    this.imageService.getAll()
      .subscribe(images => this.images = images);
  }
}
