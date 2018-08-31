import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import {inject, TestBed} from '@angular/core/testing';
import {HttpClient, HttpResponse, HttpErrorResponse, HttpClientModule} from '@angular/common/http';

import { Hero } from './hero';
import { HeroService } from './hero.service';
import {defer, Observable} from 'rxjs';

// function asyncData<T>(data: T) {
//   // return defer(() => Promise.resolve(data));
//   return defer(() => Observable.of(data));
// }

describe('HeroService', () => {
  let httpClientSpy: { get: jasmine.Spy };
  let heroService: HeroService;
  let httpClient: HttpClient;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [HeroService],
      imports: [HttpClientModule, HttpClientTestingModule],
    });
    httpClientSpy = jasmine.createSpyObj('HttpClient', ['get']);
    heroService = new HeroService(<any> httpClientSpy);
  });

  it('should be created', inject([HeroService], (service: HeroService) => {
    expect(service).toBeTruthy();
  }));

  it('should have addHero method', inject([HeroService], (service: HeroService) => {
    expect(service.addHero).toBeTruthy();
  }));

  it('should return expected heroes (HttpClient called once)', () => {
    const expectedHeroes: Hero[] =
      [{ id: 1, name: 'A' }, { id: 2, name: 'B' }];

    httpClientSpy.get.and.returnValue(defer(() => Observable.of(expectedHeroes)));

    heroService.getHeroes().subscribe(
      heroes => expect(heroes).toEqual(expectedHeroes, 'expected heroes'),
      fail
    );
    expect(httpClientSpy.get.calls.count()).toBe(1, 'one call');
  });


});
