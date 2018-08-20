import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {RouterTestingModule} from '@angular/router/testing';
import {RouterModule} from '@angular/router';
import {HeroesComponent} from './heroes.component';
import {HttpClientModule} from '@angular/common/http';
import {HeroService} from '../hero.service';
import {Hero} from '../hero';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/observable/from';

describe('HeroesComponent', () => {
  let component: HeroesComponent;
  //let fixture: ComponentFixture<HeroesComponent>;
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
    // fixture = TestBed.createComponent(HeroesComponent);
    // component = fixture.componentInstance;
    // fixture.detectChanges();
    heroService = new HeroService(null, null);
    component = new HeroesComponent(heroService);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set heroes property with the items returned from the server', () => {

    const heroes: Hero[] = [
      {id: 11, name: 'Mr. Nice'},
      {id: 12, name: 'Narco'},
      {id: 13, name: 'Bombasto'},
      {id: 14, name: 'Celeritas'},
      {id: 15, name: 'Magneta'},
      {id: 16, name: 'RubberMan'},
      {id: 17, name: 'Dynama'},
      {id: 18, name: 'Dr IQ'},
      {id: 19, name: 'Magma'},
      {id: 20, name: 'Tornado'}
    ];

    spyOn(heroService, 'getHeroes').and.callFake(() => {

      return Observable.from([heroes]);

    });

    component.ngOnInit();

    expect(component.heroes).toEqual(heroes);

  });
});
