import {async, ComponentFixture, fakeAsync, TestBed, tick} from '@angular/core/testing';
import {FormsModule} from '@angular/forms';
import {HeroDetailComponent} from './hero-detail.component';
import {HttpClientModule} from '@angular/common/http';
import {HeroService} from '../hero.service';
import {RouterTestingModule} from '@angular/router/testing';
import {Hero} from '../hero';
import {Observable} from 'rxjs';
import {ActivatedRoute} from '@angular/router';
import {ActivatedRouteStub} from '../activated-route-stub';
import { defer } from 'rxjs';
import {Location} from '@angular/common';
import {By} from '@angular/platform-browser';

describe('HeroDetailComponent', () => {
  let expectedHero: Hero;
  let locationSpy: any;
  let spy: any;
  let activatedRoute: ActivatedRouteStub;
  let component: HeroDetailComponent;
  let fixture: ComponentFixture<HeroDetailComponent>;
  const firstHero = {id: 1, name: 'Hero1' };
  beforeEach(() => {
    activatedRoute = new ActivatedRouteStub();
  });
  beforeEach(async(() => {
    locationSpy = jasmine.createSpyObj('Location', ['back']);
    spy = jasmine.createSpyObj('HeroService', ['getHero', 'updateHero']);

    TestBed.configureTestingModule({
      imports: [FormsModule,
        HttpClientModule,
        RouterTestingModule.withRoutes([{path: 'detail/:id', component: HeroDetailComponent}])],
      declarations: [ HeroDetailComponent ],
      providers: [
        { provide: ActivatedRoute, useValue: activatedRoute },
        { provide: HeroService,    useValue: spy },
        { provide: Location,         useValue: locationSpy},
      ]
    })
      .compileComponents();

    expectedHero =  {id: 1, name: 'Hero1' };
    activatedRoute.setParamMap({ id: expectedHero.id });
    fixture = TestBed.createComponent(HeroDetailComponent);
    component = fixture.componentInstance;
    spy.getHero.and.returnValue(defer(() => Promise.resolve(firstHero)));

    // 1st change detection triggers ngOnInit which gets a hero
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      // 2nd change detection displays the async-fetched hero
      fixture.detectChanges();
    });
  }));

  it('should get hero', () => {
    expect(spy.getHero.calls.any()).toBe(true);
  });

  it('should display that hero\'s name', () => {
    expect(fixture.nativeElement.querySelector('h2').textContent).toContain(expectedHero.name.toUpperCase());
  });
  it('should navigate back', () => {
    const backButton = fixture.debugElement.query(By.css('#back'));
    backButton.triggerEventHandler('click', null);
    expect(locationSpy.back.calls.any()).toBe(true);
    expect(locationSpy.back.calls.count()).toBe(1);
  });

  it('should update hero after changes', () => {
    const saveButton = fixture.debugElement.query(By.css('#save'));
    spy.updateHero.and.returnValue(defer(() => Promise.resolve(firstHero)));
console.log(component.hero, 'aaaa');
    saveButton.triggerEventHandler('click', null);

    expect(spy.updateHero.calls.any()).toBe(true);
    expect(spy.updateHero.calls.count()).toBe(1);
    expect(locationSpy.back.calls.any()).toBe(false);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should pass twice, passes but because of two way data binding ngModel', fakeAsync(() => {
    component.hero = {id: 1, name: 'fretfreg'}; // without this line fixture.whenStable().then isn't working
    fixture.detectChanges(); // without this line fixture.whenStable().then isn't working
    // fixture.whenStable().then(() => {
    tick();
    const input = fixture.nativeElement.querySelector('#inputHero');
    const h = fixture.nativeElement.querySelector('h2');
    expect(input.value).toEqual(component.hero.name);

    input.value = 'MyHero';
    input.dispatchEvent(new Event('input')); // console.log( component.hero.name); - MyHero
    fixture.detectChanges();
    expect(component.hero.name).toBe('MyHero');
    expect(h.textContent).toContain('MyHero'.toUpperCase());
  }));
  // });
  describe('HeroDetailComponent non-existing id', () => {
    beforeEach(async(() => {
      activatedRoute.setParamMap({ id: 99999 });
      fixture = TestBed.createComponent(HeroDetailComponent);
      component = fixture.componentInstance;

      // 1st change detection triggers ngOnInit which gets a hero
      fixture.detectChanges();
      return fixture.whenStable().then(() => {
        // 2nd change detection displays the async-fetched hero
        fixture.detectChanges();
      });
    }));
    it('should navigate back when id does not exist', () => {
      console.log(component.hero, 11111111111111);
      expect(locationSpy.back.calls.any()).toBe(true);
    });
  });
});

describe('HeroDetailComponent - no TestBed', () => {
  // let activatedRoute: ActivatedRouteStub;
  let comp: HeroDetailComponent;
  let expectedHero: Hero;
  let locationSpy: any;
  let hds: any;

  beforeEach((done: DoneFn) => {
    expectedHero = {id: 4, name: 'Hero4' };
    const activatedRoute = new ActivatedRouteStub({ id: expectedHero.id });
    locationSpy = jasmine.createSpyObj('Location', ['back']);

    hds = jasmine.createSpyObj('HeroService', ['getHero', 'updateHero']);
    hds.getHero.and.returnValue(defer(() => Observable.of(expectedHero)));
    hds.updateHero.and.returnValue(defer(() => Observable.of(expectedHero)));

    comp = new HeroDetailComponent(<any> activatedRoute, hds, locationSpy);
    comp.ngOnInit();

    // OnInit calls HDS.getHero; wait for it to get the fake hero
    hds.getHero.calls.first().returnValue.subscribe(done);

  });

  it('should expose the hero retrieved from the service', () => {
    expect(comp.hero).toBe(expectedHero);
  });

  it('should navigate back when "Back" button is clicked', () => {
    comp.goBack();
    expect(locationSpy.back.calls.any()).toBe(true, 'router.navigate called');
  });

  it('should save hero when "Save" button is clicked', () => {
    comp.saveHero();
    expect(hds.updateHero.calls.any()).toBe(true);
    expect(locationSpy.back.calls.any()).toBe(true);
  });

});

