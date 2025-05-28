import { PrismaClient, Gender, JOBTYPE, Role } from "@prisma/client";
import { fakerDE as faker } from "@faker-js/faker";

const prisma = new PrismaClient();

async function seed() {
  console.log("Seeding data...");

  // Create doctors
  const doctors = await Promise.all(
    Array(5).fill(null).map(async () => {
      const firstName = faker.person.firstName();
      const lastName = faker.person.lastName();
      return prisma.doctor.create({
        data: {
          id: faker.string.uuid(),
          email: faker.internet.email({ firstName, lastName }),
          name: `${firstName} ${lastName}`,
          specialization: faker.helpers.arrayElement(['Cardiology', 'Neurology', 'Pediatrics', 'Dermatology', 'Orthopedics']),
          license_number: faker.string.alphanumeric(8).toUpperCase(),
          phone: faker.phone.number(),
          address: faker.location.streetAddress(),
          department: faker.helpers.arrayElement(['Internal Medicine', 'Surgery', 'Emergency', 'Outpatient']),
          city: faker.location.city(),
          state: faker.location.state(),
          zip: faker.location.zipCode(),
          npi_number: faker.string.numeric(10),
          type: faker.helpers.arrayElement(Object.values(JOBTYPE)),
          working_days: {
            create: [
              { day: 'Monday', start_time: '09:00', close_time: '17:00' },
              { day: 'Wednesday', start_time: '09:00', close_time: '17:00' },
              { day: 'Friday', start_time: '09:00', close_time: '17:00' }
            ]
          }
        }
      });
    })
  );

  // Create sample patients
  const patients = await Promise.all(
    Array(5).fill(null).map(async () => {
      const firstName = faker.person.firstName();
      const lastName = faker.person.lastName();
      return prisma.patient.create({
        data: {
          id: faker.string.uuid(),
          first_name: firstName,
          last_name: lastName,
          date_of_birth: faker.date.birthdate(),
          gender: faker.helpers.arrayElement(Object.values(Gender)),
          phone: faker.phone.number(),
          email: faker.internet.email({ firstName, lastName }),
          height: faker.number.float({ min: 150, max: 200, fractionDigits: 1 }),
          weight: faker.number.float({ min: 45, max: 120, fractionDigits: 1 }),
          address: faker.location.streetAddress(),
          emergency_contact_name: faker.person.fullName(),
          emergency_contact_number: faker.phone.number(),
          relation: faker.helpers.arrayElement(['Spouse', 'Parent', 'Sibling', 'Friend']),
          privacy_consent: true,
          service_consent: true,
          medical_consent: true,
          city: faker.location.city(),
          state: faker.location.state(),
          zip_code: faker.location.zipCode(),
          preferred_appointment_type: faker.helpers.arrayElement(['In-person', 'Virtual']),
          preferred_contact_method: faker.helpers.arrayElement(['Email', 'Phone', 'SMS']),
        }
      });
    })
  );

  console.log("Seeding complete!");
  await prisma.$disconnect();
}

seed().catch((e) => {
  console.error(e);
  prisma.$disconnect();
  process.exit(1);
});