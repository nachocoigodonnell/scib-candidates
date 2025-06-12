#!/usr/bin/env node
const XLSX = require('xlsx');

// Arrays for random names
const animals = [
  'Leon', 'Tigre', 'Oso', 'Lobo', 'Aguila', 'Halcon', 'Puma', 'Jaguar', 
  'Elefante', 'Rinoceronte', 'Hipopotamo', 'Jirafa', 'Cebra', 'Gacela',
  'Caballo', 'Toro', 'Bisonte', 'Alce', 'Ciervo', 'Liebre', 'Conejo',
  'Zorro', 'Mapache', 'Nutria', 'Castor', 'Ardilla', 'Marmota',
  'Condor', 'Buitre', 'Cuervo', 'Gaviota', 'Pelicano', 'Flamenco',
  'Delfin', 'Ballena', 'Orca', 'Tiburon', 'Atun', 'Salmon'
];

const colors = [
  'Rojo', 'Azul', 'Verde', 'Amarillo', 'Naranja', 'Violeta', 'Rosa', 'Marron',
  'Negro', 'Blanco', 'Gris', 'Dorado', 'Plateado', 'Turquesa', 'Magenta',
  'Coral', 'Salmon', 'Oliva', 'Indigo', 'Cian', 'Lima', 'Escarlata',
  'Carmesi', 'Borgona', 'Lavanda', 'Beige', 'Ocre', 'Sepia'
];

// Configuration
const DURATION_MINUTES = 2;
const API_URL = 'http://localhost:8080/candidates';

// Statistics
let totalCreated = 0;
let totalErrors = 0;

console.log(`🎯 Starting candidate generation for ${DURATION_MINUTES} minutes...`);
console.log(`📊 Generating dynamic Excel files with candidate data`);
console.log(`🌐 API endpoint: ${API_URL}`);
console.log('─'.repeat(50));

function getRandomElement(array) {
  return array[Math.floor(Math.random() * array.length)];
}

function generateRandomCandidate() {
  const firstName = getRandomElement(animals);
  const lastName = getRandomElement(colors);
  const yearsExperience = Math.floor(Math.random() * 10) + 1; // 1-10 years
  const seniority = yearsExperience > 5 ? 'Senior' : 'Junior';
  const availability = Math.random() > 0.5;
  
  return {
    firstName,
    lastName,
    yearsExperience,
    seniority,
    availability
  };
}

function createExcelFile(candidateData) {
  // Create Excel data matching the expected format
  const worksheetData = [
    [candidateData.seniority, candidateData.yearsExperience, candidateData.availability]
  ];
  
  // Create a new workbook and worksheet
  const workbook = XLSX.utils.book_new();
  const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);
  
  // Add the worksheet to the workbook
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
  
  // Generate Excel file buffer
  return XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });
}

async function createCandidate(candidateData) {
  const FormData = require('form-data');
  const fetch = require('node-fetch');
  
  // Generate Excel file with candidate's data
  const excelBuffer = createExcelFile(candidateData);
  const fileName = `${candidateData.firstName}_${candidateData.lastName}.xlsx`;
  
  const form = new FormData();
  form.append('firstName', candidateData.firstName);
  form.append('lastName', candidateData.lastName);
  form.append('excelFile', excelBuffer, fileName);
  
  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      body: form
    });
    
    if (response.ok) {
      const result = await response.json();
      totalCreated++;
      console.log(`✅ [${totalCreated}] Created: ${candidateData.firstName} ${candidateData.lastName} (${candidateData.seniority}, ${candidateData.yearsExperience}y, Available: ${candidateData.availability})`);
      return result;
    } else {
      const error = await response.text();
      totalErrors++;
      console.log(`❌ Error creating ${candidateData.firstName} ${candidateData.lastName}: ${error}`);
      return null;
    }
  } catch (error) {
    totalErrors++;
    console.log(`❌ Network error creating ${candidateData.firstName} ${candidateData.lastName}: ${error.message}`);
    return null;
  }
}

function getRandomInterval() {
  // Random interval between 5-15 seconds
  return Math.floor(Math.random() * 1000) + 500;
}

async function runCandidateGeneration() {
  const endTime = Date.now() + (DURATION_MINUTES * 60 * 1000);
  
  while (Date.now() < endTime) {
    const candidate = generateRandomCandidate();
    await createCandidate(candidate);
    
    // Random wait between candidates
    const waitTime = getRandomInterval();
    const remainingTime = Math.max(0, endTime - Date.now());
    
    if (remainingTime > waitTime) {
      console.log(`⏱️  Waiting ${waitTime/1000}s before next candidate...`);
      await new Promise(resolve => setTimeout(resolve, waitTime));
    } else {
      console.log(`⏰ Time remaining (${remainingTime}ms) is less than wait time, finishing...`);
      break;
    }
  }
  
  console.log('─'.repeat(50));
  console.log(`🏁 Generation completed!`);
  console.log(`📊 Statistics:`);
  console.log(`   - Total created: ${totalCreated}`);
  console.log(`   - Total errors: ${totalErrors}`);
  console.log(`   - Success rate: ${totalCreated > 0 ? ((totalCreated / (totalCreated + totalErrors)) * 100).toFixed(1) : 0}%`);
  console.log(`🎉 Done! Check your Grafana dashboard to see the metrics.`);
}

// Install required dependencies check
async function checkDependencies() {
  try {
    require('node-fetch');
    require('form-data');
    require('xlsx');
  } catch (error) {
    console.error('❌ Missing required dependencies. Please run:');
    console.error('npm install node-fetch form-data xlsx');
    process.exit(1);
  }
}

// Main execution
async function main() {
  await checkDependencies();
  await runCandidateGeneration();
  process.exit(0);
}

// Handle graceful shutdown
process.on('SIGINT', () => {
  console.log('\n🛑 Generation interrupted by user');
  console.log(`📊 Final statistics:`);
  console.log(`   - Total created: ${totalCreated}`);
  console.log(`   - Total errors: ${totalErrors}`);
  process.exit(0);
});

// Run the script
main().catch(error => {
  console.error('💥 Unexpected error:', error);
  process.exit(1);
});