const mongoose = require('mongoose');

// Use your exact MongoDB Atlas URI
const MONGODB_URI = 'mongodb+srv://akash:akashgowda4142@cluster0.upxzdpd.mongodb.net/student_management?retryWrites=true&w=majority';

console.log('🔗 Testing MongoDB Atlas connection...');
console.log('URI:', MONGODB_URI.substring(0, 60) + '...');

mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 10000  // 10 seconds timeout
})
.then(() => {
  console.log('✅ SUCCESS: Connected to MongoDB Atlas!');
  console.log('📊 Database:', mongoose.connection.name);
  console.log('🏠 Host:', mongoose.connection.host);
  console.log('🎉 Connection test PASSED!');
  
  // Close connection
  mongoose.connection.close();
  process.exit(0);
})
.catch(err => {
  console.log('❌ FAILED: Connection error:', err.message);
  console.log('\n🔍 TROUBLESHOOTING:');
  console.log('1. 🔑 Check if username/password is correct');
  console.log('2. 🌐 Check internet connection');
  console.log('3. 🛡️  Go to MongoDB Atlas → Network Access → Add IP Address → Allow from anywhere (0.0.0.0/0)');
  console.log('4. ⏰ Wait 2 minutes after whitelisting IP');
  console.log('5. 🔄 Try changing password in MongoDB Atlas');
  
  process.exit(1);
});