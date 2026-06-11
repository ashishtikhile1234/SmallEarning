import { Injectable, signal } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, of, catchError } from 'rxjs';
import { Gig, GigCategory } from '../models/gig.model';

const API_BASE = 'http://localhost:8080/api';

// ─── Backend response shape ──────────────────────────────────────────────────
export interface GigApiResponse {
  id: number;
  title: string;
  category: string;
  description: string;
  durationHours: number;
  date: string;
  timeSlot: string;
  location: string;
  payAmount: number;
  payType: 'HOURLY' | 'FIXED';
  slotsAvailable: number;
  status: string;
  createdAt: string;
  employerId: number;
  employerName: string;
}

// ─── Map backend → frontend Gig model ───────────────────────────────────────
const CAT_EMOJI:  Record<string, string> = { CAFE:'☕',BOOKS:'📚',EVENTS:'🎉',RETAIL:'🛍️',TUITION:'📖',OTHER:'✨' };
const CAT_COLOR:  Record<string, string> = { CAFE:'#FF9F43',BOOKS:'#4D96FF',EVENTS:'#C77DFF',RETAIL:'#FF78C4',TUITION:'#6BCB77',OTHER:'#FFD93D' };
const CAT_ACCENT: Record<string, string> = { CAFE:'#FFF3E0',BOOKS:'#E8F1FF',EVENTS:'#F5E8FF',RETAIL:'#FFE8F5',TUITION:'#E8F8EB',OTHER:'#FFFBE8' };

function timeAgo(isoDate: string): string {
  const mins = Math.floor((Date.now() - new Date(isoDate).getTime()) / 60000);
  if (mins < 60) return `${mins} min ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs} hr ago`;
  return `${Math.floor(hrs / 24)} days ago`;
}

function mapToGig(a: GigApiResponse): Gig {
  const cat = (a.category || 'OTHER').toUpperCase();
  return {
    id:          a.id,
    title:       a.title,
    employer:    a.employerName,
    category:    cat.toLowerCase() as GigCategory,
    emoji:       CAT_EMOJI[cat]  || '✨',
    duration:    `${a.durationHours} hour${a.durationHours > 1 ? 's' : ''}`,
    pay:         a.payType === 'HOURLY' ? `₹${a.payAmount}/hr` : `₹${a.payAmount}`,
    payType:     a.payType === 'HOURLY' ? 'hourly' : 'fixed',
    location:    a.location?.split(',')[0] || a.location,
    area:        a.location?.split(',')[1]?.trim() || '',
    slots:       a.slotsAvailable,
    date:        a.date ? new Date(a.date).toLocaleDateString('en-IN',{day:'numeric',month:'short'}) : 'Flexible',
    time:        a.timeSlot || 'Flexible',
    description: a.description || '',
    tags:        [cat.charAt(0)+cat.slice(1).toLowerCase(), `${a.durationHours}h`, a.payType==='HOURLY'?'Hourly Pay':'Fixed Pay'],
    color:       CAT_COLOR[cat]  || '#FFD93D',
    accentColor: CAT_ACCENT[cat] || '#FFFBE8',
    bgPattern:   cat.toLowerCase(),
    isUrgent:    false,
    postedAgo:   a.createdAt ? timeAgo(a.createdAt) : 'Recently',
  };
}

