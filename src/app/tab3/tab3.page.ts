import { Component } from '@angular/core';
import { SettingsService } from '../services/settings.service';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page {
  darkModeEnabled = this.settings.darkModeEnabled;
  selectedLanguage: string = this.settings.selectedLanguage;
  collectionName: string = this.settings.collectionName;

  savedDatabaseToast: boolean = false;

  constructor(private settings: SettingsService) {}

  setOpenSavedDatabase(isOpen: boolean) {
    this.savedDatabaseToast = isOpen;
  }

  toggleDarkMode(event: any) {
    this.settings.toggleDarkMode(event);
  }

  changeLanguage() {
    this.settings.switchLanguage(this.selectedLanguage);
  }

  saveCollectionName() {
    this.settings.setCollectionName(this.collectionName);
    window.location.reload();
    this.setOpenSavedDatabase(true);
  }
}
