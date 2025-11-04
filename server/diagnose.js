import dotenv from 'dotenv';
import { execSync } from 'child_process';

dotenv.config();

console.log('=== Azure SQL Connection Diagnostics ===\n');

console.log('1. Environment Variables:');
console.log(`   DB_SERVER: ${process.env.DB_SERVER}`);
console.log(`   DB_DATABASE: ${process.env.DB_DATABASE}`);
console.log(`   DB_USER: ${process.env.DB_USER}`);
console.log(`   DB_PASSWORD: ${process.env.DB_PASSWORD ? '***SET***' : '***NOT SET***'}`);

console.log('\n2. Testing DNS Resolution:');
try {
  const result = execSync(`nslookup ${process.env.DB_SERVER}`, { encoding: 'utf-8' });
  console.log('   ✅ DNS resolves successfully');
  console.log(result);
} catch (err) {
  console.log('   ❌ DNS resolution failed');
  console.log(err.message);
}

console.log('\n3. Testing Port Connectivity:');
try {
  // Try to telnet (Windows equivalent)
  const result = execSync(`Test-NetConnection -ComputerName ${process.env.DB_SERVER} -Port 1433 -InformationLevel Detailed`,
    { encoding: 'utf-8', shell: 'powershell.exe' });
  console.log(result);
} catch (err) {
  console.log('   ❌ Port 1433 is blocked or unreachable');
  console.log('\n   This confirms a network/firewall issue.');
  console.log('   Possible causes:');
  console.log('   - Azure SQL firewall not configured correctly');
  console.log('   - Corporate/ISP firewall blocking port 1433');
  console.log('   - VPN or proxy interference');
}

console.log('\n4. Password Check:');
const password = process.env.DB_PASSWORD || '';
if (password.includes('!') || password.includes('.')) {
  console.log('   ⚠️  Password contains special characters (!, .)');
  console.log('   This should work but might need escaping');
}

console.log('\n5. Recommendations:');
console.log('   - Verify you are on SQL SERVER settings, not database settings');
console.log('   - Try removing the newRule (0.0.0.0-255.255.255.255) and add specific IP');
console.log('   - Check if your network/ISP blocks outbound port 1433');
console.log('   - Try from a different network (mobile hotspot) to rule out ISP blocking');
