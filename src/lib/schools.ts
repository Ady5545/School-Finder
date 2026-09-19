import {schools,legacyUrlMap,getSchoolBySlug as bySlug,resolveLegacyUrl as resolve} from '../../data/schoolsData';
export const getAllSchools=(_opts?:unknown)=>schools;
export const getSchoolBySlug=(slug:string)=>bySlug(slug);
export const getAllSchoolSlugs=()=>schools.map(s=>s.slug);
export const getCanonicalSlug=(slug:string)=>bySlug(slug)?.slug;
export const getSchoolByLegacyFile=(file:string)=>resolve(file);
export const resolveLegacyUrl=(url:string)=>resolve(url);
export const getDistinctBoards=()=>Array.from(new Set(schools.flatMap(s=>Array.isArray(s.board)?s.board:[s.board]).filter(Boolean)));
export const getDistinctAreas=()=>Array.from(new Set(schools.map(s=>s.location?.area).filter(Boolean) as string[]));
export const getPopularSchools=(n=6)=>schools.filter(s=>s.status!=='archived').slice(0,n);
export function filterSchools({q,board,area}:{q?:string;board?:string;area?:string}={}){let r=schools;if(q){const x=q.toLowerCase();r=r.filter(s=>s.name.toLowerCase().includes(x)||(s.location?.address||'').toLowerCase().includes(x))}if(board)r=r.filter(s=>(Array.isArray(s.board)?s.board:[s.board]).some(b=>b?.toLowerCase()===board.toLowerCase()));if(area)r=r.filter(s=>s.location?.area?.toLowerCase()===area.toLowerCase());return r}
export {schools,legacyUrlMap};