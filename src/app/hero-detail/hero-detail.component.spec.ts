import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import {FormsModule} from '@angular/forms';
import { HeroDetailComponent } from './hero-detail.component';
import { HttpClientModule } from '@angular/common/http';
import {HttpModule} from '@angular/http';
import { HeroService } from '../hero.service';
import {RouterTestingModule} from '@angular/router/testing';

describe('HeroDetailComponent', () => {
  let component: HeroDetailComponent;
  let fixture: ComponentFixture<HeroDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
    imports: [FormsModule,
    HttpClientModule,
    HttpModule,
    RouterTestingModule.withRoutes([{ path: 'detail/:id', component: HeroDetailComponent }])],
      declarations: [ HeroDetailComponent ],
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
});
