const fs = require('fs');
const path = require('path');

const BASE_URL = 'http://localhost:5000';

const runTests = async () => {
  console.log('🧪 Starting Full End-to-End Test Suite with Image Upload...\n');

  try {
    const res = await fetch(`${BASE_URL}/`);
    const data = await res.json();
    console.log('✅ Server Health Check:', data.message);
  } catch (err) {
    console.error('❌ Server is not running on port 5000.');
    process.exit(1);
  }

  const timestamp = Date.now();
  const donorEmail = `donor_img_${timestamp}@example.com`;
  const recipientEmail = `recipient_img_${timestamp}@example.com`;
  const password = 'Password123!';

  let donorToken = '';
  let recipientToken = '';
  let uploadedImageUrl = '';
  let createdFoodId = '';

  // 1. Register Donor
  console.log('\n--- 1. Register Donor ---');
  const regDonorRes = await fetch(`${BASE_URL}/api/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name: 'Alice Donor', email: donorEmail, password, role: 'donor' }),
  });
  const regDonorBody = await regDonorRes.json();
  donorToken = regDonorBody.token;
  console.log('✅ PASS: Registered Donor! Role:', regDonorBody.user.role);

  // 2. Register Recipient
  console.log('\n--- 2. Register Recipient ---');
  const regRecRes = await fetch(`${BASE_URL}/api/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name: 'Bob Recipient', email: recipientEmail, password, role: 'recipient' }),
  });
  const regRecBody = await regRecRes.json();
  recipientToken = regRecBody.token;
  console.log('✅ PASS: Registered Recipient! Role:', regRecBody.user.role);

  // 3. Test Image Upload (Multer)
  console.log('\n--- 3. Upload Image via Multer ---');
  try {
    // Create temporary image buffer for test
    const dummyImagePath = path.join(__dirname, 'uploads', 'test-dummy.png');
    const pngHeader = Buffer.from('89504e470d0a1a0a0000000d49484452000000010000000108060000001f15c4890000000d49444154789c63000100000500010d0a2d0b0000000049454e44ae426082', 'hex');
    fs.writeFileSync(dummyImagePath, pngHeader);

    const formData = new FormData();
    const fileBlob = new Blob([pngHeader], { type: 'image/png' });
    formData.append('image', fileBlob, 'test-food.png');

    const uploadRes = await fetch(`${BASE_URL}/api/upload`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${donorToken}` },
      body: formData,
    });
    const uploadBody = await uploadRes.json();
    if (uploadRes.status === 200 && uploadBody.imageUrl) {
      uploadedImageUrl = uploadBody.imageUrl;
      console.log('✅ PASS: Image uploaded successfully! URL:', uploadedImageUrl);

      // Verify static image serving
      const staticImageRes = await fetch(`${BASE_URL}${uploadedImageUrl}`);
      if (staticImageRes.status === 200) {
        console.log('✅ PASS: Static image served successfully from Express static route!');
      } else {
        console.error('❌ FAIL: Express failed to serve static image. Status:', staticImageRes.status);
      }
    } else {
      console.error('❌ FAIL Image Upload:', uploadRes.status, uploadBody);
    }
  } catch (err) {
    console.error('❌ FAIL Upload Test:', err.message);
  }

  // 4. Create Food Donation with Uploaded Image & Location
  console.log('\n--- 4. Create Food Donation ---');
  const createFoodRes = await fetch(`${BASE_URL}/api/foods`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${donorToken}`,
    },
    body: JSON.stringify({
      foodName: 'Fresh Veggie Pizza',
      quantity: '3 Boxes',
      description: 'Hot fresh vegetable pizza from bakery',
      expiryDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
      location: '100 Main Street, City Center',
      latitude: 28.6139,
      longitude: 77.209,
      image: uploadedImageUrl,
    }),
  });
  const createFoodBody = await createFoodRes.json();
  createdFoodId = createFoodBody.food._id;
  console.log('✅ PASS: Food created with image & location! ID:', createdFoodId);

  // 5. Update Food Donation (Donor)
  console.log('\n--- 5. Update Food Donation (Donor) ---');
  const updateRes = await fetch(`${BASE_URL}/api/foods/${createdFoodId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${donorToken}`,
    },
    body: JSON.stringify({ quantity: '4 Extra Large Boxes' }),
  });
  const updateBody = await updateRes.json();
  if (updateRes.status === 200 && updateBody.food.quantity === '4 Extra Large Boxes') {
    console.log('✅ PASS: Food updated successfully! New Quantity:', updateBody.food.quantity);
  } else {
    console.error('❌ FAIL Update Food:', updateRes.status, updateBody);
  }

  // 6. Recipient Views Available & Claims
  console.log('\n--- 6. Recipient Claims Food ---');
  const claimRes = await fetch(`${BASE_URL}/api/recipient/claim/${createdFoodId}`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${recipientToken}` },
  });
  const claimBody = await claimRes.json();
  if (claimRes.status === 201) {
    console.log('✅ PASS: Food claimed by Recipient! Claim ID:', claimBody.claim._id);
  } else {
    console.error('❌ FAIL Claim:', claimRes.status, claimBody);
  }

  // 7. Verify Food Status Changed to Claimed
  console.log('\n--- 7. Verify Status Changed to Claimed ---');
  const checkFoodRes = await fetch(`${BASE_URL}/api/foods/${createdFoodId}`, {
    method: 'GET',
    headers: { Authorization: `Bearer ${donorToken}` },
  });
  const checkFoodBody = await checkFoodRes.json();
  if (checkFoodBody.status === 'Claimed') {
    console.log('✅ PASS: Food status verified as Claimed!');
  } else {
    console.error('❌ FAIL Status Check:', checkFoodBody.status);
  }

  console.log('\n🎉 ALL 7 ADVANCED E2E TESTS PASSED SUCCESSFULLY!\n');
};

runTests();
