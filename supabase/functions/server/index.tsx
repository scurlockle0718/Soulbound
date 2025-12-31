import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import { createClient } from "npm:@supabase/supabase-js@2";
import * as kv from "./kv_store.tsx";
const app = new Hono();

// Initialize Supabase client
const supabase = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
);

// Enable logger
app.use('*', logger(console.log));

// Enable CORS for all routes and methods
app.use(
  "/*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
  }),
);

// Health check endpoint
app.get("/make-server-ee7657b6/health", (c) => {
  return c.json({ status: "ok" });
});

// Sign up endpoint
app.post("/make-server-ee7657b6/auth/signup", async (c) => {
  try {
    const body = await c.req.json();
    const { email, password, username } = body;
    
    if (!email || !password) {
      return c.json({ error: 'Email and password are required' }, 400);
    }

    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      user_metadata: { username: username || email.split('@')[0] },
      // Automatically confirm the user's email since an email server hasn't been configured.
      email_confirm: true
    });

    if (error) {
      console.log(`Error creating user during signup: ${error.message}`);
      return c.json({ error: error.message }, 400);
    }

    console.log(`✅ User created successfully: ${email}`);
    return c.json({ 
      user: {
        id: data.user.id,
        email: data.user.email,
        username: data.user.user_metadata.username
      }
    });
  } catch (error) {
    console.log(`Error in signup endpoint: ${error}`);
    return c.json({ error: String(error) }, 500);
  }
});

// Get global admin config (narratives, quest templates, etc.)
app.get("/make-server-ee7657b6/global/config", async (c) => {
  try {
    // Fetch global configuration data from KV store
    const [narratives, questTemplates, inventoryTemplates] = await kv.mget([
      'global:narratives',
      'global:quest_templates',
      'global:inventory_templates'
    ]);

    return c.json({
      narratives: narratives || null,
      questTemplates: questTemplates || null,
      inventoryTemplates: inventoryTemplates || null
    });
  } catch (error) {
    console.log(`Error fetching global config from KV store: ${error}`);
    return c.json({ error: String(error) }, 500);
  }
});

// Save global narratives (admin only)
app.post("/make-server-ee7657b6/global/narratives", async (c) => {
  try {
    const body = await c.req.json();
    const { prologue, epilogue } = body;
    
    await kv.set('global:narratives', {
      prologue,
      epilogue
    });
    
    return c.json({ success: true });
  } catch (error) {
    console.log(`Error saving global narratives to KV store: ${error}`);
    return c.json({ error: String(error) }, 500);
  }
});

// Save global quest templates (admin only)
app.post("/make-server-ee7657b6/global/quests", async (c) => {
  try {
    const body = await c.req.json();
    const { quests } = body;
    
    await kv.set('global:quest_templates', quests);
    
    console.log(`✅ Saved ${quests.length} global quest templates`);
    return c.json({ success: true });
  } catch (error) {
    console.log(`Error saving global quest templates to KV store: ${error}`);
    return c.json({ error: String(error) }, 500);
  }
});

// Save global inventory templates (admin only)
app.post("/make-server-ee7657b6/global/inventory", async (c) => {
  try {
    const body = await c.req.json();
    const { inventory } = body;
    
    await kv.set('global:inventory_templates', inventory);
    
    console.log(`✅ Saved ${inventory.length} global inventory templates`);
    return c.json({ success: true });
  } catch (error) {
    console.log(`Error saving global inventory templates to KV store: ${error}`);
    return c.json({ error: String(error) }, 500);
  }
});

// Get all user data
app.get("/make-server-ee7657b6/user/data", async (c) => {
  try {
    const userId = c.req.query('userId');
    
    if (!userId) {
      console.log('Error fetching user data: userId parameter is required');
      return c.json({ error: 'userId is required' }, 400);
    }

    // Fetch all user data from KV store
    const [quests, inventory, currencies, messages, flags] = await kv.mget([
      `user:${userId}:quests`,
      `user:${userId}:inventory`,
      `user:${userId}:currencies`,
      `user:${userId}:messages`,
      `user:${userId}:flags`
    ]);

    return c.json({
      quests: quests || null,
      inventory: inventory || null,
      currencies: currencies || null,
      messages: messages || null,
      flags: flags || null
    });
  } catch (error) {
    console.log(`Error fetching user data from KV store: ${error}`);
    return c.json({ error: String(error) }, 500);
  }
});

// Save all user progress (comprehensive save)
app.post("/make-server-ee7657b6/user/save", async (c) => {
  try {
    const body = await c.req.json();
    const { userId, quests, inventory, currencies, messages, flags } = body;
    
    if (!userId) {
      console.log('Error saving user data: userId is required');
      return c.json({ error: 'userId is required' }, 400);
    }
    
    // Save all data atomically
    const savePromises = [];
    
    if (quests !== undefined) {
      savePromises.push(kv.set(`user:${userId}:quests`, quests));
    }
    if (inventory !== undefined) {
      savePromises.push(kv.set(`user:${userId}:inventory`, inventory));
    }
    if (currencies !== undefined) {
      savePromises.push(kv.set(`user:${userId}:currencies`, currencies));
    }
    if (messages !== undefined) {
      savePromises.push(kv.set(`user:${userId}:messages`, messages));
    }
    if (flags !== undefined) {
      savePromises.push(kv.set(`user:${userId}:flags`, flags));
    }
    
    await Promise.all(savePromises);
    
    console.log(`✅ Saved progress for user: ${userId}`);
    return c.json({ success: true });
  } catch (error) {
    console.log(`Error saving user data to KV store: ${error}`);
    return c.json({ error: String(error) }, 500);
  }
});

// Reset user data to defaults
app.post("/make-server-ee7657b6/user/reset", async (c) => {
  try {
    const body = await c.req.json();
    const { userId } = body;
    
    if (!userId) {
      console.log('Error resetting user data: userId is required');
      return c.json({ error: 'userId is required' }, 400);
    }
    
    // Delete all user data
    await kv.mdel([
      `user:${userId}:quests`,
      `user:${userId}:inventory`,
      `user:${userId}:currencies`,
      `user:${userId}:messages`,
      `user:${userId}:flags`
    ]);
    
    console.log(`✅ Reset all data for user: ${userId}`);
    return c.json({ success: true });
  } catch (error) {
    console.log(`Error resetting user data in KV store: ${error}`);
    return c.json({ error: String(error) }, 500);
  }
});

Deno.serve(app.fetch);