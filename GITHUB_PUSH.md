# Push to GitHub - Step by Step Guide

## 🚀 Quick Commands for Prashan608

### Step 1: Create GitHub Repository First

1. Go to: https://github.com/new
2. Repository name: `tenant-landlord-platform`
3. Description: `Tenant-Landlord Communication Platform with React & Tailwind`
4. Choose: **Public** or **Private**
5. ⚠️ **IMPORTANT**: Do NOT check "Add a README file"
6. Click **"Create repository"**

### Step 2: Run These Commands

Open terminal in your project folder and run:

```bash
# Add remote repository
git remote add origin https://github.com/Prashan608/tenant-landlord-platform.git

# Rename branch to main (if needed)
git branch -M main

# Push to GitHub
git push -u origin main
```

That's it! Your project will be pushed to GitHub! 🎉

---

## 📋 Alternative: If You Get Errors

### If "remote origin already exists":
```bash
git remote remove origin
git remote add origin https://github.com/Prashan608/tenant-landlord-platform.git
git push -u origin main
```

### If you need to commit new changes first:
```bash
git add .
git commit -m "Complete tenant-landlord platform"
git push -u origin main
```

### If you need to force push:
```bash
git push -u origin main --force
```

---

## 🔐 If Asked for Credentials

GitHub now requires **Personal Access Token** instead of password.

### Create Token:
1. Go to: https://github.com/settings/tokens
2. Click "Generate new token" → "Generate new token (classic)"
3. Name: `Tenant-Landlord-Platform`
4. Select scopes: ✅ `repo` (all)
5. Click "Generate token"
6. **Copy the token immediately** (you won't see it again!)

### Use Token as Password:
- Username: `Prashan608`
- Password: `<paste your token here>`

---

## ✅ Verify Upload

After pushing, visit:
https://github.com/Prashan608/tenant-landlord-platform

You should see all your files there!

---

## 📝 Add More Changes Later

Whenever you make changes:

```bash
git add .
git commit -m "Your commit message"
git push
```

---

## 🎯 Your Repository URL

- **HTTPS**: https://github.com/Prashan608/tenant-landlord-platform.git
- **Web**: https://github.com/Prashan608/tenant-landlord-platform

---

**Ready to push!** 🚀
