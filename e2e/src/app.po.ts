import { browser, by, element } from 'protractor';

export class AppPage {
  navigateTo() {
    return browser.get('/');
  }

  getParagraphText() {
    return element(by.css('app-root h1')).getText();
  }
  getHeroesButton() {
    return element(by.css('[routerlink="/heroes"]'));
  }
  getAppHeroesComponent() {
    return element(by.css('app-heroes')).isDisplayed();
  }

}
