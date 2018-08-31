import { AppPage } from './app.po';
import {by, element} from 'protractor';

describe('workspace-project App', () => {
  let page: AppPage;

  beforeEach(() => {
    page = new AppPage();
  });

  it('should display message', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('Tour of heroes');
  });

  it('should display the name of button', () => {
    page.navigateTo();
    expect(page.getHeroesButton().getText()).toEqual('Heroes');
  });

  it('should route to heroes page', () => {
    page.navigateTo();
    page.getHeroesButton().click();
    expect(page.getAppHeroesComponent().isDisplayed()).toBe(true);
  });

  it('should show red color of <h1>', () => {
    page.navigateTo();
    expect(element(by.css('h1')).getCssValue('color')).toEqual('rgba(255, 0, 0, 1)');
  });
});
