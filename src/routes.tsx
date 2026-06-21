import type { RouteRecord } from 'vite-react-ssg';
import App from './App';
import Home from './pages/Home';
import About from './pages/About';
import Services from './pages/Services';
import Classes from './pages/Classes';
import Capacity from './pages/Capacity';
import Team from './pages/Team';
import Contact from './pages/Contact';
import Insights from './pages/Insights';
import InsightDetail from './pages/InsightDetail';
import NotFound from './pages/NotFound';
import { getAllPosts } from './lib/insights';

const insightSlugs = () => getAllPosts().map((p) => p.slug);

// Factory, not a shared array — React Router v6 data router derives route IDs
// from object identity + tree position. Reusing the SAME object reference at
// two tree positions ("/" and "/fr") causes "Found a route id collision on id
// '0-0'" and the entire React tree fails to mount. Calling this twice yields
// two distinct sets of route objects, which gives them distinct IDs.
const buildLocaleChildren = (insightPathPrefix: string): RouteRecord[] => [
  { index: true, Component: Home },
  { path: 'about', Component: About },
  { path: 'services', Component: Services },
  { path: 'classes', Component: Classes },
  { path: 'capacity', Component: Capacity },
  { path: 'team', Component: Team },
  { path: 'contact', Component: Contact },
  { path: 'insights', Component: Insights },
  {
    path: 'insights/:slug',
    Component: InsightDetail,
    getStaticPaths: () => insightSlugs().map((slug) => `${insightPathPrefix}/${slug}`),
  },
];

export const routes: RouteRecord[] = [
  {
    path: '/',
    Component: App,
    children: [
      ...buildLocaleChildren('/insights'),
      {
        path: 'fr',
        children: buildLocaleChildren('/fr/insights'),
      },
      { path: '*', Component: NotFound },
    ],
  },
];
