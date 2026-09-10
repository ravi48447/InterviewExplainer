const fs = require('fs');
const path = require('path');
const { Client } = require('pg');

const CONTENT_DIR = path.join(__dirname, 'content', 'domains');

const client = new Client({
    user: 'interviewexplainer',
    host: 'localhost',
    database: 'interviewexplainer',
    password: 'changeme',
    port: 5432,
});

function toReadableName(slug) {
    return slug
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
}

async function run() {
    try {
        await client.connect();
        console.log('Connected to database.');

        // STEP 0: Ensure schema is updated
        const schemaFile = fs.readFileSync(path.join(__dirname, 'migrations', '021_taxonomy_schema.sql'), 'utf-8');
        await client.query(schemaFile);
        console.log('STEP 0: Taxonomy schema updated.');

        const files = fs.readdirSync(CONTENT_DIR).filter(f => f.endsWith('.json'));

        let languages = new Set();
        let tracks = new Set();
        let experienceLevels = new Map();
        let categories = new Set();
        let stacks = new Set();
        let domains = []; // [{ language, track, experience, name, slug, navigation, categories: [{name, stacks: []}] }]

        // Load and parse all JSON files
        for (const file of files) {
            const rawData = fs.readFileSync(path.join(CONTENT_DIR, file), 'utf8');
            const data = JSON.parse(rawData);
            
            for (const domain of data.domains) {
                languages.add(domain.language);
                tracks.add(domain.track);
                
                // Map experience ranges
                let min_y = 0, max_y = null;
                if (domain.experience === '0-1') { min_y = 0; max_y = 1; }
                else if (domain.experience === '1-3') { min_y = 1; max_y = 3; }
                else if (domain.experience === '3-5') { min_y = 3; max_y = 5; }
                else if (domain.experience === '5+') { min_y = 5; max_y = null; }
                
                experienceLevels.set(domain.experience, { min: min_y, max: max_y });

                const readableName = toReadableName(domain.slug);
                domains.push({
                    slug: domain.slug,
                    name: readableName,
                    language: domain.language,
                    track: domain.track,
                    experience: domain.experience,
                    navigation: domain.navigation,
                    categories: domain.categories
                });

                for (const cat of domain.categories) {
                    categories.add(cat.name);
                    for (const stack of cat.stacks) {
                        stacks.add(stack);
                    }
                }
            }
        }

        // STEP 1: Insert Languages
        for (const lang of languages) {
            await client.query(
                `INSERT INTO languages (name, slug) VALUES ($1, $2) ON CONFLICT (slug) DO NOTHING`,
                [toReadableName(lang), lang]
            );
        }
        console.log(`STEP 1: Inserted ${languages.size} languages.`);

        // STEP 2: Insert Tracks
        for (const track of tracks) {
            await client.query(
                `INSERT INTO tracks (name, slug) VALUES ($1, $2) ON CONFLICT (slug) DO NOTHING`,
                [toReadableName(track), track]
            );
        }
        console.log(`STEP 2: Inserted ${tracks.size} tracks.`);

        // STEP 3: Insert Experience Levels
        for (const [label, exp] of experienceLevels.entries()) {
            await client.query(
                `INSERT INTO experience_levels (label, min_years, max_years) 
                 VALUES ($1, $2, $3)
                 ON CONFLICT (label) DO NOTHING`,
                [label, exp.min, exp.max]
            );
        }
        console.log(`STEP 3: Inserted ${experienceLevels.size} experience levels.`);

        // STEP 4: Insert Stack Categories
        for (const cat of categories) {
            await client.query(
                `INSERT INTO stack_categories (name, slug) VALUES ($1, $2) ON CONFLICT (slug) DO NOTHING`,
                [toReadableName(cat), cat]
            );
        }
        console.log(`STEP 4: Inserted ${categories.size} categories.`);

        // STEP 5: Insert Tech Stacks
        for (const stack of stacks) {
            await client.query(
                `INSERT INTO tech_stacks (name, slug) VALUES ($1, $2) ON CONFLICT (slug) DO NOTHING`,
                [toReadableName(stack), stack]
            );
        }
        console.log(`STEP 5: Inserted ${stacks.size} tech stacks.`);

        // Fetch maps for resolving IDs
        const langMap = new Map((await client.query("SELECT id, slug FROM languages")).rows.map(r => [r.slug, r.id]));
        const trackMap = new Map((await client.query("SELECT id, slug FROM tracks")).rows.map(r => [r.slug, r.id]));
        const expMap = new Map((await client.query("SELECT id, label FROM experience_levels")).rows.map(r => [r.label, r.id]));
        const catMap = new Map((await client.query("SELECT id, slug FROM stack_categories")).rows.map(r => [r.slug, r.id]));
        const stackMap = new Map((await client.query("SELECT id, slug FROM tech_stacks")).rows.map(r => [r.slug, r.id]));

        // STEP 6: Insert Domains
        for (const d of domains) {
            const langId = langMap.get(d.language);
            const trackId = trackMap.get(d.track);
            const expId = expMap.get(d.experience);

            const res = await client.query(
                `INSERT INTO domains (name, slug, language_id, track_id, experience_id) 
                 VALUES ($1, $2, $3, $4, $5) 
                 ON CONFLICT (slug) DO UPDATE SET 
                    language_id = EXCLUDED.language_id,
                    track_id = EXCLUDED.track_id,
                    experience_id = EXCLUDED.experience_id
                 RETURNING id`,
                [d.name, d.slug, langId, trackId, expId]
            );
            d.id = res.rows[0]?.id;
            if(!d.id) {
                 const existing = await client.query('SELECT id FROM domains WHERE slug = $1', [d.slug]);
                 d.id = existing.rows[0].id;
            }
        }
        console.log(`STEP 6: Upserted ${domains.length} domains.`);

        console.log("Emptying map tables for fresh insert...");
        await client.query("DELETE FROM domain_stack_map");
        await client.query("DELETE FROM domain_category_map");
        await client.query("DELETE FROM domain_navigation");

        // STEP 7 & 8 & 9: Insert Maps and Navigation
        let domCatMapCount = 0;
        let domStackMapCount = 0;

        for (const d of domains) {
            let catOrder = 1;
            for (const cat of d.categories) {
                const catId = catMap.get(cat.name); // Using name as slug in our set for categories

                // Insert into domain_category_map
                await client.query(
                    `INSERT INTO domain_category_map (domain_id, category_id, display_order) 
                     VALUES ($1, $2, $3)
                     ON CONFLICT (domain_id, category_id) DO NOTHING`,
                    [d.id, catId, catOrder++]
                );
                domCatMapCount++;

                let stackOrder = 1;
                for (const stackSlug of cat.stacks) {
                    const stackId = stackMap.get(stackSlug);

                    // Insert into domain_stack_map (Notice the new schema structure domain->category->stack)
                    await client.query(
                        `INSERT INTO domain_stack_map (domain_id, category_id, stack_id, display_order) 
                         VALUES ($1, $2, $3, $4)
                         ON CONFLICT (domain_id, category_id, stack_id) DO NOTHING`,
                        [d.id, catId, stackId, stackOrder++]
                    );
                    domStackMapCount++;
                }
            }

            // STEP 9: Insert domain navigation
            if (d.navigation) {
                const defaultCatId = catMap.get(d.navigation.defaultStartCategory);
                const defaultStackId = stackMap.get(d.navigation.defaultStartStack);

                if (defaultCatId && defaultStackId) {
                    await client.query(
                        `INSERT INTO domain_navigation (domain_id, default_category_id, default_stack_id) 
                         VALUES ($1, $2, $3)
                         ON CONFLICT(domain_id) DO UPDATE SET 
                            default_category_id = EXCLUDED.default_category_id,
                            default_stack_id = EXCLUDED.default_stack_id`,
                        [d.id, defaultCatId, defaultStackId]
                    );
                }
            }
        }
        
        console.log(`STEP 7 & 8: Inserted ${domCatMapCount} category maps and ${domStackMapCount} stack maps.`);
        console.log(`STEP 9: Upserted domain navigation.`);

        // STEP 10: Validation
        console.log('\n--- STEP 10: VALIDATION COUNTS ---');
        const tables = [
            'languages', 'tracks', 'experience_levels', 'stack_categories', 'tech_stacks', 
            'domains', 'domain_category_map', 'domain_stack_map', 'domain_navigation'
        ];
        
        for (const table of tables) {
            const count = await client.query(`SELECT count(*) FROM ${table}`);
            console.log(`=> ${table.padEnd(25)} : ${count.rows[0].count}`);
        }

    } catch (err) {
        console.error('Error executing seed:', err);
    } finally {
        await client.end();
    }
}

run();
