import {
  getActivityEventsAsync,
  getAdminAuditLogsAsync,
  getAdminOverviewMetricsAsync,
  getAdminSchoolAnalyticsAsync,
  getAllPromotionsAsync,
  getAllRatingsAsync,
  getAllUsersSanitizedAsync,
  getComparisonAnalyticsAsync,
  getSearchAnalyticsAsync,
  getUserByEmailAsync,
  getUserByIdAsync,
  getWishlistAnalyticsAsync,
} from './authStore';
import { getCanonicalSchools, getSchoolBySlug } from './schools';

type ToolArgs = Record<string, unknown>;

function text(value: unknown): string {
  return typeof value === 'string' ? value.trim() : '';
}

function limitValue(value: unknown, fallback: number, max: number): number {
  const number = typeof value === 'number' ? value : Number(value);
  if (!Number.isFinite(number)) return fallback;
  return Math.min(max, Math.max(1, Math.floor(number)));
}

function sanitizeSchool(school: any) {
  return {
    id: school.id,
    slug: school.slug,
    name: school.name,
    shortName: school.shortName,
    board: school.board,
    curriculum: school.curriculum,
    gradeRange: school.gradeRange,
    schoolType: school.schoolType,
    dayOrBoarding: school.dayOrBoarding,
    location: school.location,
    fees: {
      annualDisplay: school.fees?.annualDisplay || '',
      feeDisplayOverride: school.fees?.feeDisplayOverride || '',
      rangeText: school.fees?.rangeText || '',
      tuitionAnnual: school.fees?.tuitionAnnual || '',
      cardFee: school.fees?.cardFee ?? null,
      isVerified: school.fees?.isVerified === true,
      academicSession: school.fees?.academicSession || school.fees?.academicYear || '',
      source: school.fees?.source || '',
      verifiedDate: school.fees?.verifiedDate || school.fees?.lastVerifiedDate || '',
    },
    admissions: {
      status: school.admissions?.status || '',
      process: school.admissions?.process || '',
      session: school.admissions?.session || school.admissions?.academicYear || '',
      date: school.admissions?.date || null,
      timelineDescription: school.admissions?.timelineDescription || '',
      verificationStatus: school.admissions?.verificationStatus || '',
    },
    rating: {
      score: school.rating?.score || 0,
      reviewsCount: school.rating?.reviewsCount || 0,
    },
    verification: school.verification
      ? {
          isVerified: school.verification.isVerified === true,
          status: school.verification.status,
          lastVerified: school.verification.lastVerified,
          sourceName: school.verification.sourceName,
          cbseAffiliationNumber: school.verification.cbseAffiliationNumber || null,
          schoolCode: school.verification.schoolCode || null,
        }
      : null,
    isArchived: school.isArchived === true,
    isDuplicate: school.isDuplicate === true,
  };
}

function sanitizeUser(user: any) {
  if (!user) return null;
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    status: user.status,
    emailVerified: user.emailVerified === true,
    phone: user.phone || undefined,
    residentialSociety: user.residentialSociety || '',
    preferredSchoolLocality: user.preferredSchoolLocality || '',
    childName: user.childName || '',
    childGrade: user.childGrade || '',
    createdAt: user.createdAt,
    lastLoginAt: user.lastLoginAt,
    lastActivityAt: user.lastActivityAt,
    wishlist: Array.isArray(user.wishlist) ? user.wishlist : [],
    applicationTracker: Array.isArray(user.applicationTracker) ? user.applicationTracker.slice(0, 50) : [],
  };
}

