import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function seedLabTests() {
  console.log('Seeding lab tests...');

  // ABO Group & RH Type
  await prisma.labTest.create({
    data: {
      name: 'ABO Group & RH Type',
      description: 'Find out your blood type and compatibility for blood transfusions or pregnancy',
      price: 37.99,
      created_at: new Date(),
      updated_at: new Date(),
    },
  });

  // B-HCG, Qualitative, Serum
  await prisma.labTest.create({
    data: {
      name: 'B-HCG, Qualitative, Serum',
      description: 'Detect pregnancy by measuring the hormone hCG in the blood.',
      price: 29.99,
      created_at: new Date(),
      updated_at: new Date(),
    },
  });

  // Basic Wellness Panel
  await prisma.labTest.create({
    data: {
      name: 'Basic Wellness Panel',
      description: 'Comprehensive health screening including CBC w/Diff, Comprehensive Metabolic Panel, Lipid Panel, Cortisol, Hemoglobin A1C, Microalbumin/Cre Ratio, and Thyroid Panel (Free T3, Free T4, TSH)',
      price: 128.00,
      created_at: new Date(),
      updated_at: new Date(),
    },
  });

  // STD Panel, Comprehensive
  await prisma.labTest.create({
    data: {
      name: 'STD Panel, Comprehensive',
      description: 'Comprehensive screening including HIV AB-AG SCREEN/REFLEX, RPR w/reflex, HERPES SIMPLEX V. I & II IgG, HIV Ag-Ab Screen, HIV-1 Antibody, HIV-1 Antigen, HIV-2 Antibody, N. GONORRHOEAE rRNA URINE, C. TRACHOMATIS RRNA URINE',
      price: 130.00,
      created_at: new Date(),
      updated_at: new Date(),
    },
  });

  // Hemoglobin A1C
  await prisma.labTest.create({
    data: {
      name: 'Hemoglobin A1C',
      description: 'Shows your average blood sugar over the past 3 months.',
      price: 15.00,
      created_at: new Date(),
      updated_at: new Date(),
    },
  });

  // PSA Free and Total
  await prisma.labTest.create({
    data: {
      name: 'PSA Free and Total',
      description: 'Evaluates prostate health by comparing free and total PSA levels.',
      price: 35.00,
      created_at: new Date(),
      updated_at: new Date(),
    },
  });

  // Vitamins and Minerals Panel
  await prisma.labTest.create({
    data: {
      name: 'Vitamins and Minerals Panel',
      description: 'Comprehensive panel including Vitamin B12 & Folate, Vitamin D 25-OH Total, Zinc, Phosphorus Serum, and Magnesium - checks for deficiency that may affect bones, energy, and immunity',
      price: 110.00,
      created_at: new Date(),
      updated_at: new Date(),
    },
  });

  console.log('Lab tests seeding complete!');
  await prisma.$disconnect();
}

seedLabTests().catch((e) => {
  console.error(e);
  prisma.$disconnect();
  process.exit(1);
}); 