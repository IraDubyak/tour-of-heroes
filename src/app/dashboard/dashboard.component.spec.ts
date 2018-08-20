import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import {RouterTestingModule} from '@angular/router/testing';
import {RouterModule} from '@angular/router';
import { DashboardComponent } from './dashboard.component';
import {HeroSearchComponent} from '../hero-search/hero-search.component';
import { HttpClientModule } from '@angular/common/http';
import { HeroService } from '../hero.service';

describe('DashboardComponent', () => {
  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
    imports: [RouterTestingModule,
        RouterModule,
        HttpClientModule],
      declarations: [ 
      DashboardComponent,
      HeroSearchComponent ],
      providers: [HeroService],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
