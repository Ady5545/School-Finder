import { NextRequest, NextResponse } from 'next/server';
import { requireAdminAuth } from '@/lib/adminAuth';
import { getAllActiveRemindersAsync, markReminderNotifiedAsync, getUserByIdAsync } from '@/lib/authStore';
import { sendAdmissionDeadlineAlertEmail } from '@/lib/emailService';

export async function POST(req: NextRequest) {
  try {
    const adminCheck = requireAdminAuth(req);
    if (!adminCheck.authorized) {
      return NextResponse.json({ success: false, message: 'Admin authorization required.' }, { status: 403 });
    }

    const activeReminders = await getAllActiveRemindersAsync();
    const now = new Date();
    const todayStr = now.toISOString().split('T')[0];

    const dispatched: string[] = [];

    for (const reminder of activeReminders) {
      if (reminder.lastNotifiedAt) {
        // Already notified
        continue;
      }

      const target = new Date(reminder.targetDate);
      if (isNaN(target.getTime())) continue;

      let offsetDays = 0;
      if (reminder.timing === '7_days_before') offsetDays = 7;
      else if (reminder.timing === '3_days_before') offsetDays = 3;
      else if (reminder.timing === '1_day_before') offsetDays = 1;

      const triggerDate = new Date(target);
      triggerDate.setDate(triggerDate.getDate() - offsetDays);
      const triggerStr = triggerDate.toISOString().split('T')[0];

      if (todayStr >= triggerStr) {
        // Due for notification!
        const user = await getUserByIdAsync(reminder.userId);
        const parentName = user?.name || 'Parent';

        const daysRemaining = Math.max(0, Math.ceil((target.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)));

        const emailResult = await sendAdmissionDeadlineAlertEmail({
          to: reminder.userEmail,
          parentName,
          alerts: [
            {
              schoolName: reminder.schoolName,
              slug: reminder.schoolSlug,
              deadlineDate: `${reminder.milestoneLabel}: ${reminder.targetDate}`,
              daysRemaining,
              process: `Admission Reminder for ${reminder.milestoneLabel}`,
            },
          ],
        });

        if (emailResult.success) {
          await markReminderNotifiedAsync(reminder.id);
          dispatched.push(reminder.id);
        }
      }
    }

    return NextResponse.json({
      success: true,
      totalActive: activeReminders.length,
      dispatchedCount: dispatched.length,
      dispatchedIds: dispatched,
    });
  } catch (error) {
    console.error('Error dispatching reminder notifications:', error);
    return NextResponse.json({ success: false, message: 'Failed to process reminders' }, { status: 500 });
  }
}
