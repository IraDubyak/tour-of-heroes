import {
  async, ComponentFixture, fakeAsync, TestBed, tick,
} from '@angular/core/testing';

import {RouterTestingModule} from '@angular/router/testing';
import {SpyLocation} from '@angular/common/testing';

import {Router} from '@angular/router';

import {By} from '@angular/platform-browser';
import {Location} from '@angular/common';
import {AppComponent} from './app.component';
import {AppModule} from './app.module';
import {HeroService} from './hero.service';
import {DashboardComponent} from './dashboard/dashboard.component';
import {HeroesComponent} from './heroes/heroes.component';


let comp: AppComponent;
let fixture: ComponentFixture<AppComponent>;
let router: Router;
let location: SpyLocation;

fdescribe('AppComponent & RouterTestingModule', () => {

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [AppModule, RouterTestingModule],
      providers: [HeroService]
    })
      .compileComponents().then(() => {
      fixture = TestBed.createComponent(AppComponent);
      comp = fixture.componentInstance;

      const injector = fixture.debugElement.injector;
      location = injector.get(Location) as SpyLocation;
      router = injector.get(Router);
      router.initialNavigation();
    });
  }));

  it('should navigate to "Dashboard" immediately', fakeAsync(() => {
    tick(); // wait for async data to arrive
    expect(location.path()).toEqual('/dashboard', 'after initialNavigation()');
    const el = fixture.debugElement.query(By.directive(DashboardComponent));
    expect(el).toBeTruthy('expected an element for ' + DashboardComponent.name);
  }));

  it('should navigate to "Heroes"by URL change', fakeAsync(() => {
    location.simulateHashChange('/heroes');
    tick(); // wait while navigating
    fixture.detectChanges(); // update view
    tick(500);
    expect(location.path()).toEqual('/heroes');
    const el = fixture.debugElement.query(By.directive(HeroesComponent));
    expect(el).toBeTruthy('expected an element for ' + HeroesComponent.name);
  }));

});
