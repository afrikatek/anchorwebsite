import { ViteReactSSG } from 'vite-react-ssg';
import { routes } from './routes';
import './i18n';
import './styles/globals.css';

export const createRoot = ViteReactSSG({ routes });
