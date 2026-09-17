import * as XLSX from 'xlsx';
import {
  getAllUsersSanitized,
  getActivityEvents,
  getAllRatings,
  getUserById,
  getSchoolRatingStats,
  getAllSchoolsAdminOverview,
} from './authStore';
import { getCanonicalSchools, getSchoolBySlug } from './schools';

// Indian Standard Time (IST) is UTC+05:30 (5 hours 30 minutes ahead of UTC)
const IST_OFFSET_MS = 5.5 * 60 * 60 * 1000;

/**
 * Calculates start and end timestamps (in UTC epoch ms) for a given calendar month
 * in Indian Standard Time (IST / Asia/Kolkata).
 *
 * Example for September 2026:
 * - Start: 2026-09-01 00:00:00.000 IST => 2026-08-31T18:30:00.000Z UTC
 * - End:   2026-09-30 23:59:59.999 IST => 2026-09-30T18:29:59.999Z UTC
 */
export function getISTMonthBoundaries(year: number, month: number) {
  const startOfMonthIST = new Date(Date.UTC(year, month - 1, 1, 0, 0, 0, 0) - IST_OFFSET_MS);
  const endOfMonthIST = new Date(Date.UTC(year, month, 0, 23, 59, 59, 999) - IST_OFFSET_MS);
  return {
    startTime: startOfMonthIST.getTime(),
    endTime: endOfMonthIST.getTime(),
    startIso: startOfMonthIST.toISOString(),
    endIso: endOfMonthIST.toISOString(),
  };
}

/**
 * Formats a UTC ISO string into a clean Indian Standard Time representation
 */
export function formatISTDateTime(isoString: string | null | undefined): string {
  if (!isoString) return 'N/A';
  try {
    const d = new Date(isoString);
    if (isNaN(d.getTime())) return 'N/A';
    return d.toLocaleString('en-IN', {
      timeZone: 'Asia/Kolkata',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    }) + ' IST';
  } catch {
    return isoString;
  }
}

/**
 * Generates a multi-sheet Excel workbook (.xlsx) containing real Admission Pitara
 * platform telemetry, parent accounts, school visits, wishlists, reviews, and school summaries
 * filtered strictly to the specified Indian Standard Time (IST / Asia/Kolkata) calendar month.
 *
 * @param year e.g. 2026
 * @param month 1-indexed (1 = January, 12 = December)
 * @returns Buffer containing valid .xlsx binary data
 */