// ─── Mock data (fallback when backend is offline) ────────────────────────────
const MOCK_GIGS: Gig[] = [
  { id:1,title:'Coffee Counter Helper',employer:'Brewed Bliss Cafe',category:'cafe',emoji:'☕',duration:'2 hours',pay:'₹120/hr',payType:'hourly',location:'Pune',area:'Koregaon Park',slots:1,date:'Today',time:'4:00 PM – 6:00 PM',description:'Humari busy evening shift ke liye ek energetic helper chahiye! Kaam hai coffee orders lena, table clean karna aur customers ko smile ke saath greet karna.',tags:['No Experience','Evening Shift','Fun Workplace'],color:'#FF9F43',accentColor:'#FFF3E0',bgPattern:'cafe',isUrgent:true,postedAgo:'30 min ago' },
  { id:2,title:'Book Stall Assistant',employer:'PageTurner Books',category:'books',emoji:'📚',duration:'3 hours',pay:'₹100/hr',payType:'hourly',location:'Pune',area:'FC Road',slots:2,date:'Tomorrow',time:'10:00 AM – 1:00 PM',description:'Ek book lover chahiye jo humari stall pe customers ki help kare.',tags:['Book Lovers','Morning Shift','2 Positions'],color:'#4D96FF',accentColor:'#E8F1FF',bgPattern:'books',isUrgent:false,postedAgo:'2 hrs ago' },
  { id:3,title:'Event Coordinator Helper',employer:'Spark Events Co.',category:'events',emoji:'🎉',duration:'5 hours',pay:'₹800',payType:'fixed',location:'Pune',area:'Viman Nagar',slots:3,date:'Sat, 14 Jun',time:'2:00 PM – 7:00 PM',description:'College farewell party organize karne mein help chahiye!',tags:['Free Food!','Fixed Pay','3 Positions'],color:'#C77DFF',accentColor:'#F5E8FF',bgPattern:'events',isUrgent:false,postedAgo:'1 day ago' },
  { id:4,title:'Retail Store Helper',employer:'StyleZone Clothing',category:'retail',emoji:'🛍️',duration:'4 hours',pay:'₹110/hr',payType:'hourly',location:'Pune',area:'MG Road',slots:1,date:'Today',time:'6:00 PM – 10:00 PM',description:'Weekend evening shift pe humari fashion store mein ek energetic person chahiye.',tags:['Fashion Store','Evening Shift','Urgent!'],color:'#FF78C4',accentColor:'#FFE8F5',bgPattern:'retail',isUrgent:true,postedAgo:'45 min ago' },
  { id:5,title:'Math Tuition Assistant',employer:'BrainBoost Tuitions',category:'tuition',emoji:'📖',duration:'2 hours',pay:'₹150/hr',payType:'hourly',location:'Pune',area:'Kothrud',slots:1,date:'Daily',time:'7:00 PM – 9:00 PM',description:'Class 8-10 ke students ko Math aur Science padhane ke liye helper chahiye.',tags:['Daily Work','Best Pay','Science Students'],color:'#6BCB77',accentColor:'#E8F8EB',bgPattern:'tuition',isUrgent:false,postedAgo:'3 hrs ago' },
];

// ─── Service ─────────────────────────────────────────────────────────────────
@Injectable({ providedIn: 'root' })
export class GigService {

  selectedGig  = signal<Gig | null>(null);
  currentIndex = signal<number>(0);
  loading      = signal<boolean>(false);
  error        = signal<string | null>(null);

  constructor(private http: HttpClient) {}

  getGigs(category?: string, location?: string): Observable<GigApiResponse[]> {
    let params = new HttpParams();
    if (category && category !== 'all') params = params.set('category', category.toUpperCase());
    if (location) params = params.set('location', location);
    return this.http.get<GigApiResponse[]>(`${API_BASE}/gigs`, { params }).pipe(
      catchError(() => of([]))
    );
  }

  getGigById(id: number): Observable<GigApiResponse> {
    return this.http.get<GigApiResponse>(`${API_BASE}/gigs/${id}`);
  }

  applyToGig(gigId: number, message: string): Observable<any> {
    return this.http.post(`${API_BASE}/applications`, { gigId, message });
  }

  mapGig(api: GigApiResponse): Gig    { return mapToGig(api); }
  mapGigs(apis: GigApiResponse[]): Gig[] { return apis.map(mapToGig); }

  getMockGigs(): Gig[]                 { return [...MOCK_GIGS]; }
  getMockGigById(id: number): Gig | undefined { return MOCK_GIGS.find(g => g.id === id); }

  selectGig(gig: Gig)  { this.selectedGig.set(gig); }
  clearSelected()       { this.selectedGig.set(null); }
}
