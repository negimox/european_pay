const { Client } = require('pg');

async function main() {
  const client = new Client({
    connectionString: "postgresql://postgres.lxhslrjfuhkqvhsgqbpf:PCgwlq5T0z0RrkrL@aws-1-ap-northeast-2.pooler.supabase.com:5432/postgres"
  });
  await client.connect();

  await client.query(`
    DROP POLICY IF EXISTS "Allow public uploads" ON storage.objects;
    DROP POLICY IF EXISTS "Allow public read" ON storage.objects;
    DROP POLICY IF EXISTS "Allow public all" ON storage.objects;

    CREATE POLICY "Allow public all" 
    ON storage.objects 
    FOR ALL 
    TO public 
    USING (bucket_id = 'unievents') 
    WITH CHECK (bucket_id = 'unievents');
  `);
  
  console.log("Policies updated.");
  await client.end();
}

main();
