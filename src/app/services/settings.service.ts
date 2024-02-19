import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root'
})
export class SettingsService {
  public darkModeEnabled = true;
  public selectedLanguage: string = 'en';

  constructor(private translate: TranslateService) {}

  initialize(){
    const darkModeSetting = localStorage.getItem('darkMode');
    if (darkModeSetting) {
      this.darkModeEnabled = JSON.parse(darkModeSetting);
      this.applyDarkMode();
    } else {
      localStorage.setItem('darkMode', JSON.stringify(this.darkModeEnabled));
      this.applyDarkMode();
    }

    const languageSetting = localStorage.getItem('language');
    if (languageSetting) {
      this.selectedLanguage = JSON.parse(languageSetting);
    } else {
      localStorage.setItem('language', JSON.stringify(this.selectedLanguage));
    }
    this.translate.setDefaultLang(this.selectedLanguage);
  }

  switchLanguage(language: string) {
    this.translate.use(language);
    this.selectedLanguage = language;
    localStorage.setItem('language', JSON.stringify(this.selectedLanguage));
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
