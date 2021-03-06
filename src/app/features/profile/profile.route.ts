import { ProfileRepository } from './state/profile.repository';
import { ArticleType, providerArticleType } from './components/profile-article-list/profile-article-list.di';
import { Route } from '@angular/router';

export const profileRoutes: Route[] = [
  {
    path: '',
    providers: [ProfileRepository],
    loadComponent: () =>
      import('./profile.component').then((c) => c.ProfileComponent),
    children: [
      {
        path: '',
        providers: providerArticleType(ArticleType.MyArticle),
        loadComponent: () =>
          import('./components/profile-article-list/profile-article-list.component').then(
            (c) => c.ProfileArticleListComponent
          ),
      },
      {
        path: 'favorites',
        providers: providerArticleType(ArticleType.FavoritedArticle),
        loadComponent: () =>
          import('./components/profile-article-list/profile-article-list.component').then(
            (c) => c.ProfileArticleListComponent
          ),
      },
    ],
  },
];
