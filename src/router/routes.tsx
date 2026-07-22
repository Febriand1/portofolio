import Home from '../pages/Home';
import Projects from '../pages/Projects';
import ProjectDetail from '../pages/ProjectDetail';
import About from '../pages/About';
import Experience from '../pages/Experience';
import Contact from '../pages/Contact';
import Admin from '../pages/Admin';
import NotFound from '../pages/NotFound';
import Restricted from '../pages/Restricted';
import JobApplications from '../pages/JobApplications';

export const appRoutes = [
  { index: true, element: <Home /> },
  { path: 'projects', element: <Projects /> },
  { path: 'projects/:id', element: <ProjectDetail /> },
  { path: 'about', element: <About /> },
  { path: 'experience', element: <Experience /> },
  { path: 'contact', element: <Contact /> },
  { path: 'jobs', element: <JobApplications /> },
  { path: 'admin', element: <Admin /> },
  { path: 'restricted', element: <Restricted /> },
  { path: '*', element: <NotFound /> },
];
