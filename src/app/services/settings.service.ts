import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SettingsService {
  public darkModeEnabled = true;

  constructor() {}
  initialize(){
    const darkModeSetting = localStorage.getItem('darkMode');
    if (darkModeSetting) {
      this.darkModeEnabled = JSON.parse(darkModeSetting);
      this.applyDarkMode();
    } else {
      localStorage.setItem('darkMode', JSON.stringify(this.darkModeEnabled));
      this.applyDarkMode();
    }
  }

  toggleDarkMode(event: any) {
    this.darkModeEnabled = event.detail.checked;
    localStorage.setItem('darkMode', JSON.stringify(this.darkModeEnabled));
    this.applyDarkMode();
  }

  applyDarkMode() {
    if (this.darkModeEnabled) {
      document.body.setAttribute('color-theme', 'dark');
    } else {    
      document.body.setAttribute('color-theme', 'light');
    }
  }
}
