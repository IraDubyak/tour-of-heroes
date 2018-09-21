import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {RouterTestingModule} from '@angular/router/testing';
import {Router, RouterModule} from '@angular/router';
import {DashboardComponent} from './dashboard.component';
import {HeroSearchComponent} from '../hero-search/hero-search.component';
import {HttpClientModule} from '@angular/common/http';
import {HeroService} from '../hero.service';
import {Hero} from '../hero';
import {HeroesComponent} from '../heroes/heroes.component';
import {Observable} from '../../../node_modules/rxjs/Rx';
import {defer} from 'rxjs';

describe('DashboardComponent', () => {
  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;
  let router: Router;
  let expectedHeroes: Hero[];
  // let heroService: jasmine.SpyObj<HeroService>;

  beforeEach(async(() => {
    const routerSpy = jasmine.createSpyObj('Router', ['navigateByUrl']);
    const heroServiceSpy = jasmine.createSpyObj('HeroService', ['getHeroes']);
    expectedHeroes = [
      {id: 1, name: 'Hero1'},
      {id: 2, name: 'Hero2'},
      {id: 3, name: 'Hero3'},
      {id: 4, name: 'Hero4'},
      {id: 5, name: 'Hero5'},
      {id: 6, name: 'Hero6'}
    ];
    TestBed.configureTestingModule({
      imports: [RouterTestingModule,
        RouterModule,
        HttpClientModule],
      declarations: [
        DashboardComponent,
        HeroSearchComponent],
      providers: [
        {provide: HeroService, useValue: heroServiceSpy},
        {provide: Router, useValue: routerSpy}
      ]
    })
      .compileComponents().then(() => {
      fixture = TestBed.createComponent(DashboardComponent);
      component = fixture.componentInstance;

      // getHeroes spy returns observable of expectedHeroes
      heroServiceSpy.getHeroes.and.returnValue(defer(() => Observable.of(expectedHeroes)));
      router = TestBed.get(Router);
      // Trigger component so it gets heroes and binds to them
      fixture.detectChanges(); // runs ngOnInit -> getHeroes
    });
  }));

  // beforeEach(async(() => {
  //   // fixture.whenStable() // No need for the lastPromise hack!
  //   //   .then(() => fixture.detectChanges());
  // }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should navigate to hero details when hero is clicked (fixture, nativeEl.click())', () => {

    const heroElement: HTMLElement = fixture.nativeElement.querySelector('a');
    heroElement.click(); // click on first hero in dashboard

    // args passed to router.navigateByUrl() spy
    const spy = router.navigateByUrl as jasmine.Spy;
    const navArgs = spy.calls.mostRecent().args[0];

    const id = component.heroes[0].id;
    expect(navArgs).toBe('/detail/' + id);
  });

  it( 'should display heroes', () => {
    const displayedHeroes = fixture.nativeElement.querySelectorAll('a');
    const firstHero = fixture.nativeElement.querySelectorAll('a div h4')[0].textContent;
    expect(displayedHeroes.length).toBe(4);
    expect(firstHero).toBe(expectedHeroes[1].name);
  });
});

class FakeRouter {
  navigateByUrl(url: string) {
    return url;
  }
}

describe('DashboardComponent no TestBed', () => {
  let heroServiceSpy: jasmine.SpyObj<HeroService>;
  let component: DashboardComponent;
  let router: Router;

  beforeEach(() => {
    heroServiceSpy = jasmine.createSpyObj('HeroService', ['getHeroes']);
    router = new FakeRouter() as any as Router;
    // heroService = new HeroService( spy);
    component = new DashboardComponent(heroServiceSpy, router);
  });

  it('should NOT have heroes before calling OnInit', () => {
    expect(component.heroes.length).toBe(0,
      'should not have heroes before OnInit');
  });

  it('should set heroes property with the items returned from the server', () => {
    const heroes: Hero[] = [
      {id: 1, name: 'a'},
      {id: 2, name: 'b'},
      {id: 3, name: 'c'},
      {id: 4, name: 'd'},
      {id: 5, name: 'e'},
      {id: 6, name: 'f'},
    ];

    heroServiceSpy.getHeroes.and.callFake(() => {
      return Observable.from([heroes]);
    });

    component.ngOnInit();
    console.log(heroes.slice(1, 5));
    console.log(component.heroes);
    expect(component.heroes).toEqual(heroes.slice(1, 5));
  });

  it('should say "No hero" if array of heroes is empty', () => {
    const heroes: Hero[] = [];

    heroServiceSpy.getHeroes.and.callFake(() => {
      return Observable.from([heroes]);
    });

    component.ngOnInit();

    console.log(component.title);
    expect(component.title).toBe('No Heroes');
  });
  it('should navigate to hero details when hero is clicked', () => {
    const hero: Hero = {id: 1, name: 'Hero1'};
    const spy = spyOn(router, 'navigateByUrl');

    component.onClickHero(hero);

    const navArgs = spy.calls.mostRecent().args[0];
    expect(navArgs).toBe('/detail/1', 'should nav to HeroDetail for Hero 42');
  });
});
