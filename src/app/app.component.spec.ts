import {TestBed, async} from '@angular/core/testing';
import {AppComponent} from './app.component';
import {RouterTestingModule} from '@angular/router/testing';
import {FormsModule} from '@angular/forms';
import {RouterModule} from '@angular/router';
import {HttpClientTestingModule, HttpTestingController} from '@angular/common/http/testing';
import {HeroService} from './hero.service';

describe('AppComponent', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({

      imports: [RouterTestingModule,
        FormsModule,
        RouterModule,
        HttpClientTestingModule],
      declarations: [
        AppComponent
      ],
      providers: [HeroService]
    }).compileComponents();
  }));
  it('should create the app', async(() => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  }));
  it(`should have as title 'Tour of heroes'`, async(() => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app.title).toEqual('Tour of heroes');
  }));
  it('should render title in a h1 tag', async(() => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelector('h1').textContent).toContain('Tour of heroes');
  }));
  it('should have gray background', async(() => {
    const fixture = TestBed.createComponent(AppComponent);
    const h1 = fixture.debugElement.nativeElement.querySelector('h1');
    expect(h1.style.backgroundColor).toBe('rgba(192, 192, 192, 0.3)');
  }));

});
