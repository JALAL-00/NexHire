# Resend Email Setup Guide

## Why Resend?
Railway (and many cloud platforms) block outbound SMTP connections (ports 25, 465, 587) to prevent spam. This is why Gmail SMTP was timing out. Resend provides a reliable HTTP API for sending emails.

## Setup Steps

### 1. Create Resend Account
1. Go to https://resend.com
2. Sign up for a free account (100 emails/day)
3. Verify your email

### 2. Get API Key
1. Go to https://resend.com/api-keys
2. Click "Create API Key"
3. Give it a name (e.g., "NexHire Production")
4. Copy the API key (starts with `re_`)

### 3. Add to Railway Environment Variables

Go to your Railway backend service → Variables tab and add:

```
RESEND_API_KEY=re_your_api_key_here
FROM_EMAIL=onboarding@resend.dev
```

**Note**: By default, Resend lets you send from `onboarding@resend.dev`. To use your own domain (e.g., `noreply@nexhire.com`), you need to verify your domain in Resend settings.

### 4. Redeploy

Railway will automatically redeploy when you add the environment variable.

## Testing

Once deployed, try:
- **Forgot Password**: Should send OTP email instantly
- **Job Application**: Should send notification to recruiter
- **Account Deletion**: Should work without email timeout errors

## Free Tier Limits

- **100 emails/day**
- **3,000 emails/month**

This is perfect for development and small-scale production. If you need more, upgrade to their paid plan.

## Alternative: Use Your Own Domain

If you want emails to come from `noreply@yourdomain.com`:

1. Go to Resend → Domains
2. Add your domain
3. Add the DNS records they provide
4. Update `FROM_EMAIL` in Railway to `noreply@yourdomain.com`

## Troubleshooting

If emails still don't send:
1. Check Railway logs for the message: `✅ Resend email service configured successfully`
2. If you see `❌ RESEND_API_KEY is missing`, the env var isn't set correctly
3. Check Resend dashboard → Logs to see if the email was sent

---

**That's it!** Resend is much more reliable than SMTP for cloud deployments. 🚀
