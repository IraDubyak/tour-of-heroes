// import {async, ComponentFixture, TestBed} from '@angular/core/testing';
// import {RouterTestingModule} from '@angular/router/testing';
// import {RouterModule} from '@angular/router';
// import {HeroesComponent} from './heroes.component';
// import {HttpClientModule} from '@angular/common/http';
// import {HeroService} from '../hero.service';
// import {Hero} from '../hero';
// import {Observable} from 'rxjs/Observable';
// import { Observable } from 'rxjs/rx';
// import 'rxjs/add/observable/from';
// import 'rxjs/add/observable/empty';

import {
  TestBed,
  ComponentFixture, async
} from '@angular/core/testing';
import { Observable } from 'rxjs/rx';
import { RouterTestingModule } from '@angular/router/testing';

import {HeroesComponent} from './heroes.component';
import {HeroService} from '../hero.service';
import {Hero} from '../hero';
import {HttpClientModule} from '@angular/common/http';
import {RouterModule} from '@angular/router';

describe('HeroesComponent', () => {
  let component: HeroesComponent;
  let fixture: ComponentFixture<HeroesComponent>;
  let heroService: HeroService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule,
        RouterModule,
        HttpClientModule],
      providers: [HeroService],
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
  })

  it('should set heroes property with the items returned from the server (Observable)', () => {
    spyOn(service, 'getHeroes').and.returnValue(
      Observable.from([heroes])
    );

    fixture.detectChanges();

    expect(component.heroes).toEqual(heroes);
  });
});
