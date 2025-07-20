#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🧪 Reino dos Brinquedos - Comprehensive Test Suite\n');

// Test configuration
const testSuites = [
  {
    name: 'Unit Tests - Controllers',
    command: 'npm run test:unit',
    description: 'Testing individual controller functions'
  },
  {
    name: 'Database Tests',
    command: 'npm run test:database',
    description: 'Testing database schema and operations'
  },
  {
    name: 'Integration Tests',
    command: 'npm run test:integration',
    description: 'Testing complete API workflows'
  },
  {
    name: 'Coverage Report',
    command: 'npm run test:coverage',
    description: 'Generating test coverage report'
  }
];

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m'
};

function colorize(text, color) {
  return `${colors[color]}${text}${colors.reset}`;
}

function printHeader(text) {
  console.log(colorize(`\n${'='.repeat(60)}`, 'cyan'));
  console.log(colorize(`  ${text}`, 'bright'));
  console.log(colorize(`${'='.repeat(60)}`, 'cyan'));
}

function printSection(text) {
  console.log(colorize(`\n${'─'.repeat(40)}`, 'blue'));
  console.log(colorize(`  ${text}`, 'yellow'));
  console.log(colorize(`${'─'.repeat(40)}`, 'blue'));
}

async function runCommand(command, description) {
  try {
    console.log(colorize(`\n🚀 ${description}...`, 'blue'));
    console.log(colorize(`   Command: ${command}`, 'magenta'));
    
    const output = execSync(command, { 
      encoding: 'utf8',
      stdio: 'pipe',
      cwd: __dirname
    });
    
    console.log(colorize('✅ SUCCESS', 'green'));
    return { success: true, output };
  } catch (error) {
    console.log(colorize('❌ FAILED', 'red'));
    console.log(colorize(`   Error: ${error.message}`, 'red'));
    return { success: false, error: error.message, output: error.stdout };
  }
}

async function checkPrerequisites() {
  printSection('Checking Prerequisites');
  
  // Check if node_modules exists
  if (!fs.existsSync(path.join(__dirname, 'node_modules'))) {
    console.log(colorize('❌ node_modules not found. Run: npm install', 'red'));
    process.exit(1);
  }
  
  // Check if test database can be created
  try {
    execSync('npx prisma generate', { stdio: 'pipe' });
    console.log(colorize('✅ Prisma client generated', 'green'));
  } catch (error) {
    console.log(colorize('❌ Failed to generate Prisma client', 'red'));
    process.exit(1);
  }
  
  console.log(colorize('✅ All prerequisites met', 'green'));
}

async function runTestSuite() {
  const results = [];
  let totalTests = 0;
  let passedTests = 0;
  let failedTests = 0;
  
  for (const suite of testSuites) {
    printSection(suite.name);
    const result = await runCommand(suite.command, suite.description);
    results.push({ ...suite, ...result });
    
    if (result.success) {
      passedTests++;
    } else {
      failedTests++;
    }
    totalTests++;
  }
  
  return { results, totalTests, passedTests, failedTests };
}

function generateReport(testResults) {
  printHeader('Test Results Summary');
  
  console.log(colorize(`\n📊 Test Suite Results:`, 'bright'));
  console.log(colorize(`   Total Suites: ${testResults.totalTests}`, 'blue'));
  console.log(colorize(`   Passed: ${testResults.passedTests}`, 'green'));
  console.log(colorize(`   Failed: ${testResults.failedTests}`, 'red'));
  
  const successRate = ((testResults.passedTests / testResults.totalTests) * 100).toFixed(1);
  console.log(colorize(`   Success Rate: ${successRate}%`, successRate > 80 ? 'green' : 'yellow'));
  
  console.log(colorize(`\n📋 Detailed Results:`, 'bright'));
  testResults.results.forEach(result => {
    const status = result.success ? colorize('✅ PASS', 'green') : colorize('❌ FAIL', 'red');
    console.log(`   ${status} ${result.name}`);
    if (!result.success) {
      console.log(colorize(`      Error: ${result.error}`, 'red'));
    }
  });
  
  // Coverage information
  const coverageFile = path.join(__dirname, 'coverage', 'coverage-summary.json');
  if (fs.existsSync(coverageFile)) {
    try {
      const coverage = JSON.parse(fs.readFileSync(coverageFile, 'utf8'));
      const totalCoverage = coverage.total;
      
      console.log(colorize(`\n📈 Code Coverage:`, 'bright'));
      console.log(colorize(`   Lines: ${totalCoverage.lines.pct}%`, 'blue'));
      console.log(colorize(`   Functions: ${totalCoverage.functions.pct}%`, 'blue'));
      console.log(colorize(`   Branches: ${totalCoverage.branches.pct}%`, 'blue'));
      console.log(colorize(`   Statements: ${totalCoverage.statements.pct}%`, 'blue'));
    } catch (error) {
      console.log(colorize('⚠️  Could not read coverage report', 'yellow'));
    }
  }
  
  // Recommendations
  console.log(colorize(`\n💡 Recommendations:`, 'bright'));
  if (testResults.failedTests === 0) {
    console.log(colorize('   🎉 All tests passed! Great job!', 'green'));
    console.log(colorize('   🚀 Ready for deployment', 'green'));
  } else {
    console.log(colorize('   🔧 Fix failing tests before deployment', 'yellow'));
    console.log(colorize('   📝 Review error messages above', 'yellow'));
  }
  
  console.log(colorize(`\n📁 Reports Generated:`, 'bright'));
  console.log(colorize(`   Coverage: ./coverage/lcov-report/index.html`, 'blue'));
  console.log(colorize(`   JSON: ./coverage/coverage-final.json`, 'blue'));
}

async function main() {
  try {
    printHeader('Reino dos Brinquedos Test Suite');
    
    await checkPrerequisites();
    const testResults = await runTestSuite();
    generateReport(testResults);
    
    printHeader('Test Execution Complete');
    
    // Exit with appropriate code
    process.exit(testResults.failedTests > 0 ? 1 : 0);
    
  } catch (error) {
    console.error(colorize(`\n💥 Fatal Error: ${error.message}`, 'red'));
    process.exit(1);
  }
}

// Handle command line arguments
const args = process.argv.slice(2);
if (args.includes('--help') || args.includes('-h')) {
  console.log(colorize('Reino dos Brinquedos Test Suite', 'bright'));
  console.log('\nUsage: node run-tests.js [options]');
  console.log('\nOptions:');
  console.log('  --help, -h     Show this help message');
  console.log('  --coverage     Run only coverage tests');
  console.log('  --unit         Run only unit tests');
  console.log('  --integration  Run only integration tests');
  console.log('\nExamples:');
  console.log('  node run-tests.js              # Run all tests');
  console.log('  node run-tests.js --unit       # Run only unit tests');
  console.log('  node run-tests.js --coverage   # Run coverage report');
  process.exit(0);
}

// Filter test suites based on arguments
if (args.includes('--unit')) {
  testSuites.splice(1); // Keep only unit tests
} else if (args.includes('--integration')) {
  testSuites.splice(0, 2); // Keep only integration tests
  testSuites.splice(1); // Remove coverage
} else if (args.includes('--coverage')) {
  testSuites.splice(0, 3); // Keep only coverage
}

// Run the test suite
main();
