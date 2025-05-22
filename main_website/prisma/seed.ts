import { PrismaClient, Gender, JOBTYPE, AppointmentStatus } from "@prisma/client";
import { fakerDE as faker } from "@faker-js/faker";
import { generateRandomColor } from "../utils";

const prisma = new PrismaClient();

async function seed() {
  console.log("Seeding data...");

  // Create 10 doctors
  const doctors = [];
  for (let i = 0; i < 10; i++) {
    const doctor = await prisma.doctor.create({
      data: {
        id: faker.string.uuid(),
        email: faker.internet.email(),
        name: faker.name.fullName(),
        specialization: faker.name.jobType(),
        license_number: faker.string.uuid(),
        phone: faker.phone.number(),
        address: faker.address.streetAddress(),
        city: faker.address.city(),
        state: faker.address.state(),
        zip: faker.address.zipCode(),
        npi_number: faker.string.uuid(),
        department: faker.company.name(),
        availability_status: "ACTIVE",
        colorCode: generateRandomColor(),
        type: i % 2 === 0 ? JOBTYPE.FULL : JOBTYPE.PART,
        working_days: {
          create: [
            {
              day: "Monday",
              start_time: "08:00",
              close_time: "17:00",
            },
            {
              day: "Wednesday",
              start_time: "08:00",
              close_time: "17:00",
            },
          ],
        },
      },
    });
    doctors.push(doctor);
  }

  // Create 20 patients
  const patients = [];
  for (let i = 0; i < 20; i++) {
    const patient = await prisma.patient.create({
      data: {
        id: faker.string.uuid(),
        first_name: faker.name.firstName(),
        last_name: faker.name.lastName(),
        date_of_birth: faker.date.birthdate(),
        gender: i % 2 === 0 ? Gender.MALE : Gender.FEMALE,
        phone: faker.phone.number(),
        email: faker.internet.email(),
        height: parseFloat(faker.number.float({ min: 150, max: 200 }).toFixed(2)),
        weight: parseFloat(faker.number.float({ min: 45, max: 120 }).toFixed(2)),
        address: faker.address.streetAddress(),
        city: faker.address.city(),
        state: faker.address.state(),
        zip_code: faker.address.zipCode(),
        emergency_contact_name: faker.name.fullName(),
        emergency_contact_number: faker.phone.number(),
        relation: "Sibling",
        blood_group: i % 4 === 0 ? "O+" : "A+",
        allergies: faker.lorem.words(2),
        medical_conditions: faker.lorem.words(3),
        privacy_consent: true,
        service_consent: true,
        medical_consent: true,
        colorCode: generateRandomColor(),
        preferred_contact_method: "Phone",
        preferred_appointment_type: "Both",
        marital_status: "single",
      },
    });
    patients.push(patient);
  }

  // Create Appointments
  for (let i = 0; i < 20; i++) {
    const doctor = doctors[Math.floor(Math.random() * doctors.length)];
    const patient = patients[Math.floor(Math.random() * patients.length)];

    await prisma.appointment.create({
      data: {
        patient_id: patient.id,
        doctor_id: doctor.id,
        appointment_date: faker.date.soon(),
        time: "10:00",
        status: i % 4 === 0 ? AppointmentStatus.PENDING : AppointmentStatus.SCHEDULED,
        type: "Checkup",
        reason: faker.lorem.sentence(),
        mode: i % 2 === 0 ? "In Person" : "Virtual",
        note: faker.lorem.sentence(),
        created_at: new Date(),
        updated_at: new Date(),
      },
    });
  }

  console.log("Seeding complete!");
  await prisma.$disconnect();
}

seed().catch((e) => {
  console.error(e);
  prisma.$disconnect();
  process.exit(1);
});