export const ADVIS_TOOL_DECLARATIONS = [
  {
    name: 'get_platform_overview',
    description: 'Gets the current Admission Pitara admin overview metrics. Use for questions about overall platform health, users, profile views, saves, reviews and recent engagement.',
    parameters: {
      type: 'object',
      properties: {
        range: { type: 'string', enum: ['today', '7d', '30d', '90d', 'all'], description: 'Analytics time range.' },
      },
      required: [],
    },
  },
  {
    name: 'list_schools',
    description: 'Lists the current canonical Admission Pitara schools with operational fields. Use when the user asks about the directory as a whole, school availability, admissions, fees, verification, or to find a school.',
    parameters: {
      type: 'object',
      properties: {
        query: { type: 'string', description: 'Optional school name, area, sector or board search.' },
        limit: { type: 'integer', description: 'Maximum schools to return, up to 50.' },
      },
      required: [],
    },
  },
  {
    name: 'get_school',
    description: 'Gets the detailed current Admission Pitara record for one school. The slug or a school-name fragment can be supplied.',
    parameters: {
      type: 'object',
      properties: {
        school: { type: 'string', description: 'School slug or recognizable name.' },
      },
      required: ['school'],
    },
  },
  {
    name: 'get_school_analytics',
    description: 'Gets deep analytics for one Admission Pitara school, including views, unique viewers, repeat viewers, shortlist users, comparison activity, ratings and review records.',
    parameters: {
      type: 'object',
      properties: {
        schoolSlug: { type: 'string', description: 'Canonical school slug.' },
      },
      required: ['schoolSlug'],
    },
  },
  {
    name: 'get_user',
    description: 'Gets a sanitized parent account profile from Admission Pitara by user id or email. Never returns credentials.',
    parameters: {
      type: 'object',
      properties: {
        identifier: { type: 'string', description: 'Parent user id or email address.' },
      },
      required: ['identifier'],
    },
  },
  {
    name: 'get_user_activity',
    description: 'Gets a parent account activity timeline from Admission Pitara for behaviour analysis.',
    parameters: {
      type: 'object',
      properties: {
        userId: { type: 'string', description: 'Parent user id.' },
        limit: { type: 'integer', description: 'Maximum activity events, up to 100.' },
      },
      required: ['userId'],
    },
  },
  {
    name: 'get_activity',
    description: 'Gets recent Admission Pitara activity events, optionally filtered by event type, school or user.',
    parameters: {
      type: 'object',
      properties: {
        limit: { type: 'integer', description: 'Maximum events, up to 200.' },
        type: { type: 'string', description: 'Optional event type filter.' },
        schoolSlug: { type: 'string', description: 'Optional school slug filter.' },
        userId: { type: 'string', description: 'Optional parent user id filter.' },
      },
      required: [],
    },
  },
  {
    name: 'get_reviews',
    description: 'Gets Admission Pitara review records, optionally for a single school. Use for moderation, review health and rating questions.',
    parameters: {
      type: 'object',
      properties: {
        schoolSlug: { type: 'string', description: 'Optional school slug.' },
        status: { type: 'string', enum: ['published', 'deleted', 'all'], description: 'Review status filter.' },
        limit: { type: 'integer', description: 'Maximum reviews, up to 100.' },
      },
      required: [],
    },
  },
  {
    name: 'get_shortlists',
    description: 'Gets Admission Pitara shortlist/wishlist analytics for understanding which schools parents are saving.',
    parameters: {
      type: 'object',
      properties: {
        limit: { type: 'integer', description: 'Maximum result rows, up to 100.' },
      },
      required: [],
    },
  },
  {
    name: 'get_search_and_comparison_intelligence',
    description: 'Gets current Admission Pitara search keywords, localities and school comparison analytics.',
    parameters: { type: 'object', properties: {}, required: [] },
  },
  {
    name: 'get_promotions',
    description: 'Gets current Admission Pitara paid promotion campaigns and their performance state.',
    parameters: { type: 'object', properties: {}, required: [] },
  },
  {
    name: 'get_audit_log',
    description: 'Gets recent Admission Pitara administrative audit records. Use for security and change-history questions.',
    parameters: {
      type: 'object',
      properties: {
        limit: { type: 'integer', description: 'Maximum audit records, up to 150.' },
      },
      required: [],
    },
  },
  {
    name: 'search_admission_pitara',
    description: 'Searches across current Admission Pitara school names and common live operational datasets to locate relevant records before deeper inspection.',
    parameters: {
      type: 'object',
      properties: {
        query: { type: 'string', description: 'Search term.' },
        limit: { type: 'integer', description: 'Maximum school matches, up to 20.' },
      },
      required: ['query'],
    },
  },
  {
    name: 'propose_admin_action',
    description: 'Creates a structured, non-executing proposal for an Admission Pitara administrative mutation. It NEVER changes data. Use when the administrator asks ADVIS to change, delete, archive, restore, edit, publish, pause or otherwise modify something.',
    parameters: {
      type: 'object',
      properties: {
        action: { type: 'string', description: 'Plain-language action to propose.' },
        targetType: { type: 'string', description: 'Target type such as school, user, review, promotion or CMS record.' },
        targetId: { type: 'string', description: 'Exact target identifier.' },
        reason: { type: 'string', description: 'Why the action is proposed.' },
      },
      required: ['action', 'targetType', 'targetId', 'reason'],
    },
  },
] as const;

