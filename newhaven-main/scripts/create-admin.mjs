/**
 * One-time script: create an admin user in Supabase Auth and set profile role to 'admin'.
 * Run: node --env-file=.env.local scripts/create-admin.mjs
 * Requires in .env.local: NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY,
 *   CREATE_ADMIN_EMAIL, CREATE_ADMIN_PASSWORD
 */

const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.replace(/\/$/, '');
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const email = process.env.CREATE_ADMIN_EMAIL;
const password = process.env.CREATE_ADMIN_PASSWORD;

if (!url || !serviceRoleKey) {
  console.error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local');
  process.exit(1);
}
if (!email || !password) {
  console.error('Missing CREATE_ADMIN_EMAIL or CREATE_ADMIN_PASSWORD. Add them to .env.local for this run.');
  process.exit(1);
}

const authUrl = `${url}/auth/v1/admin/users`;
const restUrl = `${url}/rest/v1/profiles`;
const headersAuth = {
  'Content-Type': 'application/json',
  apikey: serviceRoleKey,
  Authorization: `Bearer ${serviceRoleKey}`,
};
const headersRest = {
  'Content-Type': 'application/json',
  apikey: serviceRoleKey,
  Authorization: `Bearer ${serviceRoleKey}`,
  Prefer: 'return=minimal',
};

async function main() {
  console.log('Creating admin user:', email);

  const createRes = await fetch(authUrl, {
    method: 'POST',
    headers: headersAuth,
    body: JSON.stringify({
      email,
      password,
      email_confirm: true,
    }),
  });

  const createData = await createRes.json().catch(() => ({}));

  if (!createRes.ok) {
    if (createData.msg?.includes('already been registered') || createData.message?.includes('already been registered')) {
      console.log('User already exists. Updating profile to admin...');
    } else {
      console.error('Create user error:', createData.msg || createData.message || createRes.statusText);
      process.exit(1);
    }
  } else {
    console.log('User created. Setting role to admin...');
  }

  const updateRes = await fetch(`${restUrl}?email=eq.${encodeURIComponent(email)}`, {
    method: 'PATCH',
    headers: headersRest,
    body: JSON.stringify({ role: 'admin' }),
  });

  if (!updateRes.ok) {
    const errText = await updateRes.text();
    console.error('Update profile error:', errText || updateRes.statusText);
    if (updateRes.status === 404 || errText.includes('0 rows')) {
      console.error('Profile may not exist yet. Wait a few seconds and run the script again.');
    }
    process.exit(1);
  }

  console.log('Done. Admin created: ' + email);
  console.log('Sign in at /admin/login');
}

main();
