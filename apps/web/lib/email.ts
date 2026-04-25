interface InviteEmailParams {
  candidateEmail: string;
  candidateName: string;
  interviewTitle: string;
  interviewerName: string;
  scheduledAt: string | null;
  roomUrl: string;
}

export async function sendInterviewInvite({
  candidateEmail,
  candidateName,
  interviewTitle,
  interviewerName,
  scheduledAt,
  roomUrl,
}: InviteEmailParams) {
  if (!process.env.RESEND_API_KEY) {
    console.warn('[Email] RESEND_API_KEY not set — skipping email');
    return null;
  }

  const scheduleLine = scheduledAt
    ? `<p style="margin:0 0 8px"><strong>Scheduled:</strong> ${new Date(scheduledAt).toLocaleString('en-US', { dateStyle: 'full', timeStyle: 'short' })}</p>`
    : '';

  try {
    // Dynamic import so the app doesn't crash if resend isn't installed
    const { Resend } = await import('resend');
    const resend = new Resend(process.env.RESEND_API_KEY);

    const { data, error } = await resend.emails.send({
      from: 'HireCodec <noreply@resend.dev>',
      to: candidateEmail,
      subject: `Interview Invitation: ${interviewTitle}`,
      html: `
        <div style="font-family:'Segoe UI',Arial,sans-serif;max-width:560px;margin:0 auto;background:#0a0e1a;border-radius:16px;overflow:hidden;border:1px solid #1e2235">
          <div style="background:linear-gradient(135deg,#6366f1,#8b5cf6,#22d3ee);padding:32px 24px;text-align:center">
            <h1 style="margin:0;color:#fff;font-size:22px;font-weight:700;letter-spacing:-0.5px">⚡ HireCodec Interview</h1>
          </div>
          <div style="padding:32px 24px;color:#c4c9d4">
            <p style="margin:0 0 16px;font-size:16px;color:#e2e5eb">Hi <strong style="color:#fff">${candidateName}</strong>,</p>
            <p style="margin:0 0 20px;line-height:1.6">You've been invited to a technical interview for <strong style="color:#a5b4fc">${interviewTitle}</strong> by <strong style="color:#fff">${interviewerName}</strong>.</p>
            ${scheduleLine}
            <p style="margin:0 0 24px;line-height:1.6;font-size:14px;color:#8b92a5">Click the button below to join when the interview begins.</p>
            <div style="text-align:center;margin:28px 0">
              <a href="${roomUrl}" style="display:inline-block;background:linear-gradient(135deg,#6366f1,#8b5cf6);color:#fff;text-decoration:none;padding:14px 36px;border-radius:12px;font-weight:600;font-size:15px;letter-spacing:0.3px">Join Interview →</a>
            </div>
          </div>
        </div>
      `,
    });

    if (error) {
      console.error('[Email] Failed to send:', error);
      return null;
    }

    console.log(`[Email] Invite sent to ${candidateEmail} (id: ${data?.id})`);
    return data;
  } catch (err) {
    console.error('[Email] Error (resend may not be installed):', err);
    return null;
  }
}
