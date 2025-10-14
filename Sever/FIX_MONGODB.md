# Fix MongoDB Connection

## Issue
The MongoDB URI in your `.env` file has an incorrect cluster address.

## Solution

Update the `MONGODB_URI` in your `.env` file with the correct format:

### **Step 1: Get Your Correct MongoDB URI**

1. Go to MongoDB Atlas: https://cloud.mongodb.com/
2. Click "Connect" on your cluster
3. Choose "Connect your application"
4. Copy the connection string

### **Step 2: Update .env File**

The URI should look like this:

```env
MONGODB_URI=mongodb+srv://2910viwan_db_user:XXobp52pvtyDO9Ds@cluster0.XXXXX.mongodb.net/rtl-social-manager?retryWrites=true&w=majority
```

**Important:** Replace `XXXXX` with your actual cluster identifier from MongoDB Atlas.

### **Step 3: Common Formats**

Your URI might look like one of these:

```
mongodb+srv://2910viwan_db_user:XXobp52pvtyDO9Ds@cluster0.abcde.mongodb.net/rtl-social-manager?retryWrites=true&w=majority
```

or

```
mongodb+srv://2910viwan_db_user:XXobp52pvtyDO9Ds@cluster0.mongodb.net/rtl-social-manager?retryWrites=true&w=majority&appName=Cluster0
```

### **Step 4: Verify**

After updating, run:
```bash
node check-env.js
npm start
```

---

## Alternative: Use a Different Database Name

If you want to use a different database name instead of `rtl-social-manager`, change it in the URI:

```
mongodb+srv://2910viwan_db_user:XXobp52pvtyDO9Ds@cluster0.XXXXX.mongodb.net/YOUR_DB_NAME?retryWrites=true&w=majority
```

---

## Troubleshooting

### Error: "querySrv ENOTFOUND"
- Your cluster identifier is incorrect
- Get the correct URI from MongoDB Atlas dashboard

### Error: "Authentication failed"
- Check username: `2910viwan_db_user`
- Check password: `XXobp52pvtyDO9Ds`
- Ensure user has read/write permissions

### Error: "IP not whitelisted"
- Go to MongoDB Atlas → Network Access
- Add your IP address or use `0.0.0.0/0` for development (allows all IPs)

---

## Quick Fix

If you're unsure of the exact URI, you can:

1. Login to MongoDB Atlas
2. Click "Database" in the left sidebar
3. Click "Connect" on your cluster
4. Select "Drivers"
5. Copy the connection string
6. Replace `<password>` with `XXobp52pvtyDO9Ds`
7. Replace `<dbname>` with `rtl-social-manager`