export function generateMonthlyExcelReport(year: number, month: number): Buffer {
  // 1. Calculate strict IST calendar month boundaries
  const { startTime, endTime } = getISTMonthBoundaries(year, month);

  const formattedMonth = month.toString().padStart(2, '0');
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
  ];
  const monthName = monthNames[month - 1] || `Month ${month}`;
  const periodLabel = `${monthName} ${year} (IST)`;

  const wb = XLSX.utils.book_new();

  // --------------------------------------------------------------------------
  // SHEET 1: PARENT ACCOUNTS
  // --------------------------------------------------------------------------
  const allUsers = getAllUsersSanitized();
  const usersInMonth = allUsers.filter(u => {
    const createdTime = new Date(u.createdAt).getTime();
    return createdTime >= startTime && createdTime <= endTime;
  });

  const parentAccountHeaders = [
    'Parent / Guardian Name',
    'Email Address',
    'Phone Number (Profile Data)',
    'Child / Student Name',
    'Grade / Class',
    'Residential Society / Complex',
    "Father's Name",
    "Mother's Name",
    'Email Verification Status',
    'Account Status',
    'Account Created (IST)',
    'Last Login Date (IST)',
  ];

  const parentAccountRows: (string | number)[][] = [];

  if (usersInMonth.length > 0) {
    for (const u of usersInMonth) {
      parentAccountRows.push([
        u.name || 'Not provided',
        u.email || '',
        u.phone || 'Not provided',
        u.childName || 'Not provided',
        u.childGrade || 'Not provided',
        u.residentialSociety || 'Not provided',
        u.fatherName || 'Not provided',
        u.motherName || 'Not provided',
        u.emailVerified ? 'Verified' : 'Pending Verification',
        u.status || 'active',
        formatISTDateTime(u.createdAt),
        u.lastLoginAt ? formatISTDateTime(u.lastLoginAt) : 'Never logged in',
      ]);
    }
  } else {
    parentAccountRows.push([
      `No parent accounts registered in ${periodLabel}.`,
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
    ]);
  }

  const ws1Data = [parentAccountHeaders, ...parentAccountRows];
  const ws1 = XLSX.utils.aoa_to_sheet(ws1Data);
  ws1['!cols'] = [
    { wch: 26 }, // Name
    { wch: 30 }, // Email
    { wch: 22 }, // Phone
    { wch: 24 }, // Child name
    { wch: 18 }, // Grade
    { wch: 34 }, // Residential Society
    { wch: 22 }, // Father
    { wch: 22 }, // Mother
    { wch: 25 }, // Email verified
    { wch: 16 }, // Status
    { wch: 24 }, // Created IST
    { wch: 24 }, // Last login IST
  ];
  XLSX.utils.book_append_sheet(wb, ws1, 'Parent Accounts');

  // --------------------------------------------------------------------------
  // SHEET 2: SCHOOL VISITS
  // --------------------------------------------------------------------------
  // Retrieve all activity events up to maximum store capacity
  const allEvents = getActivityEvents(5000);
  const visitEventsInMonth = allEvents.filter(evt => {
    if (evt.type !== 'school_view') return false;
    const evtTime = new Date(evt.timestamp).getTime();
    return evtTime >= startTime && evtTime <= endTime;
  });

  const visitHeaders = [
    'Date & Time (IST)',
    'Date & Time (UTC ISO)',
    'School Name',
    'School Slug',
    'Locality / Sector',
    'User / Account Identifier',
    'User Email (if logged in)',
    'Visit Duration (if recorded)',
    'Event ID',
  ];

  const visitRows: (string | number)[][] = [];

  if (visitEventsInMonth.length > 0) {
    for (const evt of visitEventsInMonth) {
      const school = evt.schoolSlug ? getSchoolBySlug(evt.schoolSlug) : undefined;
      const schoolName = school?.name || evt.schoolSlug || 'Unknown School';
      const sector = evt.locality || school?.location?.sector || school?.location?.area || 'Greater Noida West';
      
      let userDisplay = 'Anonymous Visitor';
      let userEmail = 'N/A';
      if (evt.userId) {
        const user = getUserById(evt.userId);
        if (user) {
          userDisplay = `${user.name} (${user.id})`;
          userEmail = user.email;
        } else {
          userDisplay = `User ID: ${evt.userId}`;
        }
      }

      visitRows.push([
        formatISTDateTime(evt.timestamp),
        new Date(evt.timestamp).toISOString(),
        schoolName,
        evt.schoolSlug || 'N/A',
        sector,
        userDisplay,
        userEmail,
        evt.approximateTimeSpent || 'Not recorded / Pageview',
        evt.id,
      ]);
    }
  } else {
    visitRows.push([
      `No school visits recorded in ${periodLabel}.`,
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
    ]);
  }

  const ws2Data = [visitHeaders, ...visitRows];
  const ws2 = XLSX.utils.aoa_to_sheet(ws2Data);
  ws2['!cols'] = [
    { wch: 24 }, // Date Time IST
    { wch: 26 }, // Date Time UTC ISO
    { wch: 36 }, // School Name
    { wch: 32 }, // Slug
    { wch: 22 }, // Locality
    { wch: 30 }, // User
    { wch: 28 }, // Email
    { wch: 28 }, // Duration
    { wch: 24 }, // Event ID
  ];
  XLSX.utils.book_append_sheet(wb, ws2, 'School Visits');

  // --------------------------------------------------------------------------
  // SHEET 3: WISHLISTS
  // --------------------------------------------------------------------------
  const wishlistEventsInMonth = allEvents.filter(evt => {
    if (evt.type !== 'wishlist_add' && evt.type !== 'wishlist_remove') return false;
    const evtTime = new Date(evt.timestamp).getTime();
    return evtTime >= startTime && evtTime <= endTime;
  });

  const wishlistHeaders = [
    'Date & Time (IST)',
    'Date & Time (UTC ISO)',
    'Action Type',
    'School Name',
    'School Slug',
    'Locality / Sector',
    'User / Account Identifier',
    'User Email (if logged in)',
    'Event ID',
    'Data Model Note',
  ];

  const wishlistRows: (string | number)[][] = [];

  if (wishlistEventsInMonth.length > 0) {
    for (const evt of wishlistEventsInMonth) {
      const school = evt.schoolSlug ? getSchoolBySlug(evt.schoolSlug) : undefined;
      const schoolName = school?.name || evt.schoolSlug || 'Unknown School';
      const sector = evt.locality || school?.location?.sector || school?.location?.area || 'Greater Noida West';
      
      let userDisplay = 'Anonymous / Guest';
      let userEmail = 'N/A';
      if (evt.userId) {
        const user = getUserById(evt.userId);
        if (user) {
          userDisplay = `${user.name} (${user.id})`;
          userEmail = user.email;
        } else {
          userDisplay = `User ID: ${evt.userId}`;
        }
      }

      wishlistRows.push([
        formatISTDateTime(evt.timestamp),
        new Date(evt.timestamp).toISOString(),
        evt.type === 'wishlist_add' ? 'Added to Wishlist' : 'Removed from Wishlist',
        schoolName,
        evt.schoolSlug || 'N/A',
        sector,
        userDisplay,
        userEmail,
        evt.id,
        'Historical event recorded with timestamp',
      ]);
    }
  } else {
    wishlistRows.push([
      `No wishlist add/remove activity recorded in ${periodLabel}.`,
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      'Historical event telemetry is populated in real-time as parents save or remove schools.',
    ]);
  }

  const ws3Data = [wishlistHeaders, ...wishlistRows];
  const ws3 = XLSX.utils.aoa_to_sheet(ws3Data);
  ws3['!cols'] = [
    { wch: 24 }, // Date Time IST
    { wch: 26 }, // Date Time UTC ISO
    { wch: 24 }, // Action
    { wch: 36 }, // School Name
    { wch: 32 }, // Slug
    { wch: 22 }, // Locality
    { wch: 30 }, // User
    { wch: 28 }, // Email
    { wch: 24 }, // Event ID
    { wch: 45 }, // Note
  ];
  XLSX.utils.book_append_sheet(wb, ws3, 'Wishlists');

  // --------------------------------------------------------------------------
  // SHEET 4: REVIEWS
  // --------------------------------------------------------------------------
  const allRatings = getAllRatings(true); // include deleted/moderated for admin report
  const reviewsInMonth = allRatings.filter(r => {
    const createdTime = new Date(r.createdAt).getTime();
    return createdTime >= startTime && createdTime <= endTime;
  });

  const reviewHeaders = [
    'Review Date (IST)',
    'Review Date (UTC ISO)',
    'School Name',
    'School Slug',
    'Rating Score (1-5)',
    'Review Title',
    'Review Content / Feedback',
    'Public Display Name',
    'Verified Parent Status',
    'Moderation Status',
    'Admin Internal User ID',
    'Admin Internal User Email',
    'Deletion / Moderation Reason',
  ];

  const reviewRows: (string | number)[][] = [];

  if (reviewsInMonth.length > 0) {
    for (const r of reviewsInMonth) {
      const school = getSchoolBySlug(r.schoolSlug);
      const schoolName = school?.name || r.schoolSlug;
      const authorUser = getUserById(r.userId);

      reviewRows.push([
        formatISTDateTime(r.createdAt),
        new Date(r.createdAt).toISOString(),
        schoolName,
        r.schoolSlug,
        r.score,
        r.title || 'Untitled Review',
        r.comment,
        r.userName,
        r.verifiedParent ? 'Verified Parent' : 'Unverified',
        r.status === 'published' ? 'Published' : 'Deleted / Moderated',
        r.userId,
        authorUser?.email || 'N/A',
        r.deletionReason || (r.status === 'deleted' ? 'Deleted by admin' : 'N/A'),
      ]);
    }
  } else {
    reviewRows.push([
      `No parent reviews submitted in ${periodLabel}.`,
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
    ]);
  }

  const ws4Data = [reviewHeaders, ...reviewRows];
  const ws4 = XLSX.utils.aoa_to_sheet(ws4Data);
  ws4['!cols'] = [
    { wch: 24 }, // Date IST
    { wch: 26 }, // Date UTC ISO
    { wch: 36 }, // School Name
    { wch: 32 }, // Slug
    { wch: 18 }, // Rating
    { wch: 28 }, // Title
    { wch: 45 }, // Content
    { wch: 24 }, // Display Name
    { wch: 24 }, // Verified Parent
    { wch: 24 }, // Status
    { wch: 28 }, // Admin User ID
    { wch: 28 }, // Admin Email
    { wch: 32 }, // Deletion Reason
  ];
  XLSX.utils.book_append_sheet(wb, ws4, 'Reviews');

  // --------------------------------------------------------------------------
  // SHEET 5: SCHOOL SUMMARY
  // --------------------------------------------------------------------------
  const canonicalSchools = getCanonicalSchools();
  const allTimeOverview = getAllSchoolsAdminOverview();
  const allTimeMap = new Map(allTimeOverview.map(s => [s.slug, s]));

  const summaryHeaders = [
    'School Name',
    'School Slug',
    'Locality / Sector',
    'Board / Curriculum',
    `Monthly Recorded Views (${formattedMonth}/${year} IST)`,
    `Monthly Wishlist Adds (${formattedMonth}/${year} IST)`,
    `Monthly Wishlist Removes (${formattedMonth}/${year} IST)`,
    `Monthly Reviews Submitted (${formattedMonth}/${year} IST)`,
    `Monthly Avg Review Rating (${formattedMonth}/${year} IST)`,
    'All-Time Total Views',
    'All-Time Active Shortlists',
    'All-Time Published Reviews',
    'All-Time Overall Rating',
  ];

  const summaryRows: (string | number)[][] = [];

  for (const school of canonicalSchools) {
    // 1. Monthly Views count
    const monthlyViews = visitEventsInMonth.filter(e => e.schoolSlug === school.slug).length;

    // 2. Monthly Wishlist Adds & Removes
    const monthlyAdds = wishlistEventsInMonth.filter(e => e.schoolSlug === school.slug && e.type === 'wishlist_add').length;
    const monthlyRemoves = wishlistEventsInMonth.filter(e => e.schoolSlug === school.slug && e.type === 'wishlist_remove').length;

    // 3. Monthly Reviews & Average
    const monthlyReviews = reviewsInMonth.filter(r => r.schoolSlug === school.slug && r.status !== 'deleted');
    const monthlyReviewsCount = monthlyReviews.length;
    let monthlyAvgRating: string | number = 'No reviews in month';
    if (monthlyReviewsCount > 0) {
      const sum = monthlyReviews.reduce((acc, curr) => acc + curr.score, 0);
      monthlyAvgRating = Math.round((sum / monthlyReviewsCount) * 10) / 10;
    }

    // 4. All-Time metrics
    const allTime = allTimeMap.get(school.slug);
    const ratingStats = getSchoolRatingStats(school.slug);

    const allTimeViews = allTime?.views || 0;
    const allTimeSaves = allTime?.saves || 0;
    const allTimeReviews = ratingStats.totalReviews || 0;
    const allTimeRating = ratingStats.totalReviews > 0 ? ratingStats.averageScore : (school.rating?.score || 0);

    const boardDisplay = Array.isArray(school.board) ? school.board.join(', ') : 'CBSE';
    const sectorDisplay = school.location.sector || school.location.area || 'Greater Noida West';

    summaryRows.push([
      school.name,
      school.slug,
      sectorDisplay,
      boardDisplay,
      monthlyViews,
      monthlyAdds,
      monthlyRemoves,
      monthlyReviewsCount,
      monthlyAvgRating,
      allTimeViews,
      allTimeSaves,
      allTimeReviews,
      allTimeRating,
    ]);
  }

  // Sort summary rows: first by monthly recorded views desc, then by school name
  summaryRows.sort((a, b) => {
    const viewsA = typeof a[4] === 'number' ? a[4] : 0;
    const viewsB = typeof b[4] === 'number' ? b[4] : 0;
    if (viewsB !== viewsA) return viewsB - viewsA;
    return String(a[0]).localeCompare(String(b[0]));
  });

  const ws5Data = [summaryHeaders, ...summaryRows];
  const ws5 = XLSX.utils.aoa_to_sheet(ws5Data);
  ws5['!cols'] = [
    { wch: 38 }, // School Name
    { wch: 32 }, // Slug
    { wch: 24 }, // Sector
    { wch: 20 }, // Board
    { wch: 25 }, // Monthly Views
    { wch: 25 }, // Monthly Adds
    { wch: 25 }, // Monthly Removes
    { wch: 28 }, // Monthly Reviews
    { wch: 28 }, // Monthly Avg Rating
    { wch: 20 }, // All-Time Views
    { wch: 24 }, // All-Time Saves
    { wch: 24 }, // All-Time Reviews
    { wch: 22 }, // All-Time Rating
  ];
  XLSX.utils.book_append_sheet(wb, ws5, 'School Summary');

  // --------------------------------------------------------------------------
  // WRITE AND RETURN BUFFER
  // --------------------------------------------------------------------------
  const buffer = XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' });
  return Buffer.from(buffer);
}
