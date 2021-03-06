import { MetaDefinition } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
} from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Observable, of, switchMap, tap } from 'rxjs';
import { Article, User } from 'src/app/core/models';
import {
  ArticleRepository,
  AuthRepository,
  UserRepository,
} from 'src/app/core/state';
import { CommentFormComponent } from './components/comment-form/comment-form.component';
import { CommentListComponent } from './components/comment-list/comment-list.component';
import { environment } from 'src/environments/environment';
import { SeoService } from 'src/app/shared/services';

@UntilDestroy()
@Component({
  selector: 'app-article-detail',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    CommentListComponent,
    CommentFormComponent,
  ],
  templateUrl: './article-detail.component.html',
  styleUrls: ['./article-detail.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ArticleDetailComponent implements OnInit {
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly articleRepository = inject(ArticleRepository);
  private readonly authRepository = inject(AuthRepository);
  private readonly router = inject(Router);
  private readonly userRepository = inject(UserRepository);
  private readonly seoService = inject(SeoService);
  author!: User;

  readonly isAuthenticated$ = this.authRepository.isAuthenticated$;
  readonly authUser$ = this.authRepository.authUser$;

  article!: Article;

  ngOnInit(): void {
    this.loadArticleInfo();
  }

  get checkFavoritedArticle(): Observable<boolean> {
    return this.authRepository.authUser$.pipe(
      switchMap((user) => {
        if (!user) {
          return of(false);
        } else {
          return of(!!user?.favoritedArticles?.includes(this.article.id));
        }
      })
    );
  }

  loadArticleInfo(): void {
    this.activatedRoute.params
      .pipe(
        switchMap((params) => {
          const articles =
            this.articleRepository.articleStore.getValue().articles;
          const article = articles?.find((x) => x.slug === params['slug']);
          if (!article) {
            this.router.navigate(['']);
          }
          this.article = article!;
          this.setSeoData(this.article);
          return this.userRepository.getUserById(this.article.userId);
        }),
        tap((user) => (this.author = user)),
        untilDestroyed(this)
      )
      .subscribe();
  }

  setSeoData(article: Article): void {
    const metaDefinition: MetaDefinition[] = [
      {
        name: 'title',
        content: `${article.title} - Conduit`,
      },
      {
        name: 'description',
        content: article.description,
      },
      {
        name: 'twitter:card',
        content: 'summary',
      },
      {
        name: 'twitter:title',
        content: `${article.title} - Conduit`,
      },
      {
        name: 'twitter:description',
        content: article.description,
      },
      {
        property: 'og:title',
        content: `${article.title} - Conduit`,
      },
      {
        property: 'og:type',
        content: 'website',
      },
      {
        property: 'og:url',
        content: environment.appDomain + '/#/article/' + article.slug,
      },
      {
        property: 'og:description',
        content: article.description,
      },
    ];
    this.seoService.setMetaTags(metaDefinition);
  }

  deleteArticle(id: number): void {
    this.articleRepository.deleteArticle(id);
    this.router.navigate(['']);
  }

  favoriteArticle(id: number): void {
    if (!this.authRepository.authStore.getValue().user) {
      this.router.navigate(['/register']);
      return;
    }
    this.articleRepository.updateFavoriteArticle(id);
  }

  unfavoriteArticle(id: number): void {
    this.articleRepository.updateUnfavoriteArticle(id);
  }
}