export async function executeAdvisAdminTool(name: string, args: ToolArgs) {
  switch (name) {
    case 'get_platform_overview':
      return await getAdminOverviewMetricsAsync((text(args.range) || '30d') as 'today' | '7d' | '30d' | '90d' | 'all');

    case 'list_schools': {
      const query = text(args.query).toLowerCase();
      const limit = limitValue(args.limit, 30, 50);
      const schools = getCanonicalSchools()
        .filter(school => {
          if (!query) return true;
          const board = Array.isArray(school.board) ? school.board.join(' ') : text(school.board);
          return [school.name, school.shortName, school.location?.area, school.location?.sector, board]
            .filter(Boolean)
            .some(value => String(value).toLowerCase().includes(query));
        })
        .slice(0, limit)
        .map(sanitizeSchool);
      return { count: schools.length, schools };
    }

    case 'get_school': {
      const query = text(args.school);
      if (!query) return { found: false };
      let school = getSchoolBySlug(query);
      if (!school) {
        const normalized = query.toLowerCase();
        school = getCanonicalSchools().find(item =>
          [item.name, item.shortName, item.slug, ...(item.alternateNames || [])]
            .filter(Boolean)
            .some(value => String(value).toLowerCase().includes(normalized))
        );
      }
      return school ? { found: true, school: sanitizeSchool(school) } : { found: false, query };
    }

    case 'get_school_analytics': {
      const slug = text(args.schoolSlug);
      if (!slug) return { found: false, message: 'schoolSlug is required' };
      const school = getSchoolBySlug(slug);
      if (!school) return { found: false, schoolSlug: slug };
      const analytics = await getAdminSchoolAnalyticsAsync(slug);
      return {
        slug,
        name: school.name,
        traffic: {
          ...analytics.traffic,
          viewerDetails: analytics.traffic.viewerDetails.slice(0, 50),
        },
        engagement: {
          ...analytics.engagement,
          shortlistedByUsers: analytics.engagement.shortlistedByUsers.slice(0, 100),
          reviews: analytics.engagement.reviews.slice(0, 50),
        },
      };
    }

    case 'get_user': {
      const identifier = text(args.identifier);
      if (!identifier) return { found: false };
      const user = identifier.includes('@')
        ? await getUserByEmailAsync(identifier)
        : await getUserByIdAsync(identifier);
      return user ? { found: true, user: sanitizeUser(user) } : { found: false, identifier };
    }

    case 'get_user_activity':
      return {
        userId: text(args.userId),
        events: await getActivityEventsAsync(limitValue(args.limit, 75, 100), { userId: text(args.userId) }),
      };

    case 'get_activity':
      return {
        events: await getActivityEventsAsync(limitValue(args.limit, 100, 200), {
          type: text(args.type) || undefined,
          schoolSlug: text(args.schoolSlug) || undefined,
          userId: text(args.userId) || undefined,
        }),
      };

    case 'get_reviews': {
      const schoolSlug = text(args.schoolSlug);
      const status = text(args.status) || 'all';
      const reviews = (await getAllRatingsAsync() as any[]).filter(review =>
        (!schoolSlug || review.schoolSlug === schoolSlug) &&
        (status === 'all' || review.status === status)
      );
      return { count: reviews.length, reviews: reviews.slice(0, limitValue(args.limit, 50, 100)) };
    }

    case 'get_shortlists':
      return { shortlistAnalytics: (await getWishlistAnalyticsAsync()).slice(0, limitValue(args.limit, 50, 100)) };

    case 'get_search_and_comparison_intelligence':
      return {
        searches: await getSearchAnalyticsAsync(),
        comparisons: await getComparisonAnalyticsAsync(),
      };

    case 'get_promotions':
      return { campaigns: await getAllPromotionsAsync() };

    case 'get_audit_log':
      return { logs: (await getAdminAuditLogsAsync(limitValue(args.limit, 100, 150))).slice(0, 150) };

    case 'search_admission_pitara': {
      const query = text(args.query).toLowerCase();
      if (!query) return { results: [] };
      const matches = getCanonicalSchools()
        .filter(school => [school.name, school.shortName, school.slug, school.location?.area, school.location?.sector]
          .filter(Boolean)
          .some(value => String(value).toLowerCase().includes(query)))
        .slice(0, limitValue(args.limit, 20, 20))
        .map(sanitizeSchool);
      return { results: matches };
    }

    case 'propose_admin_action':
      return {
        proposal: {
          action: text(args.action),
          targetType: text(args.targetType),
          targetId: text(args.targetId),
          reason: text(args.reason),
          status: 'awaiting_explicit_admin_confirmation',
          execution: 'NOT EXECUTED',
        },
      };

    default:
      return { error: `Unknown ADVIS tool: ${name}` };
  }
}
