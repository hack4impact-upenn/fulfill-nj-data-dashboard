/*
Edit this file to edit which routers are used by the server.
In order to add a router, please 
1) Import it into the file
2) Come up with a prefix for routes which direct to the router. 
The prefix should be of the form '/api/ROUTERNAME'
3) Add an entry with the prefix and imported router to prefixToRouterMap
*/
import { Router } from 'express';
import adminRouter from './admin.route.ts';
import authRouter from './auth.route.ts';
import agencyRouter from './agency.route.ts';
import locationRouter from './location.route.ts'
import zipRouter from './zip.route.ts'

const prefixToRouterMap: { prefix: string; router: Router }[] = [
  {
    prefix: '/api/auth',
    router: authRouter,
  },
  {
    prefix: '/api/admin',
    router: adminRouter,
  },
  {
    prefix: '/api/agency',
    router: agencyRouter,
  },
  {
    prefix: '/api/location',
    router: locationRouter,
  },
  {
    prefix: '/api/zip',
    router: zipRouter,
  },
];

export default prefixToRouterMap;
