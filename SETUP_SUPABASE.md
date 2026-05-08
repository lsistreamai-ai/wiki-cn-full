# 🚀 Supabase Setup Guide for Wiki-CN

**China-Friendly Wiki Database Setup**

---

## Step 1: Create Supabase Account

1. Go to: https://supabase.com
2. Click **"Start your project"**
3. Sign up with GitHub or email
4. Verify your email

---

## Step 2: Create New Project

1. Click **"New Project"**
2. Name: `wiki-cn`
3. Database Password: **Save this!**
4. Region: **Southeast Asia (Singapore)** for best China connectivity
5. Click **"Create new project"**
6. Wait ~2 minutes for setup

---

## Step 3: Create Database Tables

1. Go to **SQL Editor** (left sidebar)
2. Click **"New Query"**
3. Paste this SQL:

```sql
-- Create subjects table
CREATE TABLE subjects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code VARCHAR(10) UNIQUE NOT NULL,
  name_en TEXT NOT NULL,
  name_zh TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create papers table
CREATE TABLE papers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  subject_id UUID REFERENCES subjects(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  year INTEGER,
  paper_type TEXT,
  description TEXT,
  file_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create sections table
CREATE TABLE sections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  paper_id UUID REFERENCES papers(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content TEXT,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default subjects
INSERT INTO subjects (code, name_en, name_zh) VALUES
  ('CHIN', 'Chinese Language', '中國語文'),
  ('ENG', 'English Language', '英國語文'),
  ('MATH', 'Mathematics', '數學'),
  ('CSD', 'Citizenship and Social Development', '公民與社會發展'),
  ('PHY', 'Physics', '物理'),
  ('CHEM', 'Chemistry', '化學'),
  ('BIO', 'Biology', '生物'),
  ('ICT', 'Information and Communication Technology', '資訊及通訊科技'),
  ('ECON', 'Economics', '經濟'),
  ('GEOG', 'Geography', '地理'),
  ('HIST', 'History', '歷史'),
  ('BAF', 'Business, Accounting and Financial Studies', '企業、會計與財務概論');

-- Enable Row Level Security
ALTER TABLE subjects ENABLE ROW LEVEL SECURITY;
ALTER TABLE papers ENABLE ROW LEVEL SECURITY;
ALTER TABLE sections ENABLE ROW LEVEL SECURITY;

-- Allow public read access
CREATE POLICY "Public read subjects" ON subjects FOR SELECT USING (true);
CREATE POLICY "Public read papers" ON papers FOR SELECT USING (true);
CREATE POLICY "Public read sections" ON sections FOR SELECT USING (true);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply trigger to tables
CREATE TRIGGER subjects_updated_at
  BEFORE UPDATE ON subjects
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER papers_updated_at
  BEFORE UPDATE ON papers
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER sections_updated_at
  BEFORE UPDATE ON sections
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
```

4. Click **"Run"**
5. You should see "Success. No rows returned"

---

## Step 4: Get API Keys

1. Go to **Settings** ⚙️ → **API**
2. Copy these values:

**Project URL:**
```
https://xxxxxxxxxxxxx.supabase.co
```

**anon public key:**
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**service_role key:** ⚠️ Keep secret!
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

---

## Step 5: Create Environment File

Create `.env.local` in the project root:

```bash
# Copy from Supabase Dashboard → Settings → API
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Admin password for uploads
ADMIN_PASSWORD=aplus2026
```

---

## Step 6: Configure Cloudflare Environment Variables

If deploying to Cloudflare Pages:

1. Go to your project in Cloudflare
2. **Settings** → **Environment Variables**
3. Add:

```
NEXT_PUBLIC_SUPABASE_URL = https://xxxxxxxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY = eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY = eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
ADMIN_PASSWORD = aplus2026
```

---

## Step 7: Test Your Setup

1. Start local dev server:
   ```bash
   npm run dev
   ```

2. Visit: http://localhost:3000

3. You should see subjects loaded from Supabase!

---

## ✅ Verification Checklist

- [ ] Supabase project created
- [ ] Tables created with SQL
- [ ] 12 subjects inserted
- [ ] API keys copied
- [ ] `.env.local` created
- [ ] Local dev server works
- [ ] Subjects show from database

---

## 📍 China Accessibility Notes

**Why Supabase works in China:**

| Factor | Status |
|--------|--------|
| Supabase CDN | ✅ Has Asia nodes |
| API Endpoints | ✅ Accessible |
| Region | ✅ Singapore (closest) |
| Cloudflare Frontend | ✅ Works |

**Best Practice:**
- Frontend on Cloudflare Pages → Works in China
- API routes via Next.js API → Proxied through Cloudflare
- Supabase for data → Accessible from anywhere

---

## 🔧 Troubleshooting

**"Failed to load wiki data"**
- Check your `.env.local` file
- Verify API keys are correct
- Restart dev server

**"Unauthorized" when uploading**
- Check ADMIN_PASSWORD in `.env.local`
- Make sure admin page sends correct auth header

**Tables not showing data**
- Run the SQL again
- Check Row Level Security policies

---

Need help? Check Supabase logs:
Dashboard → Logs → API logs
