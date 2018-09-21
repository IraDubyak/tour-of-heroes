import {Component, OnInit} from '@angular/core';
import {Hero} from '../hero';
import {HeroService} from '../hero.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  heroes: Hero[] = [];
  len: number;
  title = '';

  constructor(private heroService: HeroService,
              private router: Router) {
  }

  ngOnInit() {
    this.getHeroes();
  }

  getHeroes(): void {
    this.heroService.getHeroes()
      .subscribe(heroes => {
          this.heroes = heroes.slice(1, 5);
          this.len = this.heroes.length;
          this.title = this.len === 0 ? 'No Heroes' : this.len === 1 ? 'Top Hero' : `Top ${this.len} Heroes`;
        }
      );
  }

  onClickHero(hero: Hero) {
    const url = `/detail/${hero.id}`; // /detail/{{hero.id}}
    this.router.navigateByUrl(url);
  }
}
