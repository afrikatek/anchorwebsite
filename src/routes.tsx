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

const baseChildren: RouteRecord[] = [
  { index: true, Component: Home },
  { path: 'about', Component: About },
  { path: 'services', Component: Services },
  { path: 'classes', Component: Classes },
  { path: 'capacity', Component: Capacity },
  { path: 'team', Component: Team },
  { path: 'contact', Component: Contact },
  { path: 'insights', Component: Insights },
];

export const routes: RouteRecord[] = [
  {
    path: '/',
    Component: App,
    children: [
      ...baseChildren,
      {
        path: 'insights/:slug',
        Component: InsightDetail,
        getStaticPaths: () => insightSlugs().map((slug) => `/insights/${slug}`),
      },
      {
        path: 'fr',
        children: [
          ...baseChildren,
          {
            path: 'insights/:slug',
            Component: InsightDetail,
            getStaticPaths: () => insightSlugs().map((slug) => `/fr/insights/${slug}`),
          },
        ],
      },
      { path: '*', Component: NotFound },
    ],
  },
];
