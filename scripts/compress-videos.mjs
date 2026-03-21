import { createClient } from '@supabase/supabase-js';
import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

const supabaseUrl = 'https://rwpckvkfvdgtmfitavao.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ3cGNrdmtmdmRndG1maXRhdmFvIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MTY2ODE1OCwiZXhwIjoyMDg3MjQ0MTU4fQ.mqGSa7hYjwlvw1a4be-ZoDmTH98L4P9VlUGH1fgZja8';
const supabase = createClient(supabaseUrl, supabaseKey);

async function run() {
  console.log('Fetching videos to compress...');
  
  // Get all .mov files from product_images
  const { data: images, error } = await supabase
    .from('product_images')
    .select('id, product_id, url')
    .ilike('url', '%.mov%');

  if (error) {
    console.error('Error fetching images:', error);
    return;
  }

  console.log(`Found ${images.length} videos to compress.`);

  for (const img of images) {
    const url = img.url;
    console.log(`\nProcessing: ${url}`);
    
    const filename = url.split('/').pop();
    const basename = filename.replace('.mov', '');
    const localInput = path.join(process.cwd(), filename);
    const localOutput = path.join(process.cwd(), `${basename}-compressed.mp4`);
    const newStoragePath = `${basename}-compressed.mp4`;
    
    try {
      // 1. Download
      console.log('Downloading...');
      execSync(`curl -s -o "${localInput}" "${url}"`);
      
      // 2. Compress (H.264, faststart for web, crf 28 for good compression, limit resolution to 720p width max)
      console.log('Compressing...');
      execSync(`ffmpeg -y -i "${localInput}" -vcodec libx264 -crf 28 -preset fast -vf "scale='min(720,iw)':-2" -movflags +faststart -acodec aac -b:a 128k "${localOutput}"`, { stdio: 'pipe' });
      
      // 3. Read compressed file
      const fileBuffer = fs.readFileSync(localOutput);
      
      // 4. Upload to Supabase Storage
      console.log(`Uploading to Supabase: ${newStoragePath}`);
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('products')
        .upload(newStoragePath, fileBuffer, {
          contentType: 'video/mp4',
          upsert: true
        });
        
      if (uploadError) {
        console.error('Upload failed:', uploadError);
        continue;
      }
      
      const newUrl = `${supabaseUrl}/storage/v1/object/public/products/${newStoragePath}`;
      console.log(`New URL: ${newUrl}`);
      
      // 5. Update DB
      console.log('Updating database...');
      const { error: dbError } = await supabase
        .from('product_images')
        .update({ url: newUrl })
        .eq('id', img.id);
        
      if (dbError) {
        console.error('DB update failed:', dbError);
        continue;
      }
      
      // 6. Cleanup local files
      fs.unlinkSync(localInput);
      fs.unlinkSync(localOutput);
      console.log('Success!');
      
    } catch (err) {
      console.error('Error processing file:', err);
    }
  }
  
  console.log('\nAll done!');
}

run();