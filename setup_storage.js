const { Client } = require('pg');

async function main() {
  const client = new Client({
    connectionString: "postgresql://postgres.lxhslrjfuhkqvhsgqbpf:PCgwlq5T0z0RrkrL@aws-1-ap-northeast-2.pooler.supabase.com:5432/postgres"
  });

  try {
    await client.connect();
    console.log("Connected to database");

    // Check if bucket exists
    const res = await client.query(`SELECT * FROM storage.buckets WHERE id = 'unievents'`);
    if (res.rows.length === 0) {
      console.log("Creating unievents bucket...");
      await client.query(`INSERT INTO storage.buckets (id, name, public) VALUES ('unievents', 'unievents', true)`);
    } else {
      console.log("Bucket already exists. Ensuring it is public...");
      await client.query(`UPDATE storage.buckets SET public = true WHERE id = 'unievents'`);
    }

    // Set up policies
    console.log("Setting up RLS policies...");
    
    // We can drop the existing policies if we want to be safe, or use ON CONFLICT/EXCEPTION
    const policies = [
      `DROP POLICY IF EXISTS "Allow public uploads" ON storage.objects`,
      `CREATE POLICY "Allow public uploads" ON storage.objects FOR INSERT TO public WITH CHECK (bucket_id = 'unievents')`,
      `DROP POLICY IF EXISTS "Allow public read" ON storage.objects`,
      `CREATE POLICY "Allow public read" ON storage.objects FOR SELECT TO public USING (bucket_id = 'unievents')`
    ];

    for (const sql of policies) {
      await client.query(sql);
    }
    console.log("Policies created successfully.");

  } catch (err) {
    console.error("Error:", err);
  } finally {
    await client.end();
  }
}

main();
