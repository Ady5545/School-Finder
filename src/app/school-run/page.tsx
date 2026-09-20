import React from 'react';
import { Breadcrumbs } from '../../components/ui/Breadcrumbs';
import { buildPageMetadata } from '../../lib/seo';
import SchoolRunContent from '../../components/school/SchoolRunContentView';

export const metadata = { ...buildPageMetadata('School Run Planner for Shortlisted Schools in Greater Noida West','See your saved society and shortlisted schools together on a route map, with distance and travel-time information for school visits, PTMs and daily drop-off planning.','/school-run'), robots: { index:false, follow:false } };
export const dynamic='force-dynamic';

export default function SchoolRunPage(){
  return <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full flex flex-col flex-1">
    <Breadcrumbs items={[{label:'Shortlist',href:'/wishlist'},{label:'School Run',isCurrent:true}]} className="mb-4"/>
    <div className="pb-6 mb-2">
      <div className="inline-flex items-center rounded-full bg-[#eef6fb] text-[var(--color-primary)] px-3 py-1 text-[10px] font-black uppercase tracking-[0.14em]">Parent planning</div>
      <h1 className="text-2xl sm:text-3xl font-extrabold text-[var(--color-content)] tracking-tight mt-2">Plan your school run</h1>
      <p className="text-xs sm:text-sm text-[var(--color-content-muted)] mt-1 max-w-2xl">See your saved society, shortlisted schools, actual routes and travel times together—so distance becomes something you can plan around.</p>
    </div>
    <SchoolRunContent/>
  </div>;
}