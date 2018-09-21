import {
  TestBed,
  ComponentFixture, async, fakeAsync
} from '@angular/core/testing';
import {Observable} from 'rxjs/rx';
import {RouterTestingModule} from '@angular/router/testing';

import {HeroesComponent} from './heroes.component';
import {HeroService} from '../hero.service';
import {Hero} from '../hero';
import {HttpClientModule} from '@angular/common/http';
import {RouterModule} from '@angular/router';


/*-----------With injecting real service in component-----------*/
describe('HeroesComponent', () => {
  let component: HeroesComponent;
  let fixture: ComponentFixture<HeroesComponent>;
  let heroService: HeroService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule,
        RouterModule,
        HttpClientModule],
      // providers: [HeroService],
      declarations: [HeroesComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HeroesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set heroes property with the items returned from the server', () => {
    heroService = new HeroService(null);
    component = new HeroesComponent(heroService);
    const heroes: Hero[] = [
      {id: 1, name: 'dggfg'},
      {id: 2, name: 'gdfgdg'},
      {id: 3, name: 'qwetfgr'}
    ];

    spyOn(heroService, 'getHeroes').and.callFake(() => {

      return Observable.from([heroes]);

    });

    component.ngOnInit();

    expect(component.heroes).toEqual(heroes);

  });

  it('should delete the hero from the heroes array within the component', () => {
    heroService = new HeroService(null);
    component = new HeroesComponent(heroService);
    component.heroes = [
      {id: 1, name: 'Hero1'},
      {id: 2, name: 'Hero2'}
    ];

    spyOn(heroService, 'deleteHero').and.returnValue(
      Observable.from([null])
    );

    const heroId = 2;
    component.delete(heroId);

    const index = component.heroes.findIndex(
      hero => hero.id === heroId
    );
    expect(index).toBeLessThan(0);
  });
  it('should add the hero to the heroes array within the component', () => {
    heroService = new HeroService(null);
    component = new HeroesComponent(heroService);
    component.heroes = [
      {id: 2, name: 'Hero2'}
    ];

    spyOn(heroService, 'addHero').and.returnValue(
      Observable.from([{id: 3, name: 'Hero3'}])
    );

    const newHero = 'Hero3';
    component.add(newHero);

    expect(component.heroes.length).toEqual(2);
    expect(component.heroes).toEqual([
      {id: 2, name: 'Hero2'},
      {id: 3, name: 'Hero3'}
    ]);
  });
});
describe('HeroesComponent (async)', () => {
  let fixture: ComponentFixture<HeroesComponent>;
  let component: HeroesComponent;
  let service: HeroService;
  let heroes: Hero[];

  beforeEach(() => {
    heroes = [
      {
        id: 1,
        name: 'p1'
      },
      {
        id: 2,
        name: 'p2'
      }
    ];

    TestBed.configureTestingModule({
      declarations: [HeroesComponent],
      imports: [RouterTestingModule, HttpClientModule],
      providers: [HeroService]
    });

    fixture = TestBed.createComponent(HeroesComponent);
    component = fixture.componentInstance;
    service = TestBed.get(HeroService);
  });

  afterEach(() => {
    heroes = [];
  });

  it('should set heroes property with the items returned from the server (Observable)', fakeAsync(() => {
    spyOn(service, 'getHeroes').and.returnValue(
      Observable.from([heroes])
    );

    fixture.detectChanges();

    expect(component.heroes).toEqual(heroes);
  }));
  it('1st hero should match test hero', () => {
    spyOn(service, 'getHeroes').and.returnValue(
      Observable.from([heroes])
    );

    const expHero: Hero = heroes[0];
    fixture.detectChanges();
    const actualHero = fixture.nativeElement.querySelectorAll('a')[0].textContent;

    expect(actualHero).toContain(expHero.name);
    expect(actualHero).toContain(expHero.id);
  });
});



describe('HeroesComponent with spy object (TestBed)', () => {
  let component: HeroesComponent;
  let heroService: jasmine.SpyObj<HeroService>;
  let fixture: ComponentFixture<HeroesComponent>;
  let heroes: Hero[];

  beforeEach(async(() => {
    const spy = jasmine.createSpyObj('HeroService', ['getHeroes', 'addHero', 'deleteHero']); // for creating fake methods spy on an object representing the HeroService
    heroes = [
      {id: 1, name: 'Hero1'},
      {id: 2, name: 'Hero2'}
    ];
    TestBed.configureTestingModule({
      declarations: [HeroesComponent],
      imports: [RouterTestingModule, HttpClientModule],
      providers: [
        {provide: HeroService, useValue: spy}]
    }).compileComponents().then(() => {
        fixture = TestBed.createComponent(HeroesComponent);
        component = fixture.componentInstance;
        heroService = TestBed.get(HeroService);
      }
    );
  }));
  function getTestHeroes() {
    heroService.getHeroes.and.returnValue(
      Observable.from([heroes])
    );
  }
  it('should display heroes', () => {
    getTestHeroes();
    fixture.detectChanges();
    const displayedHeroes = fixture.nativeElement.querySelectorAll('a');
    expect(displayedHeroes.length).toBe(2);
  });

  it('1st hero should match test hero', () => {
    getTestHeroes();

    const expHero: Hero = heroes[0];
    fixture.detectChanges();
    const actualHero = fixture.nativeElement.querySelectorAll('a')[0].textContent;

    expect(actualHero).toContain(expHero.name);
    expect(actualHero).toContain(expHero.id);
  });

  it('should set heroes property with the items returned from the server', () => {
    getTestHeroes();

    component.ngOnInit();

    expect(component.heroes).toEqual(heroes);
  });

  it('should delete the hero from the heroes array within the component', () => {
    component.heroes = heroes;

    heroService.deleteHero.and.returnValue(
      Observable.from([null])
    );

    const heroId = 2;
    component.delete(heroId);

    const index = component.heroes.findIndex(
      hero => hero.id === heroId
    );
    expect(index).toBeLessThan(0);
  });
  it('should add the hero to the heroes array within the component', () => {
    component.heroes = heroes;

    heroService.addHero.and.returnValue(
      Observable.of({id: 3, name: 'Hero3'})
    );

    const newHero = 'Hero3';
    component.add(newHero);

    expect(component.heroes.length).toEqual(3);
    expect(component.heroes).toEqual([
      {id: 1, name: 'Hero1'},
      {id: 2, name: 'Hero2'},
      {id: 3, name: 'Hero3'}
    ]);
  });
});
