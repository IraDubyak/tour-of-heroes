import {HttpClientTestingModule, HttpTestingController} from '@angular/common/http/testing';
import {async, fakeAsync, inject, TestBed, tick} from '@angular/core/testing';
import {HttpClient, HttpResponse, HttpErrorResponse, HttpClientModule} from '@angular/common/http';

import {Hero} from './hero';
import {HeroService} from './hero.service';
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
      [{id: 1, name: 'A'}, {id: 2, name: 'B'}];

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
      error => expect(error.message).toContain('test 404 error')
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

    // httpClient = TestBed.get(HttpClient);
    httpTestingController = TestBed.get(HttpTestingController);
    heroService = TestBed.get(HeroService);
  });
  afterEach(() => {
    // After every test, assert that there are no more pending requests.
    httpTestingController.verify();
  });
  it('should return expected heroes', () => {
    const expectedHeroes: Hero[] = [
      new Hero(1, 'Aa'),
      new Hero(2, 'Bb'),
      new Hero(3, 'Cc')
    ];

    heroService.getHeroes().subscribe(
      (data) => {
        expect(data).toEqual(expectedHeroes);
        expect(data.length).toEqual(3);
      },
      fail
    );

    const req = httpTestingController.expectOne(heroService.heroesUrl);

    expect(req.request.method).toBe('GET');
    req.flush(expectedHeroes);
  });
  it('should return expected hero', fakeAsync(() => {
    const expectedHero: Hero = new Hero(1, 'Aa');

    heroService.getHero(expectedHero.id).subscribe(
      (hero) => {
        expect(hero.name).toEqual(expectedHero.name);
      },
      fail
    );

    const req = httpTestingController.expectOne(`${heroService.heroesUrl}/?id=${expectedHero.id}`);
    //
     expect(req.request.method).toBe('GET');
    req.flush(expectedHero);
    tick();
  }));
  it('should return expected heroes multiple times', () => {
    const expectedHeroes: Hero[] = [
      new Hero(1, 'Aa'),
      new Hero(2, 'Bb'),
      new Hero(3, 'Cc')
    ];

    heroService.getHeroes().subscribe();
    heroService.getHeroes().subscribe();
    heroService.getHeroes().subscribe(
      (data) => {
        expect(data).toEqual(expectedHeroes);
        expect(data.length).toEqual(3);
      },
      fail
    );

    const reqs = httpTestingController.match(heroService.heroesUrl);

    expect(reqs[1].request.method).toBe('GET');
    expect(reqs.length).toEqual(3);
    reqs[0].flush([]);
    reqs[1].flush([{id: 1, name: 'Ss'}]);
    reqs[2].flush(expectedHeroes);
  });
  it('should return no heroes', () => {

    heroService.getHeroes().subscribe(
      (data) => {
        expect(data.length).toEqual(0);
      },
      fail
    );

    const req = httpTestingController.expectOne(heroService.heroesUrl);

    expect(req.request.method).toBe('GET');
    req.flush([]);
  });
  it('should update a hero and return it', () => {

    const updateHero: Hero = {id: 1, name: 'A'};

    heroService.updateHero(updateHero).subscribe(
      data => expect(data.name).toEqual('A', 'should return the hero'),
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

    req.flush(updateHero);
  });
  it('should delete expected hero', () => {
    const expectedHero: Hero = new Hero(1, 'Aa');

    heroService.deleteHero(expectedHero.id).subscribe(
      (id: any) => {
        expect(id).toEqual(expectedHero.id);
      },
      fail
    );

    const req = httpTestingController.expectOne(`${heroService.heroesUrl}/${expectedHero.id}`);

    expect(req.request.method).toBe('DELETE');
    const expectedResponse = new HttpResponse(
      { status: 200, statusText: 'OK', body: expectedHero.id });
    req.event(expectedResponse);
    req.flush(1);
  });
  it('should add a hero', () => {

    const addHero: Hero = {id: 19, name: 'A'};

    heroService.addHero(addHero).subscribe(
      data => expect(data.name).toEqual(addHero.name, 'should return the hero'),
      fail
    );

    const req = httpTestingController.expectOne(heroService.heroesUrl);
    expect(req.request.method).toEqual('POST');
    expect(req.request.body).toEqual(addHero);

    const expectedResponse = new HttpResponse(
      { status: 200, statusText: 'OK', body: addHero });
    req.event(expectedResponse);
    req.flush(addHero);
  });
  it('should turn 404', () => {
    const msg = 'Error';
    heroService.getHeroes().subscribe(
      heroes => fail('expected to fail'),
      error => expect(error.message).toContain(msg)
    );

    const req = httpTestingController.expectOne(heroService.heroesUrl);

    // respond with a 404 and the error message in the body
    req.flush(msg, {status: 404, statusText: 'Not Found'});
  });
});

