import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {FormsModule} from '@angular/forms';
import {HeroDetailComponent} from './hero-detail.component';
import {HttpClientModule} from '@angular/common/http';
import {HeroService} from '../hero.service';
import {RouterTestingModule} from '@angular/router/testing';
import {AppComponent} from '../app.component';

describe('HeroDetailComponent', () => {
  let component: HeroDetailComponent;
  let fixture: ComponentFixture<HeroDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [FormsModule,
        HttpClientModule,
        RouterTestingModule.withRoutes([{path: 'detail/:id', component: HeroDetailComponent}])],
      declarations: [HeroDetailComponent],
      providers: [HeroService],
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HeroDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should pass twice, passes but because of two way data binding ngModel', async(() => {
    component.hero = {id: 1, name: 'fretfreg'};
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      const input = fixture.debugElement.nativeElement.querySelector('#inputHero');
      expect(input.value).toEqual(component.hero.name);
      input.value = 'MyHero';

      fixture.detectChanges();
      input.dispatchEvent(new Event('input'));

      expect(fixture.componentInstance.hero.name).toContain('MyHero');
    });
  }));
});
