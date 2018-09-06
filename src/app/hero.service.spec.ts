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

  beforeEach(() => {
    httpClientSpy = jasmine.createSpyObj('HttpClient', ['get']);
    heroService = new HeroService(<any> httpClientSpy);
  });

  it('should be created', () => {
    expect(heroService).toBeTruthy();
  });

  it('should have addHero method', () => {
    expect(heroService.addHero).toBeTruthy();
  });

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

  it('should return an error when the server returns an error', () => {
    const errorResponse = new HttpErrorResponse({
      error: 'test 404 error',
      status: 404,
      statusText: 'Not Found'
    });

    httpClientSpy.get.and.returnValue(defer(() => Promise.reject(errorResponse)));

    heroService.getHeroes().subscribe(
      heroes => fail('expected an error, not heroes'),
      error  => expect(error.message).toContain('test 404 error')
    );
  });

});

describe('HeroService with mocks', () => {
  let httpClient: HttpClient;
  let httpTestingController: HttpTestingController;
  let heroService: HeroService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      // Import the HttpClient mocking services
      imports: [HttpClientTestingModule],
      // Provide the service-under-test and its dependencies
      providers: [
        HeroService
      ]
    });

    httpClient = TestBed.get(HttpClient);
    httpTestingController = TestBed.get(HttpTestingController);
    heroService = TestBed.get(HeroService);
  });
  it('should update a hero and return it', () => {

    const updateHero: Hero = {id: 1, name: 'A'};

    heroService.updateHero(updateHero).subscribe(
      data => expect(data).toEqual(updateHero, 'should return the hero'),
      fail
    );

    // HeroService should have made one request to PUT hero
    const req = httpTestingController.expectOne(heroService.heroesUrl);
    expect(req.request.method).toEqual('PUT');
    expect(req.request.body).toEqual(updateHero);

    // Expect server to return the hero after PUT
    const expectedResponse = new HttpResponse(
      {status: 200, statusText: 'OK', body: updateHero});
    req.event(expectedResponse);
  });
});
// describe('HeroService with spy', () => {
//   let heroService: HeroService;
//
//   it('should update a hero and return it', () => {
//     const httpClientSpy = jasmine.createSpyObj('HttpClient', ['put']);
//     heroService = new HeroService(<any> httpClientSpy);
//     const updateHero: Hero = {id: 1, name: 'A'};
//
//     httpClientSpy.put.and.returnValue(defer(() => Observable.of(updateHero)));
//     heroService.updateHero(updateHero).subscribe(
//       data => expect(data).toEqual(updateHero, 'should return the hero'),
//       fail
//     );
//   });
// });
