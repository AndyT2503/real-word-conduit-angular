import { Seo } from '../models';
export const signInSeo: Seo = {
  title: 'Sign in - Conduit',
  metaDefinition: [
    {
      name: 'title',
      content: 'Sign in - Conduit',
    },
    {
      name: 'description',
      content: `Login to your Real World Conduits' account to use all functions`,
    },
    {
      name: 'twitter:card',
      content: 'summary',
    },
    {
      name: 'twitter:title',
      content: 'Sign in - Conduit',
    },
    {
      name: 'twitter:description',
      content: `Login to your Real World Conduits' account to use all functions`,
    },
    {
      property: 'og:title',
      content: 'Sign in - Conduit',
    },
    {
      property: 'og:type',
      content: 'website',
    },
    {
      property: 'og:url',
      content: window.location.origin + '/#/login',
    },
    {
      property: 'og:description',
      content: `Login to your Real World Conduits' account to use all functions`,
    },
  ],
};
