# ⚡ Render DisallowedHost Error - Quick Fix

## Error
```
DisallowedHost at /
Invalid HTTP_HOST header: 'superclimatetech.onrender.com'. 
You may need to add 'superclimatetech.onrender.com' to ALLOWED_HOSTS.
```

## Solution (2 Steps)

### Step 1: Update ALLOWED_HOSTS in Render Dashboard

1. Go to https://dashboard.render.com
2. Select your **supertech-backend** service
3. Click **Environment** tab
4. Find or create `ALLOWED_HOSTS` variable
5. Set its value to:
```
superclimatetech.onrender.com,localhost,127.0.0.1
```

**Example:**
```
ALLOWED_HOSTS = superclimatetech.onrender.com,localhost,127.0.0.1
```

### Step 2: Redeploy

1. Click **Deployments**
2. Click **Trigger deploy** (top right)
3. Or wait for auto-redeploy if enabled
4. Monitor the build logs

## Verification

After redeploy, visit:
```
https://superclimatetech.onrender.com/admin/
```

Should work without the DisallowedHost error ✅

## Why This Happened

- Django security checks the `Host` header in HTTP requests
- If the domain isn't in `ALLOWED_HOSTS`, requests are rejected
- Your Render domain wasn't configured

## For Custom Domains

If you add a custom domain (e.g., `yourdomain.com`), also add it:

```
ALLOWED_HOSTS=superclimatetech.onrender.com,yourdomain.com,www.yourdomain.com,localhost,127.0.0.1
```

## Production Best Practice

In production with custom domain:
```
ALLOWED_HOSTS=yourdomain.com,www.yourdomain.com
```

---

**That's it! Your site should now be accessible.** 🚀
