import {TestBed, inject} from '@angular/core/testing';
import {HttpClientModule} from '@angular/common/http';
import {HeroService} from './hero.service';

describe('HeroService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [HeroService],
      imports: [HttpClientModule],
    });
  });

  it('should be created', inject([HeroService], (service: HeroService) => {
    expect(service).toBeTruthy();
  }));

  it('should have addHero method', inject([HeroService], (service: HeroService) => {
    expect(service.addHero).toBeTruthy();
  }));
});
