const { Client } = require('pg');

async function main() {
  const client = new Client({
    connectionString: "postgresql://postgres.lxhslrjfuhkqvhsgqbpf:PCgwlq5T0z0RrkrL@aws-1-ap-northeast-2.pooler.supabase.com:5432/postgres"
  });
  await client.connect();

  const res = await client.query(`
    SELECT pol.polname, pol.polpermissive, pol.polcmd, pol.polqual, pol.polwithcheck, r.rolname
    FROM pg_policy pol
    JOIN pg_class tbl ON pol.polrelid = tbl.oid
    JOIN pg_namespace ns ON tbl.relnamespace = ns.oid
    LEFT JOIN pg_roles r ON r.oid = ANY(pol.polroles)
    WHERE ns.nspname = 'storage' AND tbl.relname = 'objects';
  `);
  
  console.log(JSON.stringify(res.rows, null, 2));
  await client.end();
}

main();
