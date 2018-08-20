import { AppPage } from './app.po';

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
    expect(page.getAppHeroesComponent()).toBeTruthy();
  });
});
