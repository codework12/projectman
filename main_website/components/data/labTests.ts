import { LabTest } from '../models/LabTest';

export const labTests: LabTest[] = [
  {
    id: '1',
    code: '00029',
    name: 'ABO Group & RH Type',
    description: 'Find out your blood type and compatibility for blood transfusions or pregnancy',
    price: 35.00,
    category: 'Blood'
  },
  {
    id: '2',
    code: '00112',
    name: 'Albumin',
    description: 'Measures a protein that shows how well your liver and kidneys are working',
    price: 5.50,
    category: 'Liver Function'
  },
  {
    id: '3',
    code: '00116',
    name: 'ALT',
    description: 'These help detect liver problems, such as inflammation or damage.',
    price: 7.00,
    category: 'Liver Function'
  },
  {
    id: '4',
    code: '00117',
    name: 'AST',
    description: 'These help detect liver problems, such as inflammation or damage.',
    price: 8.00,
    category: 'Liver Function'
  },
  {
    id: '5',
    code: '00115',
    name: 'Alkaline Phosphatase',
    description: 'These help detect liver problems, such as inflammation or damage.',
    price: 6.00,
    category: 'Liver Function'
  },
  {
    id: '6',
    code: '00141',
    name: 'AFP (Tumor Marker)',
    description: 'Screens for certain liver cancers or liver disease.',
    price: 29.00,
    category: 'Liver Function'
  },
  {
    id: '7',
    code: '00121',
    name: 'Amylase',
    description: 'Help check for pancreas issues like pancreatitis or digestive problems.',
    price: 5.00,
    category: 'Pancreas'
  },
  {
    id: '8',
    code: '00122',
    name: 'Lipase',
    description: 'Help check for pancreas issues like pancreatitis or digestive problems.',
    price: 10.00,
    category: 'Pancreas'
  },
  {
    id: '9',
    code: 'ANAX',
    name: 'ANA Screen w/Reflex to Components',
    description: 'Looks for signs of autoimmune diseases like lupus.',
    price: 24.00,
    category: 'Autoimmune'
  },
  {
    id: '10',
    code: '00014',
    name: 'Anemia Panel',
    description: 'Checks for low red blood cells, which can cause tiredness or weakness.',
    price: 35.00,
    category: 'Anemia'
  },
  {
    id: '11',
    code: 'L485',
    name: 'Sickle Cell Screen (Hemoglobin Solubility)',
    description: 'Screens for sickle cell trait or disease, which can affect blood flow and cause pain or other health issues.',
    price: 97.00,
    category: 'Anemia'
  },
  {
    id: '12',
    code: '00001',
    name: 'CBC w/Diff',
    description: 'Checks for infections, anemia, and overall blood health.',
    price: 8.00,
    category: 'Basic Wellness'
  },
  {
    id: '13',
    code: '00004',
    name: 'Comprehensive Metabolic Panel',
    description: 'Gives a full picture of your organ function, blood sugar, and electrolytes.',
    price: 8.50,
    category: 'Basic Wellness'
  },
  {
    id: '14',
    code: '00007',
    name: 'Lipid Panel',
    description: 'Measures cholesterol and fats to assess heart health.',
    price: 18.00,
    category: 'Basic Wellness'
  },
  {
    id: '15',
    code: 'VD25',
    name: 'Vitamin D, 25-OH, Total',
    description: 'Checks for vitamin D deficiency that may affect bones, energy, and immunity',
    price: 38.00,
    category: 'Vitamins and Minerals'
  },
  {
    id: '16',
    code: '00013',
    name: 'Thyroid Panel (Free T3, Free T4, TSH)',
    description: 'Checks if your thyroid is working properly, which affects energy, weight, mood, and metabolism.',
    price: 38.00,
    category: 'Thyroid Function'
  },
  {
    id: '17',
    code: 'S595',
    name: 'Chlamydia/Gonorrhea, Urine',
    description: 'Screens for common sexually transmitted infections',
    price: 70.00,
    category: 'STD Tests'
  },
  {
    id: '18',
    code: 'P311',
    name: 'HIV 5th Generation (Ag-Ab Screen, HIV1-Ab, HIV1-Ag, HIV2-Ab)',
    description: 'Screens for HIV infection',
    price: 38.00,
    category: 'STD Tests'
  },
  {
    id: '19',
    code: '00595',
    name: 'STD Panel, Comprehensive',
    description: 'Comprehensive screening for sexually transmitted infections',
    price: 125.00,
    category: 'STD Tests'
  },
  {
    id: '20',
    code: 'ED1',
    name: 'CardioPro Early Detection',
    description: 'Identifies early warning signs of heart disease.',
    price: 99.00,
    category: 'Cardiac Health'
  }
];

export const getUniqueCategories = (): string[] => {
  const categories = labTests.map(test => test.category);
  return [...new Set(categories)];
};

export const DRAW_FEE = 13.99;